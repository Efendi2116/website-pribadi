"use client";

import { useMemo, useState } from "react";
import type { Project } from "@prisma/client";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { ProjectCard } from "./project-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { splitTags } from "@/lib/format";
import { cn } from "@/lib/utils";

export function WorkBrowser({ projects }: { projects: Project[] }) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const tags = useMemo(
    () =>
      Array.from(new Set(projects.flatMap((p) => splitTags(p.tags)))).sort(),
    [projects],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      const matchesTag = !activeTag || splitTags(p.tags).includes(activeTag);
      const matchesQuery =
        !q ||
        [p.title, p.description, p.tags].join(" ").toLowerCase().includes(q);
      return matchesTag && matchesQuery;
    });
  }, [projects, activeTag, query]);

  const isFiltering = query.trim() !== "" || activeTag !== null;

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects, stacks…"
              aria-label="Search projects"
              className="h-11 rounded-full pl-9"
            />
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
            <SlidersHorizontal className="size-3.5" />
            <span className="tabular-nums">
              {filtered.length} / {projects.length}
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

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveTag(null)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              activeTag === null
                ? "border-transparent bg-primary text-primary-foreground"
                : "border-border bg-card/50 text-muted-foreground hover:border-iris/40 hover:text-foreground",
            )}
          >
            All
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveTag((cur) => (cur === tag ? null : tag))}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                activeTag === tag
                  ? "border-transparent bg-primary text-primary-foreground"
                  : "border-border bg-card/50 text-muted-foreground hover:border-iris/40 hover:text-foreground",
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card/40 px-6 py-20 text-center">
          <span className="grid size-12 place-items-center rounded-full bg-muted text-muted-foreground">
            <Search className="size-5" />
          </span>
          <p className="font-medium">No projects match that filter</p>
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
    </div>
  );
}