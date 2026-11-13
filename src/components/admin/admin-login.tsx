"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shaking, setShaking] = useState(false);

  function reject(message: string) {
    setError(message);
    setShaking(true);
    setSubmitting(false);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!password) {
      reject("Enter the admin password to continue.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json().catch(() => null)) as {
        error?: string;
      } | null;

      if (res.ok) {
        toast.success("Welcome back.", {
          description: "Studio unlocked — you're signed in.",
        });
        onSuccess();
      } else if (res.status === 401) {
        reject(data?.error ?? "Incorrect password.");
        toast.error("Incorrect password.", {
          description: "Check the password and try again.",
        });
      } else if (res.status === 429) {
        reject(data?.error ?? "Too many attempts. Wait a moment.");
        toast.error("Too many attempts.", {
          description: data?.error ?? "Please wait a moment before retrying.",
        });
      } else {
        reject(data?.error ?? "Sign-in failed. Please try again.");
        toast.error("Sign-in failed.", {
          description: data?.error ?? "Something went wrong on the server.",
        });
      }
    } catch {
      reject("Network error — couldn't reach the server.");
      toast.error("Network error.", {
        description: "Couldn't reach the server. Check your connection and retry.",
      });
    }
  }

  return (
    <section className="relative grid min-h-[calc(100vh-4rem)] place-items-center overflow-hidden px-4 py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 size-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, var(--glow), transparent 65%)",
        }}
      />
      <div className="animate-fade-up relative w-full max-w-md">
        <div
          onAnimationEnd={() => setShaking(false)}
          className={cn(
            "relative overflow-hidden rounded-3xl bg-card/85 p-8 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.7)] ring-1 ring-foreground/10 backdrop-blur-xl",
            shaking && "animate-shake",
          )}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            style={{
              backgroundImage:
                "linear-gradient(90deg, transparent, var(--iris), var(--cyan), var(--magenta), transparent)",
            }}
          />

          <div className="flex flex-col items-center gap-4 text-center">
            <span
              className="grid size-14 place-items-center rounded-2xl text-white shadow-lg"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, var(--iris), var(--magenta))",
              }}
            >
              <LockKeyhole className="size-6" />
            </span>
            <div className="space-y-1.5">
              <p className="font-mono text-[11px] tracking-[0.24em] text-iris uppercase">
                Private console
              </p>
              <h1 className="text-2xl font-semibold tracking-tight">
                Project Studio
              </h1>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Sign in to publish new work and manage the portfolio shown on the
                homepage.
              </p>
            </div>
          </div>

          <form onSubmit={onSubmit} noValidate className="mt-7 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-password">Admin password</Label>
              <div className="relative">
                <Input
                  id="admin-password"
                  name="password"
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="••••••••••"
                  autoComplete="current-password"
                  autoFocus
                  aria-invalid={!!error}
                  aria-describedby={error ? "admin-password-error" : undefined}
                  className="h-12 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  aria-label={show ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 grid w-11 place-items-center text-muted-foreground transition-colors hover:text-foreground"
                >
                  {show ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
              {error && (
                <p
                  id="admin-password-error"
                  className="text-xs font-medium text-destructive"
                >
                  {error}
                </p>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={submitting}
              className="h-12 w-full rounded-full text-sm font-semibold text-white shadow-lg transition-transform hover:scale-[1.01]"
              style={{
                backgroundImage:
                  "linear-gradient(120deg, var(--iris), var(--blue) 55%, var(--magenta))",
              }}
            >
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Unlocking…
                </>
              ) : (
                <>
                  <ShieldCheck className="size-4" />
                  Unlock studio
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 flex items-start gap-2.5 rounded-xl bg-muted/50 p-3 ring-1 ring-foreground/5">
            <KeyRound className="mt-0.5 size-4 shrink-0 text-amber" />
            <p className="text-xs leading-relaxed text-muted-foreground">
              Local dev password:{" "}
              <code className="rounded bg-background/70 px-1.5 py-0.5 font-mono text-[11px] text-foreground">
                admin123
              </code>
              . Set <span className="font-mono">ADMIN_PASSWORD</span> in{" "}
              <span className="font-mono">.env</span> before deploying anywhere
              public.
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to the site
          </Link>
        </div>
      </div>
    </section>
  );
}