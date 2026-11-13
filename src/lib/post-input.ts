import { ACCENTS } from "@/lib/constants";
import { slugify, splitTags } from "@/lib/format";

export const POST_LIMITS = {
  title: 160,
  excerpt: 400,
  content: 50_000,
  slug: 80,
  tags: 12,
  tagLength: 30,
  readingMinutes: 120,
} as const;

export type PostInput = {
  title: string;
  excerpt: string;
  content: string;
  slug: string;
  accent: string;
  tags: string;
  readingMinutes: number;
  featured: boolean;
  publishedAt: Date;
};

export type PostField =
  | "title"
  | "excerpt"
  | "content"
  | "slug"
  | "accent"
  | "tags"
  | "readingMinutes"
  | "featured"
  | "publishedAt";

export type PostErrors = Partial<Record<PostField, string>>;

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function estimateReadingMinutes(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.min(
    POST_LIMITS.readingMinutes,
    Math.max(1, Math.round(words / 200)),
  );
}

// Shared by POST (create) and PUT (update) so both enforce identical rules.
export function parsePostInput(body: unknown): {
  values: PostInput | null;
  errors: PostErrors;
} {
  const errors: PostErrors = {};
  if (typeof body !== "object" || body === null) {
    return { values: null, errors: { title: "Request body must be a JSON object." } };
  }
  const data = body as Record<string, unknown>;

  const title = typeof data.title === "string" ? data.title.trim() : "";
  const excerpt = typeof data.excerpt === "string" ? data.excerpt.trim() : "";
  const content = typeof data.content === "string" ? data.content.trim() : "";

  if (title.length < 1 || title.length > POST_LIMITS.title)
    errors.title = `Title must be between 1 and ${POST_LIMITS.title} characters.`;
  if (excerpt.length < 1 || excerpt.length > POST_LIMITS.excerpt)
    errors.excerpt = `Excerpt must be between 1 and ${POST_LIMITS.excerpt} characters.`;
  if (content.length < 1 || content.length > POST_LIMITS.content)
    errors.content = `Content must be between 1 and ${POST_LIMITS.content} characters.`;

  const rawSlug = typeof data.slug === "string" ? data.slug.trim() : "";
  const slug = rawSlug ? rawSlug.toLowerCase() : slugify(title);
  if (!slug || slug.length > POST_LIMITS.slug || !SLUG_RE.test(slug))
    errors.slug =
      "Slug must be lowercase words separated by hyphens (a-z, 0-9).";

  const accent =
    typeof data.accent === "string" && data.accent ? data.accent : "iris";
  if (!(ACCENTS as readonly string[]).includes(accent))
    errors.accent = "Pick one of the available accent colours.";

  const tags = (
    Array.isArray(data.tags)
      ? data.tags
          .filter((t): t is string => typeof t === "string")
          .map((t) => t.trim())
          .filter(Boolean)
      : typeof data.tags === "string"
        ? splitTags(data.tags)
        : []
  )
    .map((t) => t.slice(0, POST_LIMITS.tagLength))
    .slice(0, POST_LIMITS.tags);
  if (tags.length === 0) errors.tags = "Add at least one tag.";

  let readingMinutes = estimateReadingMinutes(content);
  if (data.readingMinutes !== undefined && data.readingMinutes !== null && data.readingMinutes !== "") {
    const n =
      typeof data.readingMinutes === "number"
        ? data.readingMinutes
        : Number.parseInt(String(data.readingMinutes), 10);
    if (!Number.isFinite(n) || n < 1 || n > POST_LIMITS.readingMinutes)
      errors.readingMinutes = `Reading time must be 1–${POST_LIMITS.readingMinutes} minutes.`;
    else readingMinutes = Math.round(n);
  }

  let featured = false;
  if (typeof data.featured === "boolean") featured = data.featured;
  else if (data.featured === "true") featured = true;
  else if (data.featured === "false" || data.featured === undefined || data.featured === null) featured = false;
  else errors.featured = "Featured must be a boolean.";

  let publishedAt = new Date();
  if (typeof data.publishedAt === "string" && data.publishedAt.trim()) {
    const d = new Date(data.publishedAt);
    if (Number.isNaN(d.getTime()))
      errors.publishedAt = "Enter a valid publication date.";
    else publishedAt = d;
  } else if (data.publishedAt !== undefined && data.publishedAt !== null && typeof data.publishedAt !== "string") {
    errors.publishedAt = "Enter a valid publication date.";
  }

  if (Object.keys(errors).length > 0) return { values: null, errors };
  return {
    values: {
      title,
      excerpt,
      content,
      slug,
      accent,
      tags: tags.join(","),
      readingMinutes,
      featured,
      publishedAt,
    },
    errors: {},
  };
}