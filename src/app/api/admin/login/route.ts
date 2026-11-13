import type { NextRequest } from "next/server";
import { checkPassword, createSession } from "@/lib/auth";

// Lightweight in-memory throttle: max 8 failures per IP per 60s. A globalThis
// singleton survives dev HMR within one server process; it resets on restart,
// which is fine for a local-first, single-instance admin gate.
type Attempt = { count: number; resetAt: number };
const globalForLogin = globalThis as unknown as {
  __adminLoginAttempts?: Map<string, Attempt>;
};
const attempts: Map<string, Attempt> =
  globalForLogin.__adminLoginAttempts ?? new Map<string, Attempt>();
globalForLogin.__adminLoginAttempts = attempts;

const WINDOW_MS = 60_000;
const MAX_FAILURES = 8;

function clientKey(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local"
  );
}

export async function POST(request: NextRequest) {
  const key = clientKey(request);
  const now = Date.now();
  const record = attempts.get(key);

  if (record && record.resetAt > now && record.count >= MAX_FAILURES) {
    const retryAfter = Math.ceil((record.resetAt - now) / 1000);
    return Response.json(
      { error: "Too many attempts. Please wait a moment and try again." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  const password =
    typeof body === "object" && body !== null && "password" in body
      ? String((body as { password: unknown }).password ?? "")
      : "";

  if (!checkPassword(password)) {
    const entry =
      record && record.resetAt > now
        ? record
        : { count: 0, resetAt: now + WINDOW_MS };
    entry.count += 1;
    attempts.set(key, entry);
    return Response.json({ error: "Incorrect password." }, { status: 401 });
  }

  attempts.delete(key);
  await createSession();
  return Response.json({ ok: true });
}