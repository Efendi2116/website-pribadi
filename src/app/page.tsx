import type { ComponentType } from "react";
import { ArrowDown, ArrowUpRight, Clock, Mail, MapPin } from "lucide-react";
import { site, socialLinks } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { AnimatedHeadline } from "@/components/site/animated-headline";
import { BrandIcon } from "@/components/site/brand-icon";
import { ContactForm } from "@/components/site/contact-form";
import { Marquee } from "@/components/site/marquee";
import { ProjectsSection } from "@/components/site/projects-section";
import { Reveal } from "@/components/site/reveal";
import { WritingSection } from "@/components/site/writing-section";

const contactRows: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href?: string;
  accent: string;
}[] = [
  {
    icon: Mail,
    label: "Email",
    value: site.email,
    href: `mailto:${site.email}`,
    accent: "iris",
  },
  {
    icon: MapPin,
    label: "Based in",
    value: `${site.location} · ${site.timezone}`,
    accent: "cyan",
  },
  {
    icon: Clock,
    label: "Response time",
    value: "Within a day or two",
    accent: "magenta",
  },
];

function Socials({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {socialLinks.map((social) => (
        <a
          key={social.label}
          href={social.href}
          target={social.icon === "mail" ? undefined : "_blank"}
          rel="noreferrer noopener"
          aria-label={social.label}
          className="grid size-10 place-items-center rounded-full border border-border bg-card/50 text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-iris/40 hover:text-iris"
        >
          <BrandIcon name={social.icon} className="size-4" />
        </a>
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* ---------------- Hero ---------------- */}
      <section
        id="top"
        className="relative mx-auto w-full max-w-5xl px-4 pt-16 pb-14 sm:px-6 sm:pt-24"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-[560px] max-w-3xl"
          style={{
            backgroundImage:
              "radial-gradient(58% 52% at 50% 28%, var(--glow), transparent 72%)",
          }}
        />

        <div className="relative flex flex-col items-center text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs font-medium backdrop-blur-md">
              <span className="pulse-dot size-2 rounded-full bg-success" />
              Available for select work
              <span className="hidden text-muted-foreground sm:inline">
                · {site.location}
              </span>
            </div>
          </Reveal>

          <div className="mt-7 max-w-3xl">
            <AnimatedHeadline />
          </div>

          <Reveal delay={120} className="mt-6">
            <p className="font-mono text-sm tracking-wide text-iris uppercase">
              {site.role}
            </p>
          </Reveal>

          <Reveal delay={180} className="mt-4 max-w-xl">
            <p className="text-lg leading-relaxed text-muted-foreground">
              {site.tagline}
            </p>
          </Reveal>

          <Reveal delay={240} className="mt-8">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="#projects"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-12 rounded-full px-6 text-sm font-semibold",
                )}
              >
                View selected work
                <ArrowDown className="size-4" />
              </a>
              <a
                href="#contact"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-12 rounded-full px-6 text-sm font-semibold",
                )}
              >
                Get in touch
                <ArrowUpRight className="size-4" />
              </a>
            </div>
          </Reveal>

          <Reveal delay={300} className="mt-8">
            <Socials className="justify-center" />
          </Reveal>

          <a
            href="#projects"
            className="group mt-14 inline-flex flex-col items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Scroll to explore
            <ArrowDown className="animate-scroll-cue size-4" />
          </a>
        </div>
      </section>

      {/* ---------------- Stack marquee ---------------- */}
      <section className="border-y border-border bg-card/30 py-5">
        <Marquee />
      </section>

      {/* ---------------- Projects (live from /api/projects) ---------------- */}
      <ProjectsSection />

      {/* ---------------- Writing (live from /api/writing) ---------------- */}
      <WritingSection />

      {/* ---------------- Contact ---------------- */}
      <section
        id="contact"
        className="relative border-t border-border bg-card/20 py-20 sm:py-24"
      >
        <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <div className="space-y-8">
            <Reveal>
              <div className="space-y-4">
                <span className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.22em] text-iris uppercase">
                  <span className="h-px w-6 bg-iris/60" />
                  Contact
                </span>
                <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                  Let&apos;s build something worth the detail.
                </h2>
                <p className="max-w-md text-base leading-relaxed text-muted-foreground">
                  Have a project in mind, a role to fill, or an idea that needs a
                  pair of hands? I read every message and reply personally.
                </p>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <ul className="space-y-3">
                {contactRows.map((row) => {
                  const Icon = row.icon;
                  const inner = (
                    <>
                      <span
                        className="grid size-11 shrink-0 place-items-center rounded-xl"
                        style={{
                          background: `color-mix(in oklch, var(--${row.accent}) 16%, var(--card))`,
                          color: `var(--${row.accent})`,
                        }}
                      >
                        <Icon className="size-5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-mono text-xs tracking-wide text-muted-foreground uppercase">
                          {row.label}
                        </span>
                        <span className="block text-sm font-medium">
                          {row.value}
                        </span>
                      </span>
                      {row.href && (
                        <ArrowUpRight className="ml-auto size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      )}
                    </>
                  );
                  const rowClass =
                    "card-hover group flex items-center gap-4 rounded-2xl bg-card p-4 ring-1 ring-foreground/10";
                  return (
                    <li key={row.label}>
                      {row.href ? (
                        <a href={row.href} className={rowClass}>
                          {inner}
                        </a>
                      ) : (
                        <div className={rowClass}>{inner}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </Reveal>

            <Reveal delay={160}>
              <Socials />
            </Reveal>
          </div>

          <Reveal delay={120}>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </div>
  );
}