"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Project } from "@prisma/client";

type ApiProject = Omit<Project, "createdAt"> & { createdAt: string };
export type LiveStatus = "loading" | "ready" | "error";

type Options = { limit?: number; pollMs?: number };

// Fetches projects and keeps them fresh: an SSE channel pushes create/delete
// events instantly, a visibility-aware poll is the fallback when SSE drops, and
// focus/visibility changes reconcile stale tabs. `live` reflects the SSE state.
export function useLiveProjects({ limit, pollMs = 20_000 }: Options = {}) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState<LiveStatus>("loading");
  const [live, setLive] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);
  const hasDataRef = useRef(false);

  const url = limit ? `/api/projects?limit=${limit}` : "/api/projects";

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
      const data = (await res.json()) as {
        projects: ApiProject[];
        total: number;
      };
      if (controller.signal.aborted || !mountedRef.current) return;
      hasDataRef.current = true;
      setProjects(
        data.projects.map((p) => ({ ...p, createdAt: new Date(p.createdAt) })),
      );
      setTotal(data.total ?? data.projects.length);
      setStatus("ready");
      setUpdatedAt(new Date());
    } catch {
      if (controller.signal.aborted || !mountedRef.current) return;
      // Keep showing stale data on a background failure; only surface the error
      // state when there is nothing to render yet.
      if (!hasDataRef.current) setStatus("error");
    }
  }, [url]);

  useEffect(() => {
    mountedRef.current = true;
    const kickoff = window.setTimeout(load, 0);

    let es: EventSource | null = null;
    if (typeof EventSource !== "undefined") {
      es = new EventSource("/api/projects/stream");
      const onLive = () => {
        if (mountedRef.current) setLive(true);
      };
      const onChange = () => load();
      const onDrop = () => {
        if (mountedRef.current) setLive(false);
      };
      es.addEventListener("connected", onLive);
      es.addEventListener("open", onLive);
      es.addEventListener("project:created", onChange);
      es.addEventListener("project:deleted", onChange);
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

  return { projects, total, status, live, updatedAt, reload: load };
}