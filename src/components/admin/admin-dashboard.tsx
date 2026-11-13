"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowUpRight,
  FileText,
  FolderOpen,
  Loader2,
  LogOut,
  Radio,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useLiveProjects } from "@/hooks/use-live-projects";
import { useLivePosts } from "@/hooks/use-live-posts";
import { cn } from "@/lib/utils";
import { ProjectForm } from "./project-form";
import { ProjectList } from "./project-list";
import { WritingManager } from "./writing-manager";

function LiveLed({ live }: { live: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-mono text-[11px] tracking-wide ring-1",
        live
          ? "bg-success/10 text-success ring-success/25"
          : "bg-amber/10 text-amber ring-amber/25",
      )}
      title={
        live
          ? "Connected — changes push to the homepage instantly"
          : "Reconnecting — falling back to periodic refresh"
      }
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          live ? "pulse-dot bg-success" : "bg-amber",
        )}
      />
      {live ? "LIVE" : "POLLING"}
    </span>
  );
}

type Tab = "projects" | "writing";

export function AdminDashboard({
  onSignOut,
  onSessionExpired,
}: {
  onSignOut: () => void;
  onSessionExpired: () => void;
}) {
  const projects = useLiveProjects();
  const writing = useLivePosts();
  const [tab, setTab] = useState<Tab>("projects");
  const [signingOut, setSigningOut] = useState(false);

  const active = tab === "projects" ? projects : writing;
  const countLabel = tab === "projects" ? "projects" : "essays";

  async function signOut() {
    setSigningOut(true);
    try {
      const res = await fetch("/api/admin/logout", { method: "POST" });
      if (res.ok) {
        toast.success("Signed out.", { description: "Studio locked." });
        onSignOut();
      } else {
        toast.error("Couldn't sign out.", { description: "Please try again." });
        setSigningOut(false);
      }
    } catch {
      toast.error("Network error.", {
        description: "Couldn't reach the server. Please retry.",
      });
      setSigningOut(false);
    }
  }

  const tabs = [
    {
      id: "projects" as Tab,
      label: "Projects",
      icon: FolderOpen,
      total: projects.total,
      ready: projects.status === "ready",
      tint: "text-iris",
    },
    {
      id: "writing" as Tab,
      label: "Writing",
      icon: FileText,
      total: writing.total,
      ready: writing.status === "ready",
      tint: "text-magenta",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <header className="animate-fade-up relative overflow-hidden rounded-3xl bg-card/70 p-6 ring-1 ring-foreground/10 backdrop-blur-xl sm:p-7">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{
            backgroundImage:
              "linear-gradient(90deg, transparent, var(--iris), var(--cyan), var(--magenta), transparent)",
          }}
        />
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1.5">
            <p className="flex items-center gap-2 font-mono text-[11px] tracking-[0.24em] text-iris uppercase">
              <Radio className="size-3.5" />
              Admin console
            </p>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {tab === "projects" ? "Project Studio" : "Writing Studio"}
            </h1>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              {tab === "projects"
                ? "Publish a project and watch it appear on the homepage in real time."
                : "Add or edit essays and watch the writing list update in real time."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <LiveLed live={active.live} />
            <span className="inline-flex items-center gap-1.5 rounded-full bg-muted/60 px-3 py-1.5 font-mono text-[11px] tracking-wide text-muted-foreground ring-1 ring-foreground/10">
              <span className="text-sm font-semibold text-foreground tabular-nums">
                {active.status === "ready" ? active.total : "—"}
              </span>
              {countLabel}
            </span>
            <Link
              href="/"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "rounded-full px-4",
              )}
            >
              View site
              <ArrowUpRight className="size-4" />
            </Link>
            <ThemeToggle />
            <Button
              variant="ghost"
              size="lg"
              onClick={signOut}
              disabled={signingOut}
              className="rounded-full px-4 text-muted-foreground hover:text-destructive"
            >
              {signingOut ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <LogOut className="size-4" />
              )}
              Sign out
            </Button>
          </div>
        </div>
        {active.updatedAt && (
          <p className="mt-4 font-mono text-[11px] text-muted-foreground">
            Last synced{" "}
            {active.updatedAt.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </p>
        )}
      </header>

      <div className="mt-6">
        <div
          className="inline-flex rounded-full bg-muted/60 p-1 ring-1 ring-foreground/10"
          role="tablist"
          aria-label="Studio sections"
        >
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setTab(t.id)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-card text-foreground shadow-sm ring-1 ring-foreground/10"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className={cn("size-4", isActive && t.tint)} />
                {t.label}
                <span className="font-mono text-xs text-muted-foreground tabular-nums">
                  {t.ready ? t.total : "—"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8 space-y-10">
        {tab === "projects" ? (
          <>
            <ProjectForm
              onCreated={projects.reload}
              onSessionExpired={onSessionExpired}
            />
            <ProjectList
              projects={projects.projects}
              total={projects.total}
              status={projects.status}
              live={projects.live}
              reload={projects.reload}
              onSessionExpired={onSessionExpired}
            />
          </>
        ) : (
          <WritingManager
            posts={writing.posts}
            total={writing.total}
            status={writing.status}
            live={writing.live}
            reload={writing.reload}
            onSessionExpired={onSessionExpired}
          />
        )}
      </div>
    </div>
  );
}