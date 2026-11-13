"use client";

import { useMemo, useState, type FormEvent, type KeyboardEvent } from "react";
import type { Post } from "@prisma/client";
import { toast } from "sonner";
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  FileText,
  Loader2,
  Plus,
  RotateCcw,
  Save,
  Sparkles,
  Tag,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PostCard } from "@/components/site/post-card";
import { ACCENTS } from "@/lib/constants";
import { accentVar, slugify, splitTags } from "@/lib/format";
import {
  POST_LIMITS,
  estimateReadingMinutes,
  parsePostInput,
  type PostErrors,
  type PostField,
} from "@/lib/post-input";
import { cn } from "@/lib/utils";

const SUGGESTED = [
  "Design",
  "CSS",
  "TypeScript",
  "Performance",
  "Motion",
  "Typography",
  "WebGL",
  "Process",
];

type Values = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  accent: string;
  readingMinutes: string;
  publishedAt: string;
};

const EMPTY: Values = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  accent: "iris",
  readingMinutes: "",
  publishedAt: "",
};

function toLocalInput(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
}

function initialValues(post: Post | null): Values {
  if (!post) return EMPTY;
  return {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    accent: post.accent,
    readingMinutes: String(post.readingMinutes),
    publishedAt: toLocalInput(post.publishedAt),
  };
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
        const tag = piece.slice(0, POST_LIMITS.tagLength);
        if (
          tag &&
          next.length < POST_LIMITS.tags &&
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
        <Label htmlFor="post-tags">
          Tags <span className="text-destructive">*</span>
        </Label>
        <span className="font-mono text-xs text-muted-foreground tabular-nums">
          {tags.length}/{POST_LIMITS.tags}
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
              color: accentVar(ACCENTS[i % ACCENTS.length]),
              backgroundColor: `color-mix(in oklch, ${accentVar(
                ACCENTS[i % ACCENTS.length],
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
          id="post-tags"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => draft.trim() && commit(draft)}
          placeholder={tags.length ? "Add another…" : "e.g. Design, CSS"}
          aria-invalid={!!error}
          aria-describedby={error ? "post-tags-error" : "post-tags-hint"}
          className="h-7 min-w-28 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>
      {error ? (
        <FieldError id="post-tags-error" message={error} />
      ) : (
        <p id="post-tags-hint" className="text-xs text-muted-foreground">
          Press Enter or comma to add. Backspace removes the last tag.
        </p>
      )}
      {available.length > 0 && tags.length < POST_LIMITS.tags && (
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

export function PostForm({
  editing,
  onSaved,
  onCancelEdit,
  onSessionExpired,
}: {
  editing: Post | null;
  onSaved: () => void;
  onCancelEdit: () => void;
  onSessionExpired: () => void;
}) {
  const [values, setValues] = useState<Values>(() => initialValues(editing));
  const [tags, setTags] = useState<string[]>(() =>
    editing ? splitTags(editing.tags) : [],
  );
  const [featured, setFeatured] = useState<boolean>(
    () => editing?.featured ?? false,
  );
  const [errors, setErrors] = useState<PostErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  const isEditing = editing !== null;

  function update(field: keyof Values, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
    setErrors((e) => (e[field] ? { ...e, [field]: undefined } : e));
  }

  function reset() {
    setValues(EMPTY);
    setTags([]);
    setFeatured(false);
    setErrors({});
  }

  const estimate = estimateReadingMinutes(values.content);
  const autoSlug = slugify(values.title);
  const wordCount = values.content.trim().split(/\s+/).filter(Boolean).length;

  const previewDate = useMemo(() => {
    if (values.publishedAt) {
      const d = new Date(values.publishedAt);
      if (!Number.isNaN(d.getTime())) return d;
    }
    return new Date();
  }, [values.publishedAt]);

  const preview = useMemo<Post>(
    () => ({
      id: "preview",
      slug: values.slug.trim() || autoSlug || "preview",
      title: values.title.trim() || "Untitled essay",
      excerpt:
        values.excerpt.trim() ||
        "A short excerpt will appear here as you type.",
      content: values.content,
      accent: values.accent,
      tags: (tags.length ? tags : ["preview"]).join(","),
      readingMinutes: Math.max(
        1,
        values.readingMinutes ? Number(values.readingMinutes) || estimate : estimate,
      ),
      featured,
      publishedAt: previewDate,
      updatedAt: new Date(),
    }),
    [values, tags, featured, autoSlug, estimate, previewDate],
  );

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = {
      title: values.title,
      excerpt: values.excerpt,
      content: values.content,
      slug: values.slug,
      accent: values.accent,
      tags,
      readingMinutes:
        values.readingMinutes === "" ? undefined : Number(values.readingMinutes),
      featured,
      publishedAt: values.publishedAt
        ? new Date(values.publishedAt).toISOString()
        : undefined,
    };
    const { errors: found } = parsePostInput(body);
    setErrors(found);
    const first = (Object.keys(found) as PostField[])[0];
    if (first) {
      toast.error("Please fix the highlighted fields.", {
        description: "A few details need a second look before saving.",
      });
      document.getElementById(`post-${first.toLowerCase()}`)?.focus();
      return;
    }

    setSubmitting(true);
    try {
      const url = editing ? `/api/writing/${editing.id}` : "/api/writing";
      const res = await fetch(url, {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json().catch(() => null)) as {
        error?: string;
        fields?: PostErrors;
        post?: Post;
      } | null;

      const ok = editing ? res.status === 200 : res.status === 201;
      if (ok && data?.post) {
        const slug = data.post.slug;
        toast.success(editing ? "Essay updated!" : "Essay published!", {
          description: editing
            ? "Changes are live across the site right now."
            : "It's live on the homepage and writing page right now.",
          action: {
            label: "View",
            onClick: () => window.open(`/writing/${slug}`, "_blank", "noopener"),
          },
        });
        if (!editing) reset();
        setSaved(true);
        window.setTimeout(() => setSaved(false), 2000);
        onSaved();
      } else if ((res.status === 400 || res.status === 409) && data?.fields) {
        setErrors(data.fields);
        toast.error(
          res.status === 409 ? "That slug is already taken." : "Validation failed.",
          {
            description:
              res.status === 409
                ? "Pick a different slug for this essay."
                : "Please check the highlighted fields and try again.",
          },
        );
        if (res.status === 409) document.getElementById("post-slug")?.focus();
      } else if (res.status === 401) {
        toast.error("Session expired.", {
          description: "Sign in again to manage writing.",
        });
        onSessionExpired();
      } else {
        toast.error(
          data?.error ??
            (editing ? "Couldn't save the essay." : "Couldn't publish the essay."),
          {
            description: "Something went wrong on the server. Please try again.",
          },
        );
      }
    } catch {
      toast.error("Network error.", {
        description: "Couldn't reach the server. Check your connection and retry.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  const excerptRemaining = POST_LIMITS.excerpt - values.excerpt.length;

  return (
    <section
      id="post-form"
      className="animate-fade-up relative scroll-mt-24 overflow-hidden rounded-3xl bg-card/50 ring-1 ring-foreground/10 [animation-delay:80ms]"
    >
      <div className="flex flex-col gap-3 border-b border-border px-6 py-5 sm:flex-row sm:items-start sm:justify-between sm:px-7">
        <div>
          <p className="flex items-center gap-2 font-mono text-[11px] tracking-[0.22em] text-magenta uppercase">
            {isEditing ? (
              <FileText className="size-3.5" />
            ) : (
              <Plus className="size-3.5" />
            )}
            {isEditing ? "Edit entry" : "New entry"}
          </p>
          <h2 className="mt-1.5 text-xl font-semibold tracking-tight">
            {isEditing ? "Edit essay" : "Add an essay"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {isEditing
              ? "Changes push to the homepage and writing page the moment you save."
              : "Fill in the details — the card on the right updates as you type."}
          </p>
        </div>
        {isEditing && (
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-magenta/10 px-3 py-1.5 font-mono text-[11px] text-magenta ring-1 ring-magenta/25">
            <FileText className="size-3" />
            /writing/{editing.slug}
          </span>
        )}
      </div>

      <div className="grid gap-8 p-6 sm:p-7 lg:grid-cols-[1.05fr_0.95fr]">
        <form onSubmit={onSubmit} noValidate className="space-y-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="post-title">
                Title <span className="text-destructive">*</span>
              </Label>
              <span className="font-mono text-xs text-muted-foreground tabular-nums">
                {values.title.length}/{POST_LIMITS.title}
              </span>
            </div>
            <Input
              id="post-title"
              value={values.title}
              onChange={(e) =>
                update("title", e.target.value.slice(0, POST_LIMITS.title))
              }
              placeholder="The physics of a good button"
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? "post-title-error" : undefined}
              className="h-11"
            />
            <FieldError id="post-title-error" message={errors.title} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="post-slug">Slug</Label>
            <Input
              id="post-slug"
              value={values.slug}
              onChange={(e) =>
                update("slug", e.target.value.slice(0, POST_LIMITS.slug))
              }
              placeholder={autoSlug || "auto-generated-from-title"}
              aria-invalid={!!errors.slug}
              aria-describedby={errors.slug ? "post-slug-error" : "post-slug-hint"}
              className="h-11 font-mono text-sm"
            />
            {errors.slug ? (
              <FieldError id="post-slug-error" message={errors.slug} />
            ) : (
              <p
                id="post-slug-hint"
                className="truncate font-mono text-xs text-muted-foreground"
              >
                {values.slug.trim()
                  ? `/writing/${values.slug.trim()}`
                  : `Auto: /writing/${autoSlug || "…"}`}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="post-excerpt">
                Excerpt <span className="text-destructive">*</span>
              </Label>
              <span
                className={cn(
                  "font-mono text-xs tabular-nums",
                  excerptRemaining < 60
                    ? "text-warning"
                    : "text-muted-foreground",
                )}
              >
                {values.excerpt.length}/{POST_LIMITS.excerpt}
              </span>
            </div>
            <Textarea
              id="post-excerpt"
              value={values.excerpt}
              onChange={(e) =>
                update("excerpt", e.target.value.slice(0, POST_LIMITS.excerpt))
              }
              placeholder="A one or two sentence teaser that appears on the card."
              rows={3}
              aria-invalid={!!errors.excerpt}
              aria-describedby={
                errors.excerpt ? "post-excerpt-error" : undefined
              }
              className="min-h-20 resize-y"
            />
            <FieldError id="post-excerpt-error" message={errors.excerpt} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="post-content">
                Content <span className="text-destructive">*</span>
              </Label>
              <span className="font-mono text-xs text-muted-foreground tabular-nums">
                {wordCount} words · ~{estimate} min
              </span>
            </div>
            <Textarea
              id="post-content"
              value={values.content}
              onChange={(e) =>
                update("content", e.target.value.slice(0, POST_LIMITS.content))
              }
              placeholder={"Write in Markdown…\n\n## A heading\n\nA paragraph with **bold** and `code`.\n\n> A pull quote.\n\n- A list item"}
              rows={12}
              aria-invalid={!!errors.content}
              aria-describedby={
                errors.content ? "post-content-error" : "post-content-hint"
              }
              className="min-h-64 resize-y font-mono text-[13px] leading-relaxed"
            />
            {errors.content ? (
              <FieldError id="post-content-error" message={errors.content} />
            ) : (
              <p id="post-content-hint" className="text-xs text-muted-foreground">
                Markdown supported: ## heading, **bold**, `code`, &gt; quote, -
                list. {values.content.length}/{POST_LIMITS.content} characters.
              </p>
            )}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="post-accent">Accent colour</Label>
              <div className="relative">
                <span
                  className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 rounded-full ring-1 ring-foreground/20"
                  style={{ background: accentVar(values.accent) }}
                />
                <select
                  id="post-accent"
                  value={values.accent}
                  onChange={(e) => update("accent", e.target.value)}
                  aria-invalid={!!errors.accent}
                  className="h-11 w-full appearance-none rounded-lg border border-input bg-transparent pr-9 pl-9 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                >
                  {ACCENTS.map((a) => (
                    <option key={a} value={a}>
                      {a.charAt(0).toUpperCase() + a.slice(1)}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
              </div>
              <FieldError id="post-accent-error" message={errors.accent} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="post-readingminutes">Reading time (min)</Label>
              <Input
                id="post-readingminutes"
                type="number"
                min={1}
                max={POST_LIMITS.readingMinutes}
                value={values.readingMinutes}
                onChange={(e) => update("readingMinutes", e.target.value)}
                placeholder={String(estimate)}
                aria-invalid={!!errors.readingMinutes}
                aria-describedby={
                  errors.readingMinutes
                    ? "post-readingminutes-error"
                    : "post-readingminutes-hint"
                }
                className="h-11"
              />
              {errors.readingMinutes ? (
                <FieldError
                  id="post-readingminutes-error"
                  message={errors.readingMinutes}
                />
              ) : (
                <p
                  id="post-readingminutes-hint"
                  className="text-xs text-muted-foreground"
                >
                  Leave empty to auto-estimate (~{estimate} min).
                </p>
              )}
            </div>
          </div>

          <TagField tags={tags} setTags={setTags} error={errors.tags} />

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="post-publishedat">Publish date</Label>
              <Input
                id="post-publishedat"
                type="datetime-local"
                value={values.publishedAt}
                onChange={(e) => update("publishedAt", e.target.value)}
                aria-invalid={!!errors.publishedAt}
                aria-describedby={
                  errors.publishedAt
                    ? "post-publishedat-error"
                    : "post-publishedat-hint"
                }
                className="h-11"
              />
              {errors.publishedAt ? (
                <FieldError
                  id="post-publishedat-error"
                  message={errors.publishedAt}
                />
              ) : (
                <p
                  id="post-publishedat-hint"
                  className="text-xs text-muted-foreground"
                >
                  {isEditing
                    ? "When this essay was published."
                    : "Leave empty to publish right now."}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="post-featured">Featured</Label>
              <div className="flex h-11 items-center justify-between gap-3 rounded-lg border border-input px-3 dark:bg-input/30">
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Sparkles className="size-4 text-amber" />
                  Highlight
                </span>
                <button
                  id="post-featured"
                  type="button"
                  role="switch"
                  aria-checked={featured}
                  aria-label="Mark this essay as featured"
                  onClick={() => setFeatured((f) => !f)}
                  className={cn(
                    "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
                    featured ? "bg-iris" : "bg-muted-foreground/30",
                  )}
                >
                  <span
                    className={cn(
                      "inline-block size-5 transform rounded-full bg-white shadow transition-transform",
                      featured ? "translate-x-5" : "translate-x-0.5",
                    )}
                  />
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Flag this essay as a featured highlight.
              </p>
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
                  "linear-gradient(120deg, var(--magenta), var(--iris) 55%, var(--blue))",
              }}
            >
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {isEditing ? "Saving…" : "Publishing…"}
                </>
              ) : isEditing ? (
                <>
                  <Save className="size-4" />
                  Save changes
                </>
              ) : (
                <>
                  <BookOpen className="size-4" />
                  Publish essay
                </>
              )}
            </Button>
            {isEditing ? (
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={onCancelEdit}
                disabled={submitting}
                className="h-12 rounded-full px-5"
              >
                <X className="size-4" />
                Cancel
              </Button>
            ) : (
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
            )}
          </div>
        </form>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl bg-background/40 p-4 ring-1 ring-foreground/10">
            <div className="mb-3 flex items-center justify-between">
              <span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    saved ? "bg-success" : "pulse-dot bg-magenta",
                  )}
                />
                Live preview
              </span>
              {saved && (
                <span className="animate-success-pop inline-flex items-center gap-1 rounded-full bg-success/12 px-2.5 py-1 text-[11px] font-medium text-success ring-1 ring-success/25">
                  <CheckCircle2 className="size-3" />
                  {isEditing ? "Saved" : "Published"}
                </span>
              )}
            </div>
            <div className="studio-grid overflow-hidden rounded-xl p-3 ring-1 ring-foreground/5">
              <div inert className="pointer-events-none select-none">
                <PostCard post={preview} />
              </div>
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-xs leading-relaxed text-muted-foreground">
              <Tag className="size-3.5 shrink-0 text-magenta" />
              This is exactly how the card appears in the writing list.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}