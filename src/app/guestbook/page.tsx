import type { Metadata } from "next";
import { Suspense } from "react";
import { getMessageCount, getMessages } from "@/lib/data";
import { pluralize } from "@/lib/format";
import { GuestbookForm } from "@/components/site/guestbook-form";
import { GuestbookList } from "@/components/site/guestbook-list";
import { Reveal } from "@/components/site/reveal";
import { SectionHeading } from "@/components/site/section-heading";

export const metadata: Metadata = {
  title: "Guestbook",
  description:
    "Leave a note in Arka Wardhana's guestbook — a small, friendly wall of hellos, thoughts, and kind words.",
};

async function Entries() {
  const entries = await getMessages();
  return <GuestbookList entries={entries} />;
}

function ListFallback() {
  return (
    <div className="grid animate-pulse gap-4 sm:grid-cols-2">
      {Array.from({ length: 4 }, (_, i) => (
        <div
          key={i}
          className="h-40 rounded-2xl bg-card ring-1 ring-foreground/10"
        />
      ))}
    </div>
  );
}

export default async function GuestbookPage() {
  const count = await getMessageCount();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <Reveal>
        <SectionHeading
          eyebrow="Say hello"
          title="Guestbook"
          description={`A small, friendly wall — ${pluralize(
            count,
            "note",
          )} so far. Sign it, read what others left, and tell me what you are building.`}
        />
      </Reveal>

      <div className="mt-10 grid gap-8 lg:grid-cols-[22rem_1fr] lg:items-start">
        <Reveal className="lg:sticky lg:top-24">
          <GuestbookForm />
        </Reveal>

        <div>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold tracking-tight">The wall</h2>
            <span className="rounded-full bg-muted px-2.5 py-1 font-mono text-xs text-muted-foreground tabular-nums">
              {count} {count === 1 ? "note" : "notes"}
            </span>
          </div>
          <Suspense fallback={<ListFallback />}>
            <Entries />
          </Suspense>
        </div>
      </div>
    </div>
  );
}