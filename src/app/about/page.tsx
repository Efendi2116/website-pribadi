import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  Briefcase,
  Clock,
  Code,
  Gem,
  Globe,
  Heart,
  Layers,
  MapPin,
  Palette,
  Sparkles,
  Zap,
} from "lucide-react";
import {
  experience,
  principles,
  site,
  skillGroups,
  socialLinks,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { BrandIcon } from "@/components/site/brand-icon";
import { Marquee } from "@/components/site/marquee";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";

export const metadata: Metadata = {
  title: "About",
  description:
    "Arka Wardhana is a design engineer and creative developer in Bandung, Indonesia, building interfaces where systems meet play.",
};

const principleIcons = { gem: Gem, layers: Layers, zap: Zap, heart: Heart } as const;
const skillIcons = { palette: Palette, code: Code, sparkles: Sparkles } as const;
const skillAccents = ["iris", "cyan", "magenta"] as const;

const bio = [
  site.intro,
  "I started in agencies building campaign sites, detoured through product design at a fintech, and led frontend for a realtime analytics product before going independent. The through-line is a stubborn belief that design and engineering are the same job done at different zoom levels — the person who owns the pixels should understand the cascade, and the person who owns the architecture should care about the easing curve.",
  "These days I partner with a small number of teams at a time: design systems that get adopted, interfaces that stay fast under load, and the occasional creative experiment that reminds everyone why the web is fun. When I am not shipping, I am writing shaders, over-engineering my coffee, or walking Bandung looking for type on old shop signs.",
];

const facts = [
  { icon: MapPin, label: "Based in", value: site.location },
  { icon: Clock, label: "Timezone", value: site.timezone },
  { icon: Briefcase, label: "Focus", value: "Design engineering" },
  { icon: Globe, label: "Experience", value: "8+ years" },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <Reveal>
          <span className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.22em] text-iris uppercase">
            <span className="h-px w-6 bg-iris/60" />
            About
          </span>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Design engineer, creative developer, and relentless{" "}
            <span className="text-gradient">detail person.</span>
          </h1>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_20rem]">
          <Reveal delay={80}>
            <div className="prose-body max-w-none">
              {bio.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
            {site.availableForWork && (
              <p className="mt-8 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-2 text-sm font-medium">
                <span className="pulse-dot size-2 rounded-full bg-success" />
                Available for select projects
              </p>
            )}
          </Reveal>

          <Reveal delay={140}>
            <aside className="space-y-6 lg:sticky lg:top-24">
              <div className="overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/10">
                <div
                  className="relative grid h-40 place-items-center"
                  style={{
                    backgroundImage:
                      "radial-gradient(80% 120% at 30% 0%, color-mix(in oklch, var(--iris) 30%, transparent), transparent 60%), radial-gradient(80% 120% at 90% 100%, color-mix(in oklch, var(--magenta) 26%, transparent), transparent 60%)",
                  }}
                >
                  <div className="grain-overlay" />
                  <span className="text-gradient relative font-mono text-5xl font-bold tracking-tight">
                    ME
                  </span>
                </div>
                <dl className="divide-y divide-border">
                  {facts.map((fact) => (
                    <div
                      key={fact.label}
                      className="flex items-center gap-3 px-5 py-3.5"
                    >
                      <fact.icon className="size-4 shrink-0 text-iris" />
                      <dt className="text-sm text-muted-foreground">
                        {fact.label}
                      </dt>
                      <dd className="ml-auto text-right text-sm font-medium">
                        {fact.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="flex items-center gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target={social.icon === "mail" ? undefined : "_blank"}
                    rel="noreferrer noopener"
                    aria-label={social.label}
                    className="grid size-10 flex-1 place-items-center rounded-full border border-border bg-card/50 text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-iris/40 hover:text-iris"
                  >
                    <BrandIcon name={social.icon} className="size-4" />
                  </a>
                ))}
              </div>
            </aside>
          </Reveal>
        </div>
      </section>

      {/* Principles */}
      <section className="border-y border-border bg-card/20 py-20 sm:py-24">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <Reveal>
            <SectionHeading
              eyebrow="How I work"
              title="Four principles I keep coming back to"
            />
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {principles.map((principle, i) => {
              const Icon = principleIcons[principle.icon];
              return (
                <Reveal key={principle.title} delay={(i % 2) * 90}>
                  <div className="card-hover flex h-full gap-4 rounded-2xl bg-card p-6 ring-1 ring-foreground/10">
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-iris/12 text-iris">
                      <Icon className="size-5" />
                    </span>
                    <div className="space-y-2">
                      <h3 className="font-semibold tracking-tight">
                        {principle.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {principle.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <Reveal>
          <SectionHeading eyebrow="Career" title="Where I have been" />
        </Reveal>
        <ol className="mt-12 space-y-0">
          {experience.map((job, i) => (
            <Reveal key={job.org} delay={i * 70}>
              <li className="relative grid gap-2 pb-10 pl-8 sm:grid-cols-[10rem_1fr] sm:gap-6 sm:pl-10">
                <span
                  className="absolute top-1.5 left-0 size-3 rounded-full ring-4 ring-background sm:left-1"
                  style={{ background: `var(--${job.accent})` }}
                />
                {i < experience.length - 1 && (
                  <span className="absolute top-4 bottom-0 left-[5px] w-px bg-border sm:left-[9px]" />
                )}
                <span className="font-mono text-xs tracking-wide text-muted-foreground uppercase sm:pt-0.5">
                  {job.period}
                </span>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-semibold tracking-tight">
                    {job.role}{" "}
                    <span className="font-normal text-muted-foreground">
                      · {job.org}
                    </span>
                  </h3>
                  <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    {job.detail}
                  </p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* Toolkit */}
      <section className="border-y border-border bg-card/20 py-20 sm:py-24">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <Reveal>
            <SectionHeading eyebrow="Toolkit" title="What I reach for" />
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {skillGroups.map((group, i) => {
              const Icon = skillIcons[group.icon];
              const accent = skillAccents[i];
              return (
                <Reveal key={group.title} delay={i * 90}>
                  <div className="flex h-full flex-col gap-4 rounded-2xl bg-card p-6 ring-1 ring-foreground/10">
                    <div className="flex items-center gap-3">
                      <span
                        className="grid size-10 place-items-center rounded-xl"
                        style={{
                          background: `color-mix(in oklch, var(--${accent}) 16%, var(--card))`,
                          color: `var(--${accent})`,
                        }}
                      >
                        <Icon className="size-5" />
                      </span>
                      <h3 className="font-semibold tracking-tight">
                        {group.title}
                      </h3>
                    </div>
                    <ul className="space-y-2">
                      {group.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2.5 text-sm text-muted-foreground"
                        >
                          <span
                            className="mt-1.5 size-1.5 shrink-0 rotate-45 rounded-[1px]"
                            style={{ background: `var(--${accent})` }}
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <div className="py-6">
        <Marquee />
      </div>

      {/* CTA */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-8 sm:px-6">
        <Reveal>
          <div className="flex flex-col items-start gap-6 rounded-3xl bg-card p-8 ring-1 ring-foreground/10 sm:flex-row sm:items-center sm:justify-between sm:p-12">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
                Let&apos;s make something worth the detail.
              </h2>
              <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                I take on a few projects at a time. If you are building something
                that deserves real craft, I would love to hear about it.
              </p>
            </div>
            <Link
              href={`mailto:${site.email}`}
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-12 shrink-0 rounded-full px-6 text-sm font-semibold",
              )}
            >
              {site.email}
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}