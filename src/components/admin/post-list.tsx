"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Post } from "@prisma/client";
import { toast } from "sonner";
import {
  ChevronDown,
  ExternalLink,
  FileText,
  Inbox,
  Loader2,
  Pencil,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { accentVar, formatDate, splitTags } from "@/lib/format";
import type { LiveStatus } from "@/hooks/use-live-posts";
import { cn } from "@/lib/utils";

type Sort = "new" | "old" | "az";

function RowSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-xl bg-card/60 p-3 ring-1 ring-foreground/10">
      <Skeleton className="size-12 shrink-0 rounded-lg" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-2/3" />
        <div className="flex gap-1.5">
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function PostList({
  posts,
  total,
  status,
  live,
  reload,
  onEdit,
  editingId,
  onSessionExpired,
}: {
  posts: Post[];
  total: number;
  status: LiveStatus;
  live: boolean;
  reload: () => void;
  onEdit: (post: Post) => void;
  editingId?: string | null;
  onSessionExpired: () => void;
}) {
  const [query, setQuery] = useState("");
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [sort, setSort] = useState<Sort>("new");
  const [pendingDeletes, setPendingDeletes] = useState<Set<string>>(new Set());
  const [restoring, setRestoring] = useState(false);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    for (const p of posts) for (const t of splitTags(p.tags)) set.add(t);
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [posts]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = posts.filter((p) => {
      if (pendingDeletes.has(p.id)) return false;
      if (tagFilter && !splitTags(p.tags).includes(tagFilter)) return false;
      if (!q) return true;
      return [p.title, p.excerpt, p.tags, p.slug]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
    const sorted = [...list];
    if (sort === "new")
      sorted.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
    else if (sort === "old")
      sorted.sort((a, b) => a.publishedAt.getTime() - b.publishedAt.getTime());
    else sorted.sort((a, b) => a.title.localeCompare(b.title));
    return sorted;
  }, [posts, pendingDeletes, tagFilter, query, sort]);

  function revertDelete(id: string) {
    setPendingDeletes((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }

  async function restore(post: Post) {
    setRestoring(true);
    try {
      const res = await fetch("/api/writing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          slug: post.slug,
          accent: post.accent,
          tags: splitTags(post.tags),
          readingMinutes: post.readingMinutes,
          featured: post.featured,
          publishedAt: post.publishedAt.toISOString(),
        }),
      });
      if (res.status === 201) {
        toast.success("Essay restored.", {
          description: `“${post.title}” is back in the notebook.`,
        });
        reload();
      } else if (res.status === 401) {
        toast.error("Session expired.", { description: "Sign in again." });
        onSessionExpired();
      } else {
        toast.error("Couldn't restore the essay.", {
          description: "Please try again.",
        });
      }
    } catch {
      toast.error("Network error.", {
        description: "Couldn't reach the server to restore.",
      });
    } finally {
      setRestoring(false);
    }
  }

  async function remove(post: Post) {
    setPendingDeletes((prev) => new Set(prev).add(post.id));
    try {
      const res = await fetch(`/api/writing/${post.id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Essay deleted.", {
          description: `“${post.title}” was removed.`,
          action: { label: "Undo", onClick: () => restore(post) },
        });
        reload();
      } else if (res.status === 401) {
        revertDelete(post.id);
        toast.error("Session expired.", { description: "Sign in again." });
        onSessionExpired();
      } else {
        revertDelete(post.id);
        toast.error("Couldn't delete the essay.", {
          description: "Please try again.",
        });
      }
    } catch {
      revertDelete(post.id);
      toast.error("Network error.", {
        description: "Couldn't reach the server to delete.",
      });
    }
  }

  const filtering = query.trim() !== "" || tagFilter !== null;

  return (
    <section className="animate-fade-up relative overflow-hidden rounded-3xl bg-card/50 ring-1 ring-foreground/10 [animation-delay:160ms]">
      <div className="flex flex-col gap-4 border-b border-border px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
        <div>
          <p className="flex items-center gap-2 font-mono text-[11px] tracking-[0.22em] text-magenta uppercase">
            <Inbox className="size-3.5" />
            Notebook
          </p>
          <h2 className="mt-1.5 text-xl font-semibold tracking-tight">
            Published essays
            <span className="ml-2 font-mono text-sm font-normal text-muted-foreground tabular-nums">
              {status === "ready" ? `(${total})` : ""}
            </span>
          </h2>
        </div>
        <span
          className={cn(
            "inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 font-mono text-[11px] tracking-wide ring-1",
            live
              ? "bg-success/10 text-success ring-success/25"
              : "bg-amber/10 text-amber ring-amber/25",
          )}
        >
          <span
            className={cn(
              "size-1.5 rounded-full",
              live ? "pulse-dot bg-success" : "bg-amber",
            )}
          />
          {live ? "Synced in real time" : "Periodic refresh"}
        </span>
      </div>

      <div className="space-y-4 p-6 sm:p-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search essays by title, excerpt, slug or tag…"
              aria-label="Search essays"
              className="h-11 pl-10"
            />
          </div>
          <div className="relative">
            <SlidersHorizontal className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              aria-label="Sort essays"
              className="h-11 w-full appearance-none rounded-lg border border-input bg-transparent pr-9 pl-10 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 sm:w-44 dark:bg-input/30"
            >
              <option value="new">Newest first</option>
              <option value="old">Oldest first</option>
              <option value="az">Title A–Z</option>
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        </div>

        {allTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setTagFilter(null)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium ring-1 transition-colors",
                tagFilter === null
                  ? "bg-magenta/15 text-magenta ring-magenta/30"
                  : "bg-muted/50 text-muted-foreground ring-foreground/10 hover:text-foreground",
              )}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setTagFilter((t) => (t === tag ? null : tag))}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium ring-1 transition-colors",
                  tagFilter === tag
                    ? "bg-magenta/15 text-magenta ring-magenta/30"
                    : "bg-muted/50 text-muted-foreground ring-foreground/10 hover:text-foreground",
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {status === "loading" && (
          <div className="space-y-3" aria-busy="true" aria-label="Loading essays">
            {Array.from({ length: 4 }).map((_, i) => (
              <RowSkeleton key={i} />
            ))}
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-destructive/30 bg-destructive/5 px-6 py-14 text-center">
            <span className="grid size-14 place-items-center rounded-2xl bg-destructive/10 text-destructive ring-1 ring-destructive/20">
              <TriangleAlert className="size-6" />
            </span>
            <div className="space-y-1.5">
              <h3 className="text-lg font-semibold tracking-tight">
                Couldn&apos;t load the notebook
              </h3>
              <p className="mx-auto max-w-sm text-sm text-muted-foreground">
                Something went wrong reaching /api/writing. Give it another try.
              </p>
            </div>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-5"
              onClick={reload}
            >
              <RefreshCw className="size-4" />
              Try again
            </Button>
          </div>
        )}

        {status === "ready" && posts.length === 0 && (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-card/40 px-6 py-14 text-center">
            <span className="grid size-14 place-items-center rounded-2xl bg-magenta/10 text-magenta ring-1 ring-magenta/20">
              <FileText className="size-6" />
            </span>
            <div className="space-y-1.5">
              <h3 className="text-lg font-semibold tracking-tight">
                No essays yet
              </h3>
              <p className="mx-auto max-w-sm text-sm text-muted-foreground">
                Publish your first essay with the form above — it will appear
                here and on the homepage instantly.
              </p>
            </div>
          </div>
        )}

        {status === "ready" && posts.length > 0 && visible.length === 0 && (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card/40 px-6 py-12 text-center">
            <Search className="size-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No essays match{query.trim() ? ` “${query.trim()}”` : ""}
              {tagFilter ? ` tagged “${tagFilter}”` : ""}.
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full"
              onClick={() => {
                setQuery("");
                setTagFilter(null);
              }}
            >
              Clear filters
            </Button>
          </div>
        )}

        {status === "ready" && visible.length > 0 && (
          <ul className="space-y-3">
            {visible.map((post, i) => {
              const tags = splitTags(post.tags);
              const isBeingEdited = editingId === post.id;
              return (
                <li
                  key={post.id}
                  className={cn(
                    "animate-row-in group flex items-center gap-4 rounded-xl bg-card/70 p-3 ring-1 transition-colors",
                    isBeingEdited
                      ? "ring-2 ring-iris/50"
                      : "ring-foreground/10 hover:ring-magenta/30",
                  )}
                  style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}
                >
                  <span
                    className="grid size-12 shrink-0 place-items-center rounded-lg text-white shadow-sm"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${accentVar(
                        post.accent,
                      )}, color-mix(in oklch, ${accentVar(
                        post.accent,
                      )} 55%, var(--magenta)))`,
                    }}
                  >
                    <FileText className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate font-semibold tracking-tight">
                        {post.title}
                      </h3>
                      {post.featured && (
                        <Badge
                          variant="secondary"
                          className="shrink-0 gap-1 rounded-full bg-amber/15 font-normal text-amber"
                        >
                          <Sparkles className="size-3" />
                          Featured
                        </Badge>
                      )}
                    </div>
                    <p className="mt-0.5 truncate font-mono text-[11px] text-muted-foreground">
                      /writing/{post.slug}
                    </p>
                    <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                      {post.excerpt}
                    </p>
                    <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                      {tags.slice(0, 3).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="rounded-full font-normal"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {tags.length > 3 && (
                        <Badge
                          variant="ghost"
                          className="rounded-full font-normal"
                        >
                          +{tags.length - 3}
                        </Badge>
                      )}
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {formatDate(post.publishedAt)} · {post.readingMinutes} min
                      </span>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <Link
                      href={`/writing/${post.slug}`}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={`Read ${post.title}`}
                      className="grid size-8 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <ExternalLink className="size-4" />
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(post)}
                      aria-label={`Edit ${post.title}`}
                      className="rounded-full text-muted-foreground hover:bg-iris/10 hover:text-iris"
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(post)}
                      aria-label={`Delete ${post.title}`}
                      className="rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {filtering && status === "ready" && visible.length > 0 && (
          <p className="font-mono text-xs text-muted-foreground">
            Showing {visible.length} of {posts.length} essays
          </p>
        )}
        {restoring && (
          <p className="flex items-center gap-2 font-mono text-xs text-magenta">
            <Loader2 className="size-3.5 animate-spin" />
            Restoring…
          </p>
        )}
      </div>
    </section>
  );
}