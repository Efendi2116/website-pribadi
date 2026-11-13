"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, FolderOpen, RefreshCw, TriangleAlert } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectCard } from "@/components/site/project-card";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { useLiveProjects } from "@/hooks/use-live-projects";
import { cn } from "@/lib/utils";

const GRID = "grid gap-6 sm:grid-cols-2 lg:grid-cols-3";

function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/10">
      <Skeleton className="aspect-[16/10] w-full rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-3 w-24 rounded-full" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="flex gap-1.5 pt-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
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
            : "bg-iris/10 text-iris ring-iris/20",
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

export function ProjectsSection() {
  const { projects, total, status, live, reload } = useLiveProjects({ limit: 6 });

  return (
    <section
      id="projects"
      className="relative mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-24"
    >
      <Reveal>
        <SectionHeading
          eyebrow="Selected work"
          title="Things I have designed & shipped"
          description="A few projects where design engineering, systems thinking, and a bit of play came together — pulled live from the projects API."
          action={
            <Link
              href="/work"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "rounded-full px-5",
              )}
            >
              All work
              <ArrowRight className="size-4" />
            </Link>
          }
        />
      </Reveal>

      <div className="mt-10">
        {status === "loading" && (
          <div className={GRID} aria-busy="true" aria-label="Loading projects">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        )}

        {status === "error" && (
          <div className={GRID}>
            <Notice
              tone="danger"
              icon={<TriangleAlert className="size-6" />}
              title="Couldn't load the projects"
              body="Something went wrong reaching /api/projects. Check the connection and give it another try."
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

        {status === "ready" && projects.length === 0 && (
          <div className={GRID}>
            <Notice
              icon={<FolderOpen className="size-6" />}
              title="No projects yet"
              body="The workshop is quiet for now. New work is on the way — check back soon."
            />
          </div>
        )}

        {status === "ready" && projects.length > 0 && (
          <>
            <div className={GRID}>
              {projects.map((project, i) => (
                <Reveal key={project.id} delay={i * 80}>
                  <ProjectCard project={project} className="h-full" />
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
                  {live ? "Live · " : ""}Showing {projects.length} of {total}{" "}
                  projects
                </span>
                {total > projects.length && (
                  <Link
                    href="/work"
                    className="inline-flex items-center gap-1 text-iris underline-offset-4 hover:underline"
                  >
                    view the full archive
                    <ArrowRight className="size-3.5" />
                  </Link>
                )}
              </p>
            </Reveal>
          </>
        )}
      </div>
    </section>
  );
}