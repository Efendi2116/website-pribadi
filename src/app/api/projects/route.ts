import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { splitTags } from "@/lib/format";
import { isAdmin } from "@/lib/auth";
import { broadcast } from "@/lib/realtime";

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

// GET /api/projects — newest first, with optional ?search=, ?tag= and ?limit=.
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const search = (params.get("search") ?? "").trim().toLowerCase();
  const tag = (params.get("tag") ?? "").trim().toLowerCase();
  const limitRaw = params.get("limit");
  const limitNum = limitRaw ? Number.parseInt(limitRaw, 10) : Number.NaN;
  const limit =
    Number.isFinite(limitNum) && limitNum > 0 ? Math.min(100, limitNum) : null;

  let projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });

  if (tag) {
    projects = projects.filter((p) =>
      splitTags(p.tags).some((t) => t.toLowerCase() === tag),
    );
  }
  if (search) {
    projects = projects.filter((p) =>
      [p.title, p.description, p.tags].join(" ").toLowerCase().includes(search),
    );
  }

  const total = projects.length;
  if (limit) projects = projects.slice(0, limit);

  return Response.json({ projects, count: projects.length, total });
}

// POST /api/projects — create a project. tags accepts an array or a
// comma-separated string; imageUrl/githubLink/liveLink are optional http(s) URLs.
export async function POST(request: NextRequest) {
  if (!(await isAdmin())) {
    return Response.json(
      { error: "Unauthorized. Admin sign-in required." },
      { status: 401 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    );
  }
  if (typeof body !== "object" || body === null) {
    return Response.json(
      { error: "Request body must be a JSON object." },
      { status: 400 },
    );
  }

  const data = body as Record<string, unknown>;
  const errors: Record<string, string> = {};

  const title = typeof data.title === "string" ? data.title.trim() : "";
  const description =
    typeof data.description === "string" ? data.description.trim() : "";
  const tags = Array.isArray(data.tags)
    ? data.tags
        .filter((t): t is string => typeof t === "string")
        .map((t) => t.trim())
        .filter(Boolean)
        .join(",")
    : typeof data.tags === "string"
      ? splitTags(data.tags).join(",")
      : "";

  if (title.length < 1 || title.length > 120) {
    errors.title = "Title must be between 1 and 120 characters.";
  }
  if (description.length < 1 || description.length > 5000) {
    errors.description = "Description must be between 1 and 5000 characters.";
  }
  if (!tags) {
    errors.tags = "Provide at least one tag (array or comma-separated string).";
  }

  const optionalUrl = (key: string): string | null => {
    const raw = data[key];
    if (raw === undefined || raw === null || raw === "") return null;
    if (typeof raw !== "string" || !isHttpUrl(raw.trim())) {
      errors[key] = "Must be a valid http(s) URL.";
      return null;
    }
    const trimmed = raw.trim();
    if (trimmed.length > 500) {
      errors[key] = "That URL is a little too long.";
      return null;
    }
    return trimmed;
  };

  const imageUrl = optionalUrl("imageUrl");
  const githubLink = optionalUrl("githubLink");
  const liveLink = optionalUrl("liveLink");

  if (Object.keys(errors).length > 0) {
    return Response.json(
      { error: "Validation failed.", fields: errors },
      { status: 400 },
    );
  }

  try {
    const project = await prisma.project.create({
      data: { title, description, tags, imageUrl, githubLink, liveLink },
    });
    revalidateTag("projects", { expire: 0 });
    broadcast("project:created", { id: project.id });
    return Response.json({ project }, { status: 201 });
  } catch {
    return Response.json(
      { error: "Could not create the project right now." },
      { status: 500 },
    );
  }
}