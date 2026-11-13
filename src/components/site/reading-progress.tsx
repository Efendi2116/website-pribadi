"use client";

import { useEffect, useState } from "react";

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? Math.min(100, (el.scrollTop / total) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      className="fixed inset-x-0 top-16 z-40 h-0.5"
      aria-hidden="true"
    >
      <div
        className="h-full origin-left"
        style={{
          width: `${progress}%`,
          backgroundImage:
            "linear-gradient(90deg, var(--iris), var(--cyan), var(--magenta))",
        }}
      />
    </div>
  );
}