import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import { broadcast } from "@/lib/realtime";

// DELETE /api/projects/[id] — admin-only removal, broadcast to live clients.
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin())) {
    return Response.json(
      { error: "Unauthorized. Admin sign-in required." },
      { status: 401 },
    );
  }

  const { id } = await params;

  try {
    await prisma.project.delete({ where: { id } });
    revalidateTag("projects", { expire: 0 });
    broadcast("project:deleted", { id });
    return Response.json({ ok: true, id });
  } catch {
    return Response.json({ error: "Project not found." }, { status: 404 });
  }
}