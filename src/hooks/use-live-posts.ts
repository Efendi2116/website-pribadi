"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Post } from "@prisma/client";
import type { LiveStatus } from "./use-live-projects";

export type { LiveStatus };

type ApiPost = Omit<Post, "publishedAt" | "updatedAt"> & {
  publishedAt: string;
  updatedAt: string;
};

type Options = { limit?: number; pollMs?: number };

// Fetches essays and keeps them fresh: an SSE channel pushes create/update/
// delete events instantly, a visibility-aware poll is the fallback when SSE
// drops, and focus/visibility changes reconcile stale tabs.
export function useLivePosts({ limit, pollMs = 20_000 }: Options = {}) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState<LiveStatus>("loading");
  const [live, setLive] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);
  const hasDataRef = useRef(false);

  const url = limit ? `/api/writing?limit=${limit}` : "/api/writing";

  const load = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const res = await fetch(url, {
        signal: controller.signal,
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data = (await res.json()) as { posts: ApiPost[]; total: number };
      if (controller.signal.aborted || !mountedRef.current) return;
      hasDataRef.current = true;
      setPosts(
        data.posts.map((p) => ({
          ...p,
          publishedAt: new Date(p.publishedAt),
          updatedAt: new Date(p.updatedAt),
        })),
      );
      setTotal(data.total ?? data.posts.length);
      setStatus("ready");
      setUpdatedAt(new Date());
    } catch {
      if (controller.signal.aborted || !mountedRef.current) return;
      if (!hasDataRef.current) setStatus("error");
    }
  }, [url]);

  useEffect(() => {
    mountedRef.current = true;
    const kickoff = window.setTimeout(load, 0);

    let es: EventSource | null = null;
    if (typeof EventSource !== "undefined") {
      es = new EventSource("/api/writing/stream");
      const onLive = () => {
        if (mountedRef.current) setLive(true);
      };
      const onChange = () => load();
      const onDrop = () => {
        if (mountedRef.current) setLive(false);
      };
      es.addEventListener("connected", onLive);
      es.addEventListener("open", onLive);
      es.addEventListener("writing:created", onChange);
      es.addEventListener("writing:updated", onChange);
      es.addEventListener("writing:deleted", onChange);
      es.addEventListener("error", onDrop);
    }

    const interval = setInterval(() => {
      if (document.visibilityState === "visible") load();
    }, pollMs);
    const onVisible = () => {
      if (document.visibilityState === "visible") load();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onVisible);

    return () => {
      mountedRef.current = false;
      window.clearTimeout(kickoff);
      es?.close();
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onVisible);
      abortRef.current?.abort();
    };
  }, [load, pollMs]);

  return { posts, total, status, live, updatedAt, reload: load };
}