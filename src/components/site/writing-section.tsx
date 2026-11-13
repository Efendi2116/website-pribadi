"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, FileText, RefreshCw, TriangleAlert } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PostCard } from "@/components/site/post-card";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { useLivePosts } from "@/hooks/use-live-posts";
import { cn } from "@/lib/utils";

const GRID = "grid gap-6 sm:grid-cols-2 lg:grid-cols-3";

function CardSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-card p-6 ring-1 ring-foreground/10">
      <div className="flex items-center justify-between gap-3">
        <Skeleton className="h-3 w-32 rounded-full" />
        <Skeleton className="size-4 rounded" />
      </div>
      <Skeleton className="h-6 w-4/5" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <div className="mt-auto flex gap-1.5 pt-2">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
    </div>
  );
}

function Notice({
  icon,
  title,
  body,
  children,
  tone = "muted",
}: {
  icon: ReactNode;
  title: string;
  body: string;
  children?: ReactNode;
  tone?: "muted" | "danger";
}) {
  return (
    <div className="col-span-full flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-card/40 px-6 py-16 text-center">
      <span
        className={cn(
          "grid size-14 place-items-center rounded-2xl ring-1",
          tone === "danger"
            ? "bg-destructive/10 text-destructive ring-destructive/20"
            : "bg-magenta/10 text-magenta ring-magenta/20",
        )}
      >
        {icon}
      </span>
      <div className="space-y-1.5">
        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
        <p className="mx-auto max-w-sm text-sm leading-relaxed text-muted-foreground">
          {body}
        </p>
      </div>
      {children}
    </div>
  );
}

export function WritingSection() {
  const { posts, total, status, live, reload } = useLivePosts({ limit: 3 });

  return (
    <section
      id="writing"
      className="relative border-t border-border bg-card/20 py-20 sm:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-72 max-w-4xl"
        style={{
          backgroundImage:
            "radial-gradient(52% 60% at 50% 0%, color-mix(in oklch, var(--magenta) 12%, transparent), transparent 72%)",
        }}
      />
      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="From the notebook"
            title="Writing"
            description="Essays on the details that make interfaces feel considered — button physics, type scales, performance budgets, and the craft of CSS. Pulled live from the writing API."
            action={
              <Link
                href="/writing"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "rounded-full px-5",
                )}
              >
                All writing
                <ArrowRight className="size-4" />
              </Link>
            }
          />
        </Reveal>

        <div className="mt-10">
          {status === "loading" && (
            <div className={GRID} aria-busy="true" aria-label="Loading essays">
              {Array.from({ length: 3 }).map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          )}

          {status === "error" && (
            <div className={GRID}>
              <Notice
                tone="danger"
                icon={<TriangleAlert className="size-6" />}
                title="Couldn't load the writing"
                body="Something went wrong reaching /api/writing. Check the connection and give it another try."
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full px-5"
                  onClick={reload}
                >
                  <RefreshCw className="size-4" />
                  Try again
                </Button>
              </Notice>
            </div>
          )}

          {status === "ready" && posts.length === 0 && (
            <div className={GRID}>
              <Notice
                icon={<FileText className="size-6" />}
                title="No essays yet"
                body="The notebook is blank for now. New writing is on the way — check back soon."
              />
            </div>
          )}

          {status === "ready" && posts.length > 0 && (
            <>
              <div className={GRID}>
                {posts.map((post, i) => (
                  <Reveal key={post.id} delay={i * 80}>
                    <PostCard post={post} className="h-full" />
                  </Reveal>
                ))}
              </div>
              <Reveal delay={120}>
                <p className="mt-8 flex flex-wrap items-center justify-center gap-2 text-center font-mono text-xs tracking-wide text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1.5 ring-1 ring-foreground/10">
                    <span
                      className={cn(
                        "size-1.5 rounded-full",
                        live ? "pulse-dot bg-success" : "bg-amber",
                      )}
                    />
                    {live ? "Live · " : ""}Showing {posts.length} of {total}{" "}
                    essays
                  </span>
                  {total > posts.length && (
                    <Link
                      href="/writing"
                      className="inline-flex items-center gap-1 text-magenta underline-offset-4 hover:underline"
                    >
                      read the full notebook
                      <ArrowRight className="size-3.5" />
                    </Link>
                  )}
                </p>
              </Reveal>
            </>
          )}
        </div>
      </div>
    </section>
  );
}