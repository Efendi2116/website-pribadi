import type { NextRequest } from "next/server";
import { subscribers } from "@/lib/realtime";

// GET /api/writing/stream — Server-Sent Events channel for essay changes.
// Shares the realtime registry with the projects stream, so a publish/edit/
// delete pushes to the homepage, the writing index, and the admin at once.
export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();
  let keepAlive: ReturnType<typeof setInterval> | undefined;
  let controller: ReadableStreamDefaultController<Uint8Array> | undefined;

  const cleanup = () => {
    if (keepAlive) clearInterval(keepAlive);
    if (controller) subscribers.delete(controller);
  };

  const stream = new ReadableStream<Uint8Array>({
    start(ctrl) {
      controller = ctrl;
      subscribers.add(ctrl);
      ctrl.enqueue(encoder.encode("event: connected\ndata: {}\n\n"));
      keepAlive = setInterval(() => {
        try {
          ctrl.enqueue(encoder.encode(": keep-alive\n\n"));
        } catch {
          cleanup();
        }
      }, 25_000);
      request.signal.addEventListener("abort", cleanup, { once: true });
    },
    cancel() {
      cleanup();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}