// In-memory SSE subscriber registry. A globalThis singleton keeps the same Set
// across route-handler modules and dev HMR within one server process. The
// homepage and admin both subscribe; create/delete broadcast to every client.
type Controller = ReadableStreamDefaultController<Uint8Array>;

const globalForRealtime = globalThis as unknown as {
  __projectSubscribers?: Set<Controller>;
};

export const subscribers: Set<Controller> =
  globalForRealtime.__projectSubscribers ?? new Set<Controller>();

globalForRealtime.__projectSubscribers = subscribers;

const encoder = new TextEncoder();

export function broadcast(event: string, data: unknown): void {
  const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const controller of subscribers) {
    try {
      controller.enqueue(encoder.encode(message));
    } catch {
      subscribers.delete(controller);
    }
  }
}