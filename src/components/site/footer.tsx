import Link from "next/link";
import { cacheLife } from "next/cache";
import { ArrowUpRight } from "lucide-react";
import { navLinks, site, socialLinks } from "@/lib/constants";
import { BrandIcon } from "./brand-icon";

export async function Footer() {
  "use cache";
  cacheLife("days");
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 mt-24 border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.6fr_1fr_1fr]">
          <div className="space-y-4">
            <p className="font-mono text-xs tracking-[0.22em] text-iris uppercase">
              What&apos;s next
            </p>
            <h2 className="max-w-sm text-2xl font-semibold tracking-tight text-balance">
              Have a project that deserves real craft?
            </h2>
            <Link
              href={`mailto:${site.email}`}
              className="group inline-flex items-center gap-2 text-lg font-medium text-foreground underline-offset-4 hover:underline"
            >
              {site.email}
              <ArrowUpRight className="size-4 text-iris transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            {site.availableForWork && (
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="pulse-dot size-2 rounded-full bg-success" />
                Available for select work · {site.timezone}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <p className="font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase">
              Sitemap
            </p>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <p className="font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase">
              Elsewhere
            </p>
            <ul className="space-y-2">
              {socialLinks.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target={social.icon === "mail" ? undefined : "_blank"}
                    rel="noreferrer noopener"
                    className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <BrandIcon
                      name={social.icon}
                      className="size-4 text-muted-foreground transition-colors group-hover:text-iris"
                    />
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.name}. Built with Next.js, Prisma &amp; too much
            coffee.
          </p>
          <p className="font-mono">
            {site.location} · {site.timezone}
          </p>
        </div>
      </div>
    </footer>
  );
}