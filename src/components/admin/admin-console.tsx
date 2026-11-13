"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { AdminLogin } from "./admin-login";
import { AdminDashboard } from "./admin-dashboard";

type Session = "checking" | "anon" | "authed";

function ConsoleLoading() {
  return (
    <div className="grid min-h-[70vh] place-items-center px-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <span
          className="grid size-14 place-items-center rounded-2xl text-white shadow-lg"
          style={{
            backgroundImage: "linear-gradient(135deg, var(--iris), var(--magenta))",
          }}
        >
          <Loader2 className="size-6 animate-spin" />
        </span>
        <p className="font-mono text-xs tracking-[0.22em] text-muted-foreground uppercase">
          Opening studio…
        </p>
      </div>
    </div>
  );
}

export function AdminConsole() {
  const [session, setSession] = useState<Session>("checking");

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch("/api/admin/session", {
          signal: controller.signal,
          cache: "no-store",
        });
        const data = (await res.json().catch(() => null)) as {
          authenticated?: boolean;
        } | null;
        if (controller.signal.aborted) return;
        setSession(data?.authenticated ? "authed" : "anon");
      } catch {
        if (controller.signal.aborted) return;
        setSession("anon");
      }
    })();
    return () => controller.abort();
  }, []);

  const handleAuthed = useCallback(() => setSession("authed"), []);
  const handleAnon = useCallback(() => setSession("anon"), []);

  if (session === "checking") return <ConsoleLoading />;
  if (session === "anon") return <AdminLogin onSuccess={handleAuthed} />;
  return (
    <AdminDashboard onSignOut={handleAnon} onSessionExpired={handleAnon} />
  );
}