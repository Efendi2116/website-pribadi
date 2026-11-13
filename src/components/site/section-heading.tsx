import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  className,
  id,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <div
      id={id}
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="max-w-2xl space-y-3">
        {eyebrow && (
          <span className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.22em] text-iris uppercase">
            <span className="h-px w-6 bg-iris/60" />
            {eyebrow}
          </span>
        )}
        <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {title}
        </h2>
        {description && (
          <p className="text-base leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}