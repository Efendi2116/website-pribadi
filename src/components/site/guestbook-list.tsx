import type { Message } from "@prisma/client";
import { MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDate, hashString, initials } from "@/lib/format";

const ACCENTS = ["iris", "cyan", "amber", "magenta", "lime", "blue", "coral"];

type WallMessage = Pick<Message, "id" | "name" | "message" | "createdAt">;

export function GuestbookList({ entries }: { entries: WallMessage[] }) {
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card/40 px-6 py-16 text-center">
        <span className="grid size-12 place-items-center rounded-full bg-muted text-muted-foreground">
          <MessageSquare className="size-5" />
        </span>
        <p className="font-medium">No notes yet</p>
        <p className="max-w-xs text-sm text-muted-foreground">
          Be the first to sign the guestbook and start the wall.
        </p>
      </div>
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {entries.map((entry) => {
        const accent = ACCENTS[hashString(entry.id) % ACCENTS.length];
        const color = `var(--${accent})`;

        return (
          <li
            key={entry.id}
            className="card-hover relative flex flex-col gap-3 overflow-hidden rounded-2xl bg-card p-5 ring-1 ring-foreground/10"
          >
            <span
              className="absolute inset-y-0 left-0 w-px"
              style={{
                background: `linear-gradient(180deg, ${color}, transparent)`,
              }}
            />
            <div className="flex items-start gap-3">
              <Avatar size="lg">
                <AvatarFallback
                  className="font-semibold"
                  style={{
                    background: `color-mix(in oklch, ${color} 20%, var(--card))`,
                    color,
                  }}
                >
                  {initials(entry.name)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="truncate font-semibold tracking-tight">
                    {entry.name}
                  </p>
                  <time
                    dateTime={entry.createdAt.toISOString()}
                    className="shrink-0 font-mono text-[11px] text-muted-foreground"
                  >
                    {formatDate(entry.createdAt)}
                  </time>
                </div>
                <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                  signed the guestbook
                </p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-foreground/90">
              {entry.message}
            </p>
          </li>
        );
      })}
    </ul>
  );
}