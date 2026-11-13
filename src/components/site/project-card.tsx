import Link from "next/link";
import type { Project } from "@prisma/client";
import { ArrowUpRight } from "lucide-react";
import { ProjectVisual } from "./project-visual";
import { Badge } from "@/components/ui/badge";
import { accentVar, splitTags } from "@/lib/format";
import { projectAccent, projectLead, projectYear } from "@/lib/project";
import { cn } from "@/lib/utils";

export function ProjectCard({
  project,
  className,
}: {
  project: Project;
  className?: string;
}) {
  const tags = splitTags(project.tags);
  const accent = projectAccent(project);
  const year = projectYear(project);
  const lead = projectLead(project);

  return (
    <Link
      href={`/work/${project.id}`}
      className={cn(
        "card-hover group relative flex flex-col overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/10",
        className,
      )}
    >
      <div className="relative overflow-hidden">
        <ProjectVisual
          imageUrl={project.imageUrl}
          title={project.title}
          seed={project.id}
          accent={accent}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="aspect-[16/10] w-full transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        <span className="absolute top-3 left-3 rounded-full bg-background/70 px-2.5 py-1 font-mono text-[11px] font-medium text-foreground shadow-sm ring-1 ring-foreground/10 backdrop-blur-md">
          {year}
        </span>
        <span className="absolute right-3 bottom-3 grid size-9 translate-y-2 place-items-center rounded-full bg-background/80 text-foreground opacity-0 shadow-sm ring-1 ring-foreground/10 backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="size-4" />
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center gap-2 font-mono text-[11px] tracking-wide text-muted-foreground uppercase">
          <span
            className="size-1.5 rounded-full"
            style={{ background: accentVar(accent) }}
          />
          {tags[0] ?? "Project"}
        </div>
        <h3 className="text-lg leading-snug font-semibold tracking-tight transition-colors group-hover:text-iris">
          {project.title}
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {lead}
        </p>
        <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
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
    </Link>
  );
}