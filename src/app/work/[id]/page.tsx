import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { getProject, getProjects } from "@/lib/data";
import { accentVar, formatDate, splitTags } from "@/lib/format";
import { projectAccent, projectLead, projectYear } from "@/lib/project";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BrandIcon } from "@/components/site/brand-icon";
import { ProjectVisual } from "@/components/site/project-visual";
import { Reveal } from "@/components/site/reveal";

type Params = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ id: project.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) return { title: "Project not found" };
  const lead = projectLead(project);
  return {
    title: project.title,
    description: lead,
    openGraph: {
      title: project.title,
      description: lead,
      type: "article",
    },
  };
}

function DetailFallback() {
  return (
    <div className="mx-auto w-full max-w-5xl animate-pulse px-4 py-16 sm:px-6">
      <div className="h-4 w-24 rounded bg-muted" />
      <div className="mt-8 h-12 w-2/3 rounded bg-muted" />
      <div className="mt-4 h-5 w-1/2 rounded bg-muted" />
      <div className="mt-10 aspect-[21/9] w-full rounded-3xl bg-muted" />
    </div>
  );
}

async function ProjectDetail({ params }: Params) {
  const { id } = await params;
  const [project, projects] = await Promise.all([
    getProject(id),
    getProjects(),
  ]);

  if (!project) notFound();

  const tags = splitTags(project.tags);
  const accentName = projectAccent(project);
  const accent = accentVar(accentName);
  const year = projectYear(project);
  const paragraphs = project.description.split(/\n{2,}/);
  const lead = paragraphs[0]?.trim() ?? "";
  const body = paragraphs.slice(1);
  const index = projects.findIndex((p) => p.id === project.id);
  const prev = index > 0 ? projects[index - 1] : null;
  const next = index < projects.length - 1 ? projects[index + 1] : null;

  return (
    <article className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <Link
        href="/work"
        className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
        All work
      </Link>

      <Reveal>
        <header className="mt-8 space-y-5">
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs tracking-wide text-muted-foreground uppercase">
            <span
              className="inline-flex items-center gap-2"
              style={{ color: accent }}
            >
              <span
                className="size-1.5 rounded-full"
                style={{ background: accent }}
              />
              {tags[0] ?? "Project"}
            </span>
            <span aria-hidden="true">·</span>
            <span>{year}</span>
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            {project.title}
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {lead}
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="rounded-full px-3 py-1 font-normal"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </header>
      </Reveal>

      <Reveal delay={100}>
        <ProjectVisual
          imageUrl={project.imageUrl}
          title={project.title}
          seed={project.id}
          accent={accentName}
          sizes="(max-width: 1024px) 100vw, 64rem"
          className="mt-10 aspect-[21/9] w-full rounded-3xl ring-1 ring-foreground/10"
        />
      </Reveal>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_18rem]">
        <Reveal delay={140}>
          <div className="prose-body">
            {body.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </Reveal>

        <Reveal delay={180}>
          <aside className="space-y-6 lg:sticky lg:top-24">
            <div className="space-y-4 rounded-2xl bg-card p-6 ring-1 ring-foreground/10">
              <h2 className="font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase">
                Project details
              </h2>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Year</dt>
                  <dd className="font-medium tabular-nums">{year}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Focus</dt>
                  <dd className="text-right font-medium">{tags[0] ?? "—"}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Added</dt>
                  <dd className="text-right font-medium">
                    {formatDate(project.createdAt)}
                  </dd>
                </div>
              </dl>

              {(project.liveLink || project.githubLink) && (
                <div className="flex flex-col gap-2 border-t border-border pt-4">
                  {project.liveLink && (
                    <a
                      href={project.liveLink}
                      target="_blank"
                      rel="noreferrer noopener"
                      className={cn(
                        buttonVariants({ size: "lg" }),
                        "h-10 w-full rounded-full",
                      )}
                    >
                      <ExternalLink className="size-4" />
                      Visit live
                    </a>
                  )}
                  {project.githubLink && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noreferrer noopener"
                      className={cn(
                        buttonVariants({ variant: "outline", size: "lg" }),
                        "h-10 w-full rounded-full",
                      )}
                    >
                      <BrandIcon name="github" className="size-4" />
                      Source code
                    </a>
                  )}
                </div>
              )}
            </div>

            {tags.length > 1 && (
              <div className="space-y-3 rounded-2xl bg-card p-6 ring-1 ring-foreground/10">
                <h2 className="font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase">
                  Stack & tags
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="rounded-full font-normal"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </Reveal>
      </div>

      {(prev || next) && (
        <nav className="mt-16 grid gap-4 border-t border-border pt-8 sm:grid-cols-2">
          {prev ? (
            <Link
              href={`/work/${prev.id}`}
              className="group flex flex-col gap-1 rounded-2xl bg-card/50 p-5 ring-1 ring-foreground/10 transition-colors hover:bg-card"
            >
              <span className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
                Previous
              </span>
              <span className="font-semibold tracking-tight transition-colors group-hover:text-iris">
                {prev.title}
              </span>
            </Link>
          ) : (
            <span className="hidden sm:block" />
          )}
          {next && (
            <Link
              href={`/work/${next.id}`}
              className="group flex flex-col gap-1 rounded-2xl bg-card/50 p-5 text-right ring-1 ring-foreground/10 transition-colors hover:bg-card sm:col-start-2"
            >
              <span className="inline-flex items-center justify-end gap-1.5 font-mono text-xs text-muted-foreground">
                Next
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
              <span className="font-semibold tracking-tight transition-colors group-hover:text-iris">
                {next.title}
              </span>
            </Link>
          )}
        </nav>
      )}
    </article>
  );
}

export default function ProjectPage({ params }: Params) {
  return (
    <Suspense fallback={<DetailFallback />}>
      <ProjectDetail params={params} />
    </Suspense>
  );
}