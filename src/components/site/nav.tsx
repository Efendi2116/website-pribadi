"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, LockKeyhole, Menu, X } from "lucide-react";
import { navLinks, site } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

const HOME_SECTIONS = [
  { href: "#top", label: "Home" },
  { href: "#projects", label: "Projects" },
  { href: "#writing", label: "Writing" },
  { href: "#contact", label: "Contact" },
] as const;

function Monogram() {
  return (
    <span
      className="grid size-8 shrink-0 place-items-center rounded-[10px] text-[13px] font-bold text-white shadow-sm transition-transform group-hover:-rotate-6"
      style={{
        backgroundImage: "linear-gradient(135deg, var(--iris), var(--magenta))",
      }}
    >
      ME
    </span>
  );
}

export function Nav() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState("top");
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      setProgress(max > 0 ? Math.min(1, y / max) : 0);

      if (onHome) {
        let current = "top";
        for (const section of HOME_SECTIONS) {
          const el = document.getElementById(section.href.slice(1));
          if (el && el.getBoundingClientRect().top <= 140) current = el.id;
        }
        setActive(current);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [onHome]);

  const links = onHome ? HOME_SECTIONS : navLinks;
  const isLinkActive = (href: string) =>
    href.startsWith("#")
      ? active === href.slice(1)
      : href === "/"
        ? pathname === "/"
        : pathname.startsWith(href);

  const ctaHref = onHome ? "#contact" : "/guestbook";
  const ctaLabel = onHome ? "Get in touch" : "Let's talk";

  function renderLink(link: { href: string; label: string }, mobile: boolean) {
    const activeState = isLinkActive(link.href);
    const className = cn(
      mobile
        ? "block rounded-lg px-3 py-2.5 text-base font-medium transition-colors"
        : "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
      activeState
        ? "bg-accent text-accent-foreground"
        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
    );
    const onClick = mobile ? () => setOpen(false) : undefined;

    if (link.href.startsWith("#")) {
      return (
        <a
          key={link.href}
          href={link.href}
          onClick={onClick}
          aria-current={activeState ? "true" : undefined}
          className={className}
        >
          {link.label}
        </a>
      );
    }
    return (
      <Link
        key={link.href}
        href={link.href}
        onClick={onClick}
        aria-current={activeState ? "page" : undefined}
        className={className}
      >
        {link.label}
      </Link>
    );
  }

  const ctaClass = (mobile: boolean) =>
    cn(
      buttonVariants({ size: "lg" }),
      mobile
        ? "mt-2 w-full rounded-lg"
        : "hidden rounded-full px-4 sm:inline-flex",
    );

  const cta = (mobile: boolean) =>
    ctaHref.startsWith("#") ? (
      <a
        href={ctaHref}
        onClick={mobile ? () => setOpen(false) : undefined}
        className={ctaClass(mobile)}
      >
        {ctaLabel}
        <ArrowUpRight className="size-4" />
      </a>
    ) : (
      <Link
        href={ctaHref}
        onClick={mobile ? () => setOpen(false) : undefined}
        className={ctaClass(mobile)}
      >
        {ctaLabel}
        <ArrowUpRight className="size-4" />
      </Link>
    );

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background,border,box-shadow] duration-300",
        scrolled || open
          ? "border-b border-border bg-background/75 shadow-[0_8px_30px_-20px_rgba(0,0,0,0.6)] backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <Monogram />
          <span className="text-[15px] font-semibold tracking-tight">
            {site.name}
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => renderLink(link, false))}
        </div>

        <div className="flex items-center gap-1.5">
          <Link
            href="/admin"
            aria-label="Admin studio — projects & writing"
            title="Admin studio"
            className="grid size-8 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
          >
            <LockKeyhole className="size-4" />
          </Link>
          <ThemeToggle />
          {cta(false)}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-border bg-background/95 backdrop-blur-xl md:hidden">
          <div className="mx-auto max-w-6xl space-y-1 px-4 py-4">
            {links.map((link) => renderLink(link, true))}
            {cta(true)}
          </div>
        </div>
      )}

      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-0.5 overflow-hidden"
      >
        <div
          className="scroll-progress h-full transition-[width] duration-150 ease-out"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </header>
  );
}