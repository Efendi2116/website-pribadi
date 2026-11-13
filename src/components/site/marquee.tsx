import { marqueeStack } from "@/lib/constants";

export function Marquee() {
  const items = [...marqueeStack, ...marqueeStack];
  return (
    <div className="mask-fade-x relative overflow-hidden py-2">
      <div className="marquee-track items-center gap-8">
        {items.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex items-center gap-8 font-mono text-sm whitespace-nowrap text-muted-foreground"
          >
            {item}
            <span
              className="size-1.5 rotate-45 rounded-[1px]"
              style={{ background: "var(--iris)" }}
            />
          </span>
        ))}
      </div>
    </div>
  );
}