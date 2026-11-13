import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

const PASSWORD = process.env.ADMIN_PASSWORD ?? "admin123";
const SECRET = process.env.ADMIN_SECRET ?? `local-dev-secret::${PASSWORD}`;

function sessionToken(): string {
  return createHmac("sha256", SECRET).update("admin-session:v1").digest("hex");
}

// Constant-time, length-independent comparison.
export function checkPassword(input: string): boolean {
  const a = createHash("sha256").update(input).digest();
  const b = createHash("sha256").update(PASSWORD).digest();
  return timingSafeEqual(a, b);
}

export function isValidToken(value: string | undefined): boolean {
  if (!value) return false;
  const expected = sessionToken();
  if (value.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(value), Buffer.from(expected));
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return isValidToken(store.get(ADMIN_COOKIE)?.value);
}

export async function createSession(): Promise<void> {
  const store = await cookies();
  store.set(ADMIN_COOKIE, sessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
    // Local-first app served over http; enable for HTTPS deployments.
    secure: process.env.ADMIN_COOKIE_SECURE === "true",
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
}