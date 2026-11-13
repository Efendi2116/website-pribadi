"use client";

import { useState } from "react";
import type { Post } from "@prisma/client";
import type { LiveStatus } from "@/hooks/use-live-posts";
import { PostForm } from "./post-form";
import { PostList } from "./post-list";

export function WritingManager({
  posts,
  total,
  status,
  live,
  reload,
  onSessionExpired,
}: {
  posts: Post[];
  total: number;
  status: LiveStatus;
  live: boolean;
  reload: () => void;
  onSessionExpired: () => void;
}) {
  const [editing, setEditing] = useState<Post | null>(null);

  function handleEdit(post: Post) {
    setEditing(post);
    window.setTimeout(() => {
      document
        .getElementById("post-form")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  }

  function handleSaved() {
    reload();
    setEditing(null);
  }

  return (
    <div className="space-y-10">
      <PostForm
        key={editing?.id ?? "new"}
        editing={editing}
        onSaved={handleSaved}
        onCancelEdit={() => setEditing(null)}
        onSessionExpired={onSessionExpired}
      />
      <PostList
        posts={posts}
        total={total}
        status={status}
        live={live}
        reload={reload}
        onEdit={handleEdit}
        editingId={editing?.id ?? null}
        onSessionExpired={onSessionExpired}
      />
    </div>
  );
}