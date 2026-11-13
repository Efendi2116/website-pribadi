export function Background() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(120% 80% at 50% -10%, color-mix(in oklch, var(--iris) 12%, transparent) 0%, transparent 55%)",
        }}
      />
      <div
        className="aurora-blob"
        style={{
          width: "46rem",
          height: "46rem",
          top: "-14rem",
          left: "-10rem",
          background: "var(--aurora-1)",
        }}
      />
      <div
        className="aurora-blob"
        style={{
          width: "38rem",
          height: "38rem",
          top: "20%",
          right: "-12rem",
          background: "var(--aurora-2)",
          animationDelay: "-8s",
        }}
      />
      <div
        className="aurora-blob"
        style={{
          width: "34rem",
          height: "34rem",
          bottom: "-10rem",
          left: "25%",
          background: "var(--aurora-3)",
          animationDelay: "-15s",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.18] dark:opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "radial-gradient(90% 60% at 50% 0%, black 0%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(90% 60% at 50% 0%, black 0%, transparent 75%)",
        }}
      />
      <div className="grain-overlay" />
    </div>
  );
}