import { cacheLife, cacheTag } from "next/cache";
import { prisma } from "./prisma";

export async function getProjects() {
  "use cache";
  cacheLife("max");
  cacheTag("projects");
  return prisma.project.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getFeaturedProjects() {
  "use cache";
  cacheLife("max");
  cacheTag("projects");
  return prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    take: 3,
  });
}

export async function getProject(id: string) {
  "use cache";
  cacheLife("max");
  cacheTag("projects");
  return prisma.project.findUnique({ where: { id } });
}

export async function getProjectCount() {
  "use cache";
  cacheLife("max");
  cacheTag("projects");
  return prisma.project.count();
}

// The public wall never exposes email — select only the display fields.
export async function getMessages() {
  "use cache";
  cacheLife("max");
  cacheTag("messages");
  return prisma.message.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    select: { id: true, name: true, message: true, createdAt: true },
  });
}

export async function getMessageCount() {
  "use cache";
  cacheLife("max");
  cacheTag("messages");
  return prisma.message.count();
}