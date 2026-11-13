import type { Metadata } from "next";
import { getPosts } from "@/lib/posts";
import { site } from "@/lib/constants";
import { WritingIndex } from "@/components/site/writing-index";

export const metadata: Metadata = {
  title: "Writing",
  description: `Essays on design engineering, interaction craft, typography, performance, and creative coding by ${site.name}.`,
};

export default async function WritingPage() {
  const posts = await getPosts();
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <WritingIndex initialPosts={posts} />
    </div>
  );
}