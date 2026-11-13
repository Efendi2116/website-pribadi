import { site } from "@/lib/constants";

function Chip({
  label,
  className,
  delay = "0s",
  accent,
}: {
  label: string;
  className: string;
  delay?: string;
  accent: string;
}) {
  return (
    <div
      className={`animate-float absolute z-20 flex items-center gap-2 rounded-full bg-card/85 px-3 py-1.5 font-mono text-xs font-medium shadow-lg ring-1 ring-foreground/10 backdrop-blur-md ${className}`}
      style={{ animationDelay: delay }}
    >
      <span
        className="size-1.5 rounded-full"
        style={{ background: `var(--${accent})` }}
      />
      {label}
    </div>
  );
}

export function HeroArt() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[26rem] select-none">
      <div
        className="absolute inset-4 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, var(--glow) 0%, transparent 68%)",
        }}
      />

      <div className="animate-spin-slow absolute inset-0 rounded-full border border-dashed border-iris/30" />
      <div className="absolute inset-8 rounded-full border border-foreground/10" />
      <div
        className="absolute inset-8 rounded-full"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0deg, color-mix(in oklch, var(--cyan) 40%, transparent) 90deg, transparent 180deg, color-mix(in oklch, var(--magenta) 40%, transparent) 270deg, transparent 360deg)",
          maskImage:
            "radial-gradient(circle, transparent 62%, black 63%, black 66%, transparent 67%)",
          WebkitMaskImage:
            "radial-gradient(circle, transparent 62%, black 63%, black 66%, transparent 67%)",
        }}
      />

      <div className="absolute inset-12 grid place-items-center overflow-hidden rounded-[2rem] bg-card/60 ring-1 ring-foreground/10 backdrop-blur-xl">
        <div className="grain-overlay" />
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(80% 60% at 50% 0%, color-mix(in oklch, var(--iris) 22%, transparent), transparent 70%)",
          }}
        />
        <div className="relative grid place-items-center">
          <div className="animate-float relative size-36">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "conic-gradient(from 210deg, var(--iris), var(--cyan), var(--magenta), var(--amber), var(--iris))",
                filter: "blur(3px)",
              }}
            />
            <div className="absolute inset-[6px] grid place-items-center rounded-full bg-card/85 backdrop-blur-sm">
              <span className="text-gradient font-mono text-3xl font-bold tracking-tight">
                ME
              </span>
            </div>
          </div>
          <p className="mt-6 max-w-[12rem] text-center font-mono text-[11px] leading-relaxed tracking-wide text-muted-foreground uppercase">
            Design · Code · Play
          </p>
        </div>
      </div>

      <Chip label="TypeScript" accent="blue" className="top-6 -left-2" />
      <Chip
        label="WebGL"
        accent="magenta"
        className="top-1/3 -right-3"
        delay="-2.5s"
      />
      <Chip
        label="React"
        accent="cyan"
        className="bottom-16 -left-4"
        delay="-4s"
      />
      <Chip
        label="Prisma"
        accent="lime"
        className="right-2 bottom-6"
        delay="-1.5s"
      />

      <div className="absolute -bottom-2 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-card/90 px-3.5 py-2 text-xs font-medium whitespace-nowrap shadow-lg ring-1 ring-foreground/10 backdrop-blur-md">
        <span className="pulse-dot size-2 rounded-full bg-success" />
        <span className="text-muted-foreground">Currently</span>
        <span>building delightful UI</span>
        <span className="hidden text-muted-foreground sm:inline">
          · {site.timezone}
        </span>
      </div>
    </div>
  );
}