import type { Metadata } from "next";
import { getProjects } from "@/lib/data";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { WorkBrowser } from "@/components/site/work-browser";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected projects by Arka Wardhana — design systems, realtime dashboards, creative coding tools, and full-stack products.",
};

export default async function WorkPage() {
  const projects = await getProjects();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <Reveal>
        <SectionHeading
          eyebrow="Portfolio"
          title="Selected work"
          description="Design engineering, systems, and creative experiments. Filter by stack or search to find something specific."
        />
      </Reveal>
      <div className="mt-10">
        <WorkBrowser projects={projects} />
      </div>
    </div>
  );
}