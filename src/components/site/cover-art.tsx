import { cn } from "@/lib/utils";
import { accentVar, hashString } from "@/lib/format";

const ACCENTS = ["iris", "cyan", "amber", "magenta", "lime", "blue", "coral"];

export function CoverArt({
  seed,
  accent,
  className,
}: {
  seed: string;
  accent: string;
  className?: string;
}) {
  const h = hashString(seed);
  const motif = h % 4;
  const secondary = ACCENTS[(h >> 3) % ACCENTS.length];
  const c1 = accentVar(accent);
  const c2 = accentVar(secondary);
  const cx = 90 + (h % 220);
  const cy = 60 + ((h >> 5) % 130);

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{
        background: `linear-gradient(135deg, color-mix(in oklch, ${c1} 30%, var(--card)) 0%, color-mix(in oklch, ${c2} 16%, var(--card)) 100%)`,
      }}
    >
      <svg
        viewBox="0 0 400 250"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 size-full"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id={`glow-${h}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={c1} stopOpacity="0.55" />
            <stop offset="100%" stopColor={c1} stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx={cx} cy={cy} r="120" fill={`url(#glow-${h})`} />

        {motif === 0 &&
          Array.from({ length: 6 }, (_, i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={26 + i * 26}
              fill="none"
              stroke={i % 2 ? c2 : c1}
              strokeWidth={1.5}
              opacity={0.5 - i * 0.06}
            />
          ))}

        {motif === 1 &&
          Array.from({ length: 6 }, (_, i) => {
            const y = 30 + i * 38;
            const amp = 14 + ((h >> i) % 20);
            return (
              <path
                key={i}
                d={`M -20 ${y} Q 100 ${y - amp} 200 ${y} T 420 ${y}`}
                fill="none"
                stroke={i % 2 ? c1 : c2}
                strokeWidth={2}
                opacity={0.45}
              />
            );
          })}

        {motif === 2 &&
          Array.from({ length: 7 }, (_, r) =>
            Array.from({ length: 12 }, (_, c) => {
              const k = hashString(`${seed}-${r}-${c}`);
              const filled = k % 4 === 0;
              return (
                <circle
                  key={`${r}-${c}`}
                  cx={22 + c * 32}
                  cy={26 + r * 33}
                  r={filled ? 4.5 : 2}
                  fill={filled ? (k % 8 === 0 ? c2 : c1) : c1}
                  opacity={filled ? 0.85 : 0.28}
                />
              );
            }),
          )}

        {motif === 3 && (
          <>
            <ellipse
              cx={cx}
              cy={cy}
              rx="110"
              ry="80"
              fill={c1}
              opacity="0.28"
            />
            <ellipse
              cx={400 - cx}
              cy={250 - cy}
              rx="90"
              ry="70"
              fill={c2}
              opacity="0.24"
            />
            <path
              d={`M 0 ${170 + (h % 30)} L 400 ${120 + (h % 50)}`}
              stroke={c1}
              strokeWidth="2"
              opacity="0.5"
            />
            <circle cx={cx} cy={cy} r="16" fill={c2} opacity="0.8" />
          </>
        )}
      </svg>
      <div className="grain-overlay" />
      <div className="absolute inset-0 ring-1 ring-inset ring-foreground/10" />
    </div>
  );
}