"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { site } from "@/lib/constants";
import { cn } from "@/lib/utils";

const ROTATING = ["interfaces", "systems", "experiences", "moments"];
const SIZER = "experiences";

function Word({
  children,
  delay,
  className,
}: {
  children: ReactNode;
  delay: number;
  className?: string;
}) {
  return (
    <span
      className={cn("hero-word inline-block", className)}
      style={{ "--word-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </span>
  );
}

export function AnimatedHeadline() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % ROTATING.length),
      2600,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <h1 className="text-[2.6rem] leading-[1.08] font-semibold tracking-tight text-balance sm:text-6xl lg:text-[4.1rem]">
      <Word delay={0}>I&apos;m {site.firstName}.</Word>{" "}
      <Word delay={90}>I</Word> <Word delay={150}>build</Word>{" "}
      <span
        aria-hidden="true"
        className="hero-word relative inline-grid"
        style={{ "--word-delay": "210ms" } as CSSProperties}
      >
        <span className="invisible col-start-1 row-start-1">{SIZER}</span>
        {ROTATING.map((word, i) => (
          <span
            key={word}
            className="rotate-word text-gradient-animated col-start-1 row-start-1 whitespace-nowrap"
            style={{
              opacity: i === index ? 1 : 0,
              transform: i === index ? "translateY(0)" : "translateY(0.4em)",
              filter: i === index ? "blur(0)" : "blur(5px)",
            }}
          >
            {word}
          </span>
        ))}
      </span>
      <span className="sr-only">{ROTATING[0]}</span>{" "}
      <Word delay={300}>that</Word>{" "}
      <Word delay={360} className="text-gradient-animated">
        feel alive.
      </Word>
    </h1>
  );
}