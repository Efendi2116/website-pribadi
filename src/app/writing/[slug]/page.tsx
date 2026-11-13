import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { getPost, getPosts } from "@/lib/posts";
import { site } from "@/lib/constants";
import { accentVar, formatLongDate, splitTags } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Markdown } from "@/components/site/markdown";
import { ReadingProgress } from "@/components/site/reading-progress";
import { Reveal } from "@/components/site/reveal";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Essay not found" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt.toISOString(),
    },
  };
}

function DetailFallback() {
  return (
    <div className="mx-auto w-full max-w-3xl animate-pulse px-4 py-16 sm:px-6">
      <div className="h-4 w-24 rounded bg-muted" />
      <div className="mt-8 h-12 w-full rounded bg-muted" />
      <div className="mt-4 h-5 w-1/3 rounded bg-muted" />
      <div className="mt-10 space-y-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="h-4 w-full rounded bg-muted" />
        ))}
      </div>
    </div>
  );
}

async function PostDetail({ params }: Params) {
  const { slug } = await params;
  const [post, posts] = await Promise.all([getPost(slug), getPosts()]);

  if (!post) notFound();

  const tags = splitTags(post.tags);
  const index = posts.findIndex((p) => p.id === post.id);
  const prev = index > 0 ? posts[index - 1] : null;
  const next = index < posts.length - 1 ? posts[index + 1] : null;
  const accent = accentVar(post.accent);

  return (
    <>
      <ReadingProgress />
      <article className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <Link
          href="/writing"
          className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
          All writing
        </Link>

        <Reveal>
          <header className="mt-8 space-y-6">
            <div className="flex flex-wrap gap-2">
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
            <h1 className="text-4xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-[2.75rem]">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span
                className="grid size-9 place-items-center rounded-full text-xs font-bold text-white"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${accent}, var(--magenta))`,
                }}
              >
                ME
              </span>
              <span className="font-medium text-foreground">{site.name}</span>
              <span aria-hidden="true">·</span>
              <time dateTime={post.publishedAt.toISOString()}>
                {formatLongDate(post.publishedAt)}
              </time>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-3.5" />
                {post.readingMinutes} min read
              </span>
            </div>
          </header>
        </Reveal>

        <div
          className="my-10 h-px w-full"
          style={{
            background: `linear-gradient(90deg, ${accent}, transparent)`,
          }}
        />

        <Reveal delay={80}>
          <Markdown content={post.content} />
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-14 flex flex-col gap-4 rounded-2xl bg-card p-6 ring-1 ring-foreground/10 sm:flex-row sm:items-center">
            <span
              className="grid size-14 shrink-0 place-items-center rounded-2xl text-lg font-bold text-white"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, var(--iris), var(--magenta))",
              }}
            >
              ME
            </span>
            <div className="space-y-1">
              <p className="font-semibold tracking-tight">
                Written by {site.name}
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {site.shortRole} in {site.location}. Thanks for reading — if this
                resonated,{" "}
                <Link
                  href="/guestbook"
                  className="font-medium text-iris underline-offset-4 hover:underline"
                >
                  leave a note in the guestbook
                </Link>
                .
              </p>
            </div>
          </div>
        </Reveal>

        {(prev || next) && (
          <nav className="mt-12 grid gap-4 border-t border-border pt-8 sm:grid-cols-2">
            {prev ? (
              <Link
                href={`/writing/${prev.slug}`}
                className="group flex flex-col gap-1 rounded-2xl bg-card/50 p-5 ring-1 ring-foreground/10 transition-colors hover:bg-card"
              >
                <span className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
                  <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
                  Newer
                </span>
                <span className="line-clamp-2 font-semibold tracking-tight transition-colors group-hover:text-iris">
                  {prev.title}
                </span>
              </Link>
            ) : (
              <span className="hidden sm:block" />
            )}
            {next && (
              <Link
                href={`/writing/${next.slug}`}
                className="group flex flex-col gap-1 rounded-2xl bg-card/50 p-5 text-right ring-1 ring-foreground/10 transition-colors hover:bg-card sm:col-start-2"
              >
                <span className="inline-flex items-center justify-end gap-1.5 font-mono text-xs text-muted-foreground">
                  Older
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
                <span className="line-clamp-2 font-semibold tracking-tight transition-colors group-hover:text-iris">
                  {next.title}
                </span>
              </Link>
            )}
          </nav>
        )}
      </article>
    </>
  );
}

export default function PostPage({ params }: Params) {
  return (
    <Suspense fallback={<DetailFallback />}>
      <PostDetail params={params} />
    </Suspense>
  );
}