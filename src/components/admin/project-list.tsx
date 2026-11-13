"use client";

import { useMemo, useState } from "react";
import type { Project } from "@prisma/client";
import { toast } from "sonner";
import {
  ChevronDown,
  ExternalLink,
  FolderOpen,
  Inbox,
  Loader2,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectVisual } from "@/components/site/project-visual";
import { BrandIcon } from "@/components/site/brand-icon";
import { projectAccent, projectLead, projectYear } from "@/lib/project";
import { splitTags } from "@/lib/format";
import type { LiveStatus } from "@/hooks/use-live-projects";
import { cn } from "@/lib/utils";

type Sort = "new" | "old" | "az";

function RowSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-xl bg-card/60 p-3 ring-1 ring-foreground/10">
      <Skeleton className="size-16 shrink-0 rounded-lg" />
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

export function ProjectList({
  projects,
  total,
  status,
  live,
  reload,
  onSessionExpired,
}: {
  projects: Project[];
  total: number;
  status: LiveStatus;
  live: boolean;
  reload: () => void;
  onSessionExpired: () => void;
}) {
  const [query, setQuery] = useState("");
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [sort, setSort] = useState<Sort>("new");
  const [pendingDeletes, setPendingDeletes] = useState<Set<string>>(new Set());
  const [restoring, setRestoring] = useState(false);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    for (const p of projects) for (const t of splitTags(p.tags)) set.add(t);
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [projects]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = projects.filter((p) => {
      if (pendingDeletes.has(p.id)) return false;
      if (tagFilter && !splitTags(p.tags).includes(tagFilter)) return false;
      if (!q) return true;
      return [p.title, p.description, p.tags]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
    const sorted = [...list];
    if (sort === "new")
      sorted.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    else if (sort === "old")
      sorted.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    else sorted.sort((a, b) => a.title.localeCompare(b.title));
    return sorted;
  }, [projects, pendingDeletes, tagFilter, query, sort]);

  function revertDelete(id: string) {
    setPendingDeletes((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }

  async function restore(project: Project) {
    setRestoring(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: project.title,
          description: project.description,
          tags: splitTags(project.tags),
          imageUrl: project.imageUrl ?? "",
          githubLink: project.githubLink ?? "",
          liveLink: project.liveLink ?? "",
        }),
      });
      if (res.status === 201) {
        toast.success("Project restored.", {
          description: `“${project.title}” is back in the portfolio.`,
        });
        reload();
      } else if (res.status === 401) {
        toast.error("Session expired.", { description: "Sign in again." });
        onSessionExpired();
      } else {
        toast.error("Couldn't restore the project.", {
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

  async function remove(project: Project) {
    setPendingDeletes((prev) => new Set(prev).add(project.id));
    try {
      const res = await fetch(`/api/projects/${project.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Project deleted.", {
          description: `“${project.title}” was removed.`,
          action: {
            label: "Undo",
            onClick: () => restore(project),
          },
        });
        reload();
      } else if (res.status === 401) {
        revertDelete(project.id);
        toast.error("Session expired.", { description: "Sign in again." });
        onSessionExpired();
      } else {
        revertDelete(project.id);
        toast.error("Couldn't delete the project.", {
          description: "Please try again.",
        });
      }
    } catch {
      revertDelete(project.id);
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
          <p className="flex items-center gap-2 font-mono text-[11px] tracking-[0.22em] text-iris uppercase">
            <Inbox className="size-3.5" />
            Portfolio
          </p>
          <h2 className="mt-1.5 text-xl font-semibold tracking-tight">
            Published projects
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
              placeholder="Search projects by title, description or tag…"
              aria-label="Search projects"
              className="h-11 pl-10"
            />
          </div>
          <div className="relative">
            <SlidersHorizontal className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              aria-label="Sort projects"
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
                  ? "bg-iris/15 text-iris ring-iris/30"
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
                    ? "bg-iris/15 text-iris ring-iris/30"
                    : "bg-muted/50 text-muted-foreground ring-foreground/10 hover:text-foreground",
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {status === "loading" && (
          <div className="space-y-3" aria-busy="true" aria-label="Loading projects">
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
                Couldn&apos;t load the portfolio
              </h3>
              <p className="mx-auto max-w-sm text-sm text-muted-foreground">
                Something went wrong reaching /api/projects. Give it another try.
              </p>
            </div>
            <Button variant="outline" size="lg" className="rounded-full px-5" onClick={reload}>
              <RefreshCw className="size-4" />
              Try again
            </Button>
          </div>
        )}

        {status === "ready" && projects.length === 0 && (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-card/40 px-6 py-14 text-center">
            <span className="grid size-14 place-items-center rounded-2xl bg-iris/10 text-iris ring-1 ring-iris/20">
              <FolderOpen className="size-6" />
            </span>
            <div className="space-y-1.5">
              <h3 className="text-lg font-semibold tracking-tight">
                No projects yet
              </h3>
              <p className="mx-auto max-w-sm text-sm text-muted-foreground">
                Publish your first project with the form above — it will appear
                here and on the homepage instantly.
              </p>
            </div>
          </div>
        )}

        {status === "ready" && projects.length > 0 && visible.length === 0 && (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card/40 px-6 py-12 text-center">
            <Search className="size-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No projects match{query.trim() ? ` “${query.trim()}”` : ""}
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
            {visible.map((project, i) => {
              const tags = splitTags(project.tags);
              const accent = projectAccent(project);
              return (
                <li
                  key={project.id}
                  className="animate-row-in group flex items-center gap-4 rounded-xl bg-card/70 p-3 ring-1 ring-foreground/10 transition-colors hover:ring-iris/30"
                  style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}
                >
                  <ProjectVisual
                    imageUrl={project.imageUrl}
                    title={project.title}
                    seed={project.id}
                    accent={accent}
                    sizes="64px"
                    className="size-16 shrink-0 rounded-lg"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate font-semibold tracking-tight">
                        {project.title}
                      </h3>
                      <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
                        {projectYear(project)}
                      </span>
                    </div>
                    <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                      {projectLead(project)}
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
                        <Badge variant="ghost" className="rounded-full font-normal">
                          +{tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    {project.githubLink && (
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label={`${project.title} on GitHub`}
                        className="grid size-8 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        <BrandIcon name="github" className="size-4" />
                      </a>
                    )}
                    {project.liveLink && (
                      <a
                        href={project.liveLink}
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label={`${project.title} live site`}
                        className="grid size-8 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        <ExternalLink className="size-4" />
                      </a>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(project)}
                      aria-label={`Delete ${project.title}`}
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
            Showing {visible.length} of {projects.length} projects
          </p>
        )}
        {restoring && (
          <p className="flex items-center gap-2 font-mono text-xs text-iris">
            <Loader2 className="size-3.5 animate-spin" />
            Restoring…
          </p>
        )}
      </div>
    </section>
  );
}