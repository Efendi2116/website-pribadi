import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import { broadcast } from "@/lib/realtime";
import { parsePostInput } from "@/lib/post-input";

type Context = { params: Promise<{ id: string }> };

// GET /api/writing/[id] — a single essay (used by the admin editor).
export async function GET(_request: NextRequest, { params }: Context) {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) {
    return Response.json({ error: "Essay not found." }, { status: 404 });
  }
  return Response.json({ post });
}

// PUT /api/writing/[id] — edit an existing essay. Admin only.
export async function PUT(request: NextRequest, { params }: Context) {
  if (!(await isAdmin())) {
    return Response.json(
      { error: "Unauthorized. Admin sign-in required." },
      { status: 401 },
    );
  }
  const { id } = await params;

  const current = await prisma.post.findUnique({ where: { id } });
  if (!current) {
    return Response.json({ error: "Essay not found." }, { status: 404 });
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

  const clash = await prisma.post.findUnique({
    where: { slug: values.slug },
    select: { id: true },
  });
  if (clash && clash.id !== id) {
    return Response.json(
      {
        error: "That slug is already taken.",
        fields: { slug: "Another essay already uses this slug." },
      },
      { status: 409 },
    );
  }

  try {
    const post = await prisma.post.update({ where: { id }, data: values });
    revalidateTag("writing", { expire: 0 });
    broadcast("writing:updated", { id: post.id, slug: post.slug });
    return Response.json({ post });
  } catch {
    return Response.json(
      { error: "Could not save the essay right now." },
      { status: 500 },
    );
  }
}

// DELETE /api/writing/[id] — remove an essay. Admin only.
export async function DELETE(_request: NextRequest, { params }: Context) {
  if (!(await isAdmin())) {
    return Response.json(
      { error: "Unauthorized. Admin sign-in required." },
      { status: 401 },
    );
  }
  const { id } = await params;
  try {
    const post = await prisma.post.delete({ where: { id } });
    revalidateTag("writing", { expire: 0 });
    broadcast("writing:deleted", { id: post.id, slug: post.slug });
    return Response.json({ ok: true, id: post.id });
  } catch {
    return Response.json({ error: "Essay not found." }, { status: 404 });
  }
}