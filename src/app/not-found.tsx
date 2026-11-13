import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[72vh] w-full max-w-2xl flex-col items-center justify-center px-4 py-20 text-center">
      <div className="relative">
        <div
          className="absolute inset-0 -z-10 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, var(--glow) 0%, transparent 70%)",
          }}
        />
        <span className="text-gradient font-mono text-[7rem] leading-none font-bold tracking-tight sm:text-[9rem]">
          404
        </span>
      </div>

      <span className="mt-6 grid size-12 place-items-center rounded-full bg-card text-iris ring-1 ring-foreground/10">
        <Compass className="size-5" />
      </span>

      <h1 className="mt-6 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
        This page wandered off the grid.
      </h1>
      <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
        The link may be broken, or the page moved on to something else. Let&apos;s
        get you back to solid ground.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className={cn(
            buttonVariants({ size: "lg" }),
            "h-12 rounded-full px-6 text-sm font-semibold",
          )}
        >
          <ArrowLeft className="size-4" />
          Back home
        </Link>
        <Link
          href="/work"
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "h-12 rounded-full px-6 text-sm font-semibold",
          )}
        >
          Browse work
        </Link>
      </div>
    </div>
  );
}