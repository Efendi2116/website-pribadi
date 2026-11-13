import Link from "next/link";
import type { Post } from "@/lib/posts";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { accentVar, formatDate, splitTags } from "@/lib/format";
import { cn } from "@/lib/utils";

export function PostCard({
  post,
  className,
}: {
  post: Post;
  className?: string;
}) {
  const tags = splitTags(post.tags);

  return (
    <Link
      href={`/writing/${post.slug}`}
      className={cn(
        "card-hover group relative flex flex-col gap-4 overflow-hidden rounded-2xl bg-card p-6 ring-1 ring-foreground/10",
        className,
      )}
    >
      <span
        className="absolute inset-x-0 top-0 h-px opacity-70"
        style={{
          background: `linear-gradient(90deg, transparent, ${accentVar(post.accent)}, transparent)`,
        }}
      />
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
          <time dateTime={post.publishedAt.toISOString()}>
            {formatDate(post.publishedAt)}
          </time>
          <span aria-hidden="true">·</span>
          <span>{post.readingMinutes} min read</span>
        </div>
        <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-iris" />
      </div>

      <h3 className="text-xl leading-snug font-semibold tracking-tight text-balance transition-colors group-hover:text-iris">
        {post.title}
      </h3>
      <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
        {post.excerpt}
      </p>

      <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
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
    </Link>
  );
}