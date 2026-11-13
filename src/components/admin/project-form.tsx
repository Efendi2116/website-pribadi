"use client";

import { useMemo, useState, type FormEvent, type KeyboardEvent } from "react";
import type { Project } from "@prisma/client";
import { toast } from "sonner";
import {
  CheckCircle2,
  Image as ImageIcon,
  Link2,
  Loader2,
  Plus,
  Rocket,
  RotateCcw,
  Tag,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ProjectCard } from "@/components/site/project-card";
import { accentVar, splitTags } from "@/lib/format";
import { cn } from "@/lib/utils";

const TITLE_MAX = 120;
const DESC_MAX = 5000;
const TAG_MAX = 12;
const CHIP_ACCENTS = ["iris", "cyan", "amber", "magenta", "lime", "blue", "coral"];
const SUGGESTED = ["Next.js", "React", "TypeScript", "Design", "WebGL", "Prisma"];

type Values = {
  title: string;
  description: string;
  imageUrl: string;
  githubLink: string;
  liveLink: string;
};
type Errors = Partial<Record<keyof Values | "tags", string>>;

const EMPTY: Values = {
  title: "",
  description: "",
  imageUrl: "",
  githubLink: "",
  liveLink: "",
};

function isHttpUrl(value: string): boolean {
  if (!value.trim()) return true; // optional
  try {
    const url = new URL(value.trim());
    return (
      (url.protocol === "http:" || url.protocol === "https:") &&
      value.trim().length <= 500
    );
  } catch {
    return false;
  }
}

function validate(values: Values, tags: string[]): Errors {
  const errors: Errors = {};
  const title = values.title.trim();
  const description = values.description.trim();
  if (title.length < 1 || title.length > TITLE_MAX)
    errors.title = `Title must be between 1 and ${TITLE_MAX} characters.`;
  if (description.length < 1 || description.length > DESC_MAX)
    errors.description = `Description must be between 1 and ${DESC_MAX} characters.`;
  if (tags.length === 0) errors.tags = "Add at least one tag.";
  if (!isHttpUrl(values.imageUrl))
    errors.imageUrl = "Enter a valid http(s) image URL (or leave it empty).";
  if (!isHttpUrl(values.githubLink))
    errors.githubLink = "Enter a valid http(s) GitHub URL.";
  if (!isHttpUrl(values.liveLink))
    errors.liveLink = "Enter a valid http(s) live URL.";
  return errors;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="text-xs font-medium text-destructive">
      {message}
    </p>
  );
}

