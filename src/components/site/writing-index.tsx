"use client";

import { useMemo, useState } from "react";
import type { Post } from "@prisma/client";
import {
  FileText,
  RefreshCw,
  Search,
  SlidersHorizontal,
  TriangleAlert,
  X,
} from "lucide-react";
import { PostCard } from "./post-card";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useLivePosts } from "@/hooks/use-live-posts";
import { pluralize, splitTags } from "@/lib/format";
import { cn } from "@/lib/utils";

const GRID = "grid gap-6 md:grid-cols-2";

function CardSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-card p-6 ring-1 ring-foreground/10">
      <Skeleton className="h-3 w-32 rounded-full" />
      <Skeleton className="h-6 w-4/5" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
      </div>
      <div className="mt-auto flex gap-1.5 pt-2">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
    </div>
  );
}

export function WritingIndex({ initialPosts }: { initialPosts: Post[] }) {
  const { posts, total, status, live, reload } = useLivePosts();
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  // Server-rendered essays paint instantly; the live hook reconciles on mount.
  const list =
    status === "loading" && initialPosts.length > 0 ? initialPosts : posts;
  const count = status === "ready" ? total : initialPosts.length;

  const tags = useMemo(
    () =>
      Array.from(new Set(list.flatMap((p) => splitTags(p.tags)))).sort((a, b) =>
        a.localeCompare(b),
      ),
    [list],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return list.filter((p) => {
      const matchesTag = !activeTag || splitTags(p.tags).includes(activeTag);
      const matchesQuery =
        !q ||
        [p.title, p.excerpt, p.tags, p.slug].join(" ").toLowerCase().includes(q);
      return matchesTag && matchesQuery;
    });
  }, [list, activeTag, query]);

  const isFiltering = query.trim() !== "" || activeTag !== null;
  const showSkeleton = status === "loading" && initialPosts.length === 0;

  return (
    <div className="space-y-10">
      <Reveal>
        <SectionHeading
          eyebrow="Essays"
          title="Writing"
          description={`I write to think — ${pluralize(
            count,
            "essay",
          )} on the details that make interfaces feel considered, from button physics to type scales that survive real content.`}
        />
      </Reveal>

      <div className="space-y-8">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search essays, topics…"
                aria-label="Search writing"
                className="h-11 rounded-full pl-9"
              />
            </div>
            <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full bg-card px-2.5 py-1 ring-1 ring-foreground/10",
                )}
              >
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    live ? "pulse-dot bg-success" : "bg-amber",
                  )}
                />
                {live ? "Live" : "Syncing"}
              </span>
              <SlidersHorizontal className="size-3.5" />
              <span className="tabular-nums">
                {filtered.length} / {list.length}
              </span>
              {isFiltering && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 rounded-full"
                  onClick={() => {
                    setQuery("");
                    setActiveTag(null);
                  }}
                >
                  <X className="size-3.5" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveTag(null)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  activeTag === null
                    ? "border-transparent bg-primary text-primary-foreground"
                    : "border-border bg-card/50 text-muted-foreground hover:border-magenta/40 hover:text-foreground",
                )}
              >
                All
              </button>
              {tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() =>
                    setActiveTag((cur) => (cur === tag ? null : tag))
                  }
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                    activeTag === tag
                      ? "border-transparent bg-primary text-primary-foreground"
                      : "border-border bg-card/50 text-muted-foreground hover:border-magenta/40 hover:text-foreground",
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {showSkeleton && (
          <div className={GRID} aria-busy="true" aria-label="Loading essays">
            {Array.from({ length: 4 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-destructive/30 bg-destructive/5 px-6 py-16 text-center">
            <span className="grid size-14 place-items-center rounded-2xl bg-destructive/10 text-destructive ring-1 ring-destructive/20">
              <TriangleAlert className="size-6" />
            </span>
            <div className="space-y-1.5">
              <h3 className="text-lg font-semibold tracking-tight">
                Couldn&apos;t load the writing
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

        {status === "ready" && list.length === 0 && (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-card/40 px-6 py-16 text-center">
            <span className="grid size-14 place-items-center rounded-2xl bg-magenta/10 text-magenta ring-1 ring-magenta/20">
              <FileText className="size-6" />
            </span>
            <div className="space-y-1.5">
              <h3 className="text-lg font-semibold tracking-tight">
                No essays yet
              </h3>
              <p className="mx-auto max-w-sm text-sm text-muted-foreground">
                The notebook is blank for now. New writing is on the way.
              </p>
            </div>
          </div>
        )}

        {status === "ready" && list.length > 0 && filtered.length === 0 && (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card/40 px-6 py-16 text-center">
            <span className="grid size-12 place-items-center rounded-full bg-muted text-muted-foreground">
              <Search className="size-5" />
            </span>
            <p className="font-medium">No essays match that filter</p>
            <p className="max-w-xs text-sm text-muted-foreground">
              Try a different keyword or clear the filters to see everything.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-1 rounded-full"
              onClick={() => {
                setQuery("");
                setActiveTag(null);
              }}
            >
              <X className="size-3.5" />
              Clear filters
            </Button>
          </div>
        )}

        {filtered.length > 0 && (
          <div className={GRID}>
            {filtered.map((post, i) => (
              <Reveal key={post.id} delay={(i % 2) * 90}>
                <PostCard post={post} className="h-full" />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}