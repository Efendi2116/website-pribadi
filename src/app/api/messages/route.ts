import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/messages — leave a note on the guestbook wall. Email is stored but
// never returned or shown publicly.
export async function POST(request: NextRequest) {
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
  const name = typeof data.name === "string" ? data.name.trim() : "";
  const email = typeof data.email === "string" ? data.email.trim() : "";
  const message = typeof data.message === "string" ? data.message.trim() : "";

  const errors: Record<string, string> = {};
  if (name.length < 2 || name.length > 60) {
    errors.name = "Name must be between 2 and 60 characters.";
  }
  if (email.length > 200 || !EMAIL_RE.test(email)) {
    errors.email = "Enter a valid email address.";
  }
  if (message.length < 5 || message.length > 1000) {
    errors.message = "Message must be between 5 and 1000 characters.";
  }

  if (Object.keys(errors).length > 0) {
    return Response.json(
      { error: "Validation failed.", fields: errors },
      { status: 400 },
    );
  }

  try {
    const created = await prisma.message.create({
      data: { name, email, message },
    });
    revalidateTag("messages", { expire: 0 });
    return Response.json(
      {
        message: {
          id: created.id,
          name: created.name,
          message: created.message,
          createdAt: created.createdAt,
        },
      },
      { status: 201 },
    );
  } catch {
    return Response.json(
      { error: "Could not save your message right now." },
      { status: 500 },
    );
  }
}