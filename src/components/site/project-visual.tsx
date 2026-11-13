import Image from "next/image";
import { CoverArt } from "./cover-art";
import { cn } from "@/lib/utils";

// Renders a project's own imageUrl when present, otherwise the generated
// cover art that gives the portfolio its distinctive look.
export function ProjectVisual({
  imageUrl,
  title,
  seed,
  accent,
  className,
  sizes,
}: {
  imageUrl: string | null;
  title: string;
  seed: string;
  accent: string;
  className?: string;
  sizes?: string;
}) {
  if (imageUrl) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes={sizes ?? "(max-width: 768px) 100vw, 50vw"}
          className="object-cover"
        />
      </div>
    );
  }
  return <CoverArt seed={seed} accent={accent} className={className} />;
}