function TagField({
  tags,
  setTags,
  error,
}: {
  tags: string[];
  setTags: (updater: (prev: string[]) => string[]) => void;
  error?: string;
}) {
  const [draft, setDraft] = useState("");

  function commit(raw: string) {
    const pieces = splitTags(raw);
    if (pieces.length === 0) return;
    setTags((prev) => {
      const next = [...prev];
      for (const piece of pieces) {
        const tag = piece.slice(0, 30);
        if (
          tag &&
          next.length < TAG_MAX &&
          !next.some((t) => t.toLowerCase() === tag.toLowerCase())
        ) {
          next.push(tag);
        }
      }
      return next;
    });
    setDraft("");
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      commit(draft);
    } else if (event.key === "Backspace" && draft === "") {
      setTags((prev) => prev.slice(0, -1));
    }
  }

  const available = SUGGESTED.filter(
    (s) => !tags.some((t) => t.toLowerCase() === s.toLowerCase()),
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="project-tags">
          Tags <span className="text-destructive">*</span>
        </Label>
        <span className="font-mono text-xs text-muted-foreground tabular-nums">
          {tags.length}/{TAG_MAX}
        </span>
      </div>
      <div
        className={cn(
          "flex min-h-12 flex-wrap items-center gap-1.5 rounded-lg border bg-transparent px-2.5 py-2 transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 dark:bg-input/30",
          error ? "border-destructive" : "border-input",
        )}
      >
        {tags.map((tag, i) => (
          <span
            key={tag}
            className="animate-row-in inline-flex items-center gap-1 rounded-full py-1 pr-1 pl-2.5 text-xs font-medium"
            style={{
              color: accentVar(CHIP_ACCENTS[i % CHIP_ACCENTS.length]),
              backgroundColor: `color-mix(in oklch, ${accentVar(
                CHIP_ACCENTS[i % CHIP_ACCENTS.length],
              )} 14%, transparent)`,
            }}
          >
            {tag}
            <button
              type="button"
              onClick={() => setTags((prev) => prev.filter((t) => t !== tag))}
              aria-label={`Remove ${tag}`}
              className="grid size-4 place-items-center rounded-full transition-colors hover:bg-foreground/10"
            >
              <X className="size-3" />
            </button>
          </span>
        ))}
        <input
          id="project-tags"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => draft.trim() && commit(draft)}
          placeholder={tags.length ? "Add another…" : "e.g. Next.js, Design"}
          aria-invalid={!!error}
          aria-describedby={error ? "project-tags-error" : "project-tags-hint"}
          className="h-7 min-w-28 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>
      {error ? (
        <FieldError id="project-tags-error" message={error} />
      ) : (
        <p id="project-tags-hint" className="text-xs text-muted-foreground">
          Press Enter or comma to add. Backspace removes the last tag.
        </p>
      )}
      {available.length > 0 && tags.length < TAG_MAX && (
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          <span className="font-mono text-[11px] text-muted-foreground">
            quick add:
          </span>
          {available.slice(0, 6).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => commit(s)}
              className="inline-flex items-center gap-1 rounded-full bg-muted/60 px-2.5 py-1 text-xs text-muted-foreground ring-1 ring-foreground/10 transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <Plus className="size-3" />
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ProjectForm({
  onCreated,
  onSessionExpired,
}: {
  onCreated: () => void;
  onSessionExpired: () => void;
}) {
  const [values, setValues] = useState<Values>(EMPTY);
  const [tags, setTags] = useState<string[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [published, setPublished] = useState(false);

  function update(field: keyof Values, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
    setErrors((e) => (e[field] ? { ...e, [field]: undefined } : e));
  }

  function reset() {
    setValues(EMPTY);
    setTags([]);
    setErrors({});
  }

  const preview = useMemo<Project>(
    () => ({
      id: "preview",
      title: values.title.trim() || "Untitled project",
      description:
        values.description.trim() ||
        "A short description of the work will appear here as you type.",
      imageUrl: isHttpUrl(values.imageUrl) && values.imageUrl.trim()
        ? values.imageUrl.trim()
        : null,
      tags: (tags.length ? tags : ["preview"]).join(","),
      githubLink: values.githubLink.trim() || null,
      liveLink: values.liveLink.trim() || null,
      createdAt: new Date(),
    }),
    [values, tags],
  );

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validate(values, tags);
    setErrors(found);
    const first = (Object.keys(found) as (keyof Errors)[])[0];
    if (first) {
      toast.error("Please fix the highlighted fields.", {
        description: "A few details need a second look before publishing.",
      });
      const focusId =
        first === "tags" ? "project-tags" : `project-${first.toLowerCase()}`;
      document.getElementById(focusId)?.focus();
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: values.title.trim(),
          description: values.description.trim(),
          tags,
          imageUrl: values.imageUrl.trim(),
          githubLink: values.githubLink.trim(),
          liveLink: values.liveLink.trim(),
        }),
      });
      const data = (await res.json().catch(() => null)) as {
        error?: string;
        fields?: Errors;
        project?: Project;
      } | null;

      if (res.status === 201) {
        toast.success("Project published!", {
          description: "It's live on the homepage right now.",
          action: {
            label: "View",
            onClick: () => window.open("/", "_blank", "noopener"),
          },
        });
        reset();
        setPublished(true);
        window.setTimeout(() => setPublished(false), 2000);
        onCreated();
      } else if (res.status === 400 && data?.fields) {
        setErrors(data.fields);
        toast.error("Validation failed.", {
          description: "Please check the highlighted fields and try again.",
        });
      } else if (res.status === 401) {
        toast.error("Session expired.", {
          description: "Sign in again to publish projects.",
        });
        onSessionExpired();
      } else {
        toast.error(data?.error ?? "Couldn't publish the project.", {
          description: "Something went wrong on the server. Please try again.",
        });
      }
    } catch {
      toast.error("Network error.", {
        description: "Couldn't reach the server. Check your connection and retry.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  const descRemaining = DESC_MAX - values.description.length;

  return (
    <section className="animate-fade-up relative overflow-hidden rounded-3xl bg-card/50 ring-1 ring-foreground/10 [animation-delay:80ms]">
      <div className="border-b border-border px-6 py-5 sm:px-7">
        <p className="flex items-center gap-2 font-mono text-[11px] tracking-[0.22em] text-iris uppercase">
          <Plus className="size-3.5" />
          New entry
        </p>
        <h2 className="mt-1.5 text-xl font-semibold tracking-tight">
          Add a project
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Fill in the details — the card on the right updates as you type.
        </p>
      </div>

      <div className="grid gap-8 p-6 sm:p-7 lg:grid-cols-[1.05fr_0.95fr]">
        <form onSubmit={onSubmit} noValidate className="space-y-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="project-title">
                Title <span className="text-destructive">*</span>
              </Label>
              <span className="font-mono text-xs text-muted-foreground tabular-nums">
                {values.title.length}/{TITLE_MAX}
              </span>
            </div>
            <Input
              id="project-title"
              value={values.title}
              onChange={(e) => update("title", e.target.value.slice(0, TITLE_MAX))}
              placeholder="Aurora — realtime analytics dashboard"
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? "project-title-error" : undefined}
              className="h-11"
            />
            <FieldError id="project-title-error" message={errors.title} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="project-description">
                Description <span className="text-destructive">*</span>
              </Label>
              <span
                className={cn(
                  "font-mono text-xs tabular-nums",
                  descRemaining < 200 ? "text-warning" : "text-muted-foreground",
                )}
              >
                {values.description.length}/{DESC_MAX}
              </span>
            </div>
            <Textarea
              id="project-description"
              value={values.description}
              onChange={(e) =>
                update("description", e.target.value.slice(0, DESC_MAX))
              }
              placeholder="What is it, what did you build, and what makes it worth a look? The first paragraph becomes the card summary."
              rows={5}
              aria-invalid={!!errors.description}
              aria-describedby={
                errors.description ? "project-description-error" : undefined
              }
              className="min-h-32 resize-y"
            />
            <FieldError
              id="project-description-error"
              message={errors.description}
            />
          </div>

          <TagField
            tags={tags}
            setTags={setTags}
            error={errors.tags}
          />

          <div className="space-y-2">
            <Label htmlFor="project-imageurl">
              <ImageIcon className="size-3.5 text-muted-foreground" />
              Image link
            </Label>
            <Input
              id="project-imageurl"
              type="url"
              value={values.imageUrl}
              onChange={(e) => update("imageUrl", e.target.value)}
              placeholder="https://…/cover.png"
              aria-invalid={!!errors.imageUrl}
              aria-describedby={
                errors.imageUrl ? "project-imageurl-error" : "project-imageurl-hint"
              }
              className="h-11"
            />
            {errors.imageUrl ? (
              <FieldError id="project-imageurl-error" message={errors.imageUrl} />
            ) : (
              <p id="project-imageurl-hint" className="text-xs text-muted-foreground">
                Optional — leave empty to use the generated cover art.
              </p>
            )}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="project-githublink">
                <Link2 className="size-3.5 text-muted-foreground" />
                GitHub link
              </Label>
              <Input
                id="project-githublink"
                type="url"
                value={values.githubLink}
                onChange={(e) => update("githubLink", e.target.value)}
                placeholder="https://github.com/…"
                aria-invalid={!!errors.githubLink}
                aria-describedby={
                  errors.githubLink ? "project-githublink-error" : undefined
                }
                className="h-11"
              />
              <FieldError
                id="project-githublink-error"
                message={errors.githubLink}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project-livelink">
                <Link2 className="size-3.5 text-muted-foreground" />
                Live link
              </Label>
              <Input
                id="project-livelink"
                type="url"
                value={values.liveLink}
                onChange={(e) => update("liveLink", e.target.value)}
                placeholder="https://…"
                aria-invalid={!!errors.liveLink}
                aria-describedby={
                  errors.liveLink ? "project-livelink-error" : undefined
                }
                className="h-11"
              />
              <FieldError id="project-livelink-error" message={errors.liveLink} />
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-1 sm:flex-row">
            <Button
              type="submit"
              size="lg"
              disabled={submitting}
              className="h-12 flex-1 rounded-full text-sm font-semibold text-white shadow-lg transition-transform hover:scale-[1.01]"
              style={{
                backgroundImage:
                  "linear-gradient(120deg, var(--iris), var(--blue) 55%, var(--magenta))",
              }}
            >
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Publishing…
                </>
              ) : (
                <>
                  <Rocket className="size-4" />
                  Publish project
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={reset}
              disabled={submitting}
              className="h-12 rounded-full px-5"
            >
              <RotateCcw className="size-4" />
              Reset
            </Button>
          </div>
        </form>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl bg-background/40 p-4 ring-1 ring-foreground/10">
            <div className="mb-3 flex items-center justify-between">
              <span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    published ? "bg-success" : "pulse-dot bg-iris",
                  )}
                />
                Live preview
              </span>
              {published && (
                <span className="animate-success-pop inline-flex items-center gap-1 rounded-full bg-success/12 px-2.5 py-1 text-[11px] font-medium text-success ring-1 ring-success/25">
                  <CheckCircle2 className="size-3" />
                  Published
                </span>
              )}
            </div>
            <div className="studio-grid overflow-hidden rounded-xl p-3 ring-1 ring-foreground/5">
              <div inert className="pointer-events-none select-none">
                <ProjectCard project={preview} />
              </div>
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-xs leading-relaxed text-muted-foreground">
              <Tag className="size-3.5 shrink-0 text-iris" />
              This is exactly how the card appears in the homepage portfolio.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}