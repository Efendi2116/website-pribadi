import { cacheLife, cacheTag } from "next/cache";
import type { Post as PrismaPost } from "@prisma/client";
import { prisma } from "@/lib/prisma";

// Essays are stored in the database so the admin console can add and edit them
// live. Reads are cached under the "writing" tag; mutations revalidate it.
export type Post = PrismaPost;

export async function getPosts(): Promise<Post[]> {
  "use cache";
  cacheLife("max");
  cacheTag("writing");
  return prisma.post.findMany({ orderBy: { publishedAt: "desc" } });
}

export async function getFeaturedPosts(): Promise<Post[]> {
  "use cache";
  cacheLife("max");
  cacheTag("writing");
  return prisma.post.findMany({
    where: { featured: true },
    orderBy: { publishedAt: "desc" },
  });
}

export async function getPost(slug: string): Promise<Post | null> {
  "use cache";
  cacheLife("max");
  cacheTag("writing");
  return prisma.post.findUnique({ where: { slug } });
}