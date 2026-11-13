import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { splitTags } from "@/lib/format";
import { isAdmin } from "@/lib/auth";
import { broadcast } from "@/lib/realtime";
import { parsePostInput } from "@/lib/post-input";

// GET /api/writing — newest first, with optional ?search=, ?tag=, ?featured=1
// and ?limit=.
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const search = (params.get("search") ?? "").trim().toLowerCase();
  const tag = (params.get("tag") ?? "").trim().toLowerCase();
  const featuredOnly = params.get("featured") === "1";
  const limitRaw = params.get("limit");
  const limitNum = limitRaw ? Number.parseInt(limitRaw, 10) : Number.NaN;
  const limit =
    Number.isFinite(limitNum) && limitNum > 0 ? Math.min(100, limitNum) : null;

  let posts = await prisma.post.findMany({
    orderBy: { publishedAt: "desc" },
  });

  if (featuredOnly) posts = posts.filter((p) => p.featured);
  if (tag) {
    posts = posts.filter((p) =>
      splitTags(p.tags).some((t) => t.toLowerCase() === tag),
    );
  }
  if (search) {
    posts = posts.filter((p) =>
      [p.title, p.excerpt, p.tags].join(" ").toLowerCase().includes(search),
    );
  }

  const total = posts.length;
  if (limit) posts = posts.slice(0, limit);

  return Response.json({ posts, count: posts.length, total });
}

// POST /api/writing — publish a new essay. Admin only.
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

  const { values, errors } = parsePostInput(body);
  if (!values) {
    return Response.json(
      { error: "Validation failed.", fields: errors },
      { status: 400 },
    );
  }

  const existing = await prisma.post.findUnique({
    where: { slug: values.slug },
    select: { id: true },
  });
  if (existing) {
    return Response.json(
      {
        error: "That slug is already taken.",
        fields: { slug: "Another essay already uses this slug." },
      },
      { status: 409 },
    );
  }

  try {
    const post = await prisma.post.create({ data: values });
    revalidateTag("writing", { expire: 0 });
    broadcast("writing:created", { id: post.id, slug: post.slug });
    return Response.json({ post }, { status: 201 });
  } catch {
    return Response.json(
      { error: "Could not publish the essay right now." },
      { status: 500 },
    );
  }
}