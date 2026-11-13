"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";
import { signGuestbook, type GuestbookState } from "@/app/guestbook/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const initialState: GuestbookState = { status: "idle" };
const MAX = 500;

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="text-xs font-medium text-destructive">
      {message}
    </p>
  );
}

export function GuestbookForm() {
  const [state, formAction, pending] = useActionState(
    signGuestbook,
    initialState,
  );
  const [message, setMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const handled = useRef<GuestbookState | null>(null);

  useEffect(() => {
    if (handled.current === state) return;
    handled.current = state;
    if (state.status === "success") {
      toast.success("Thanks for signing the guestbook!", {
        description: state.message,
      });
      formRef.current?.reset();
    } else if (state.status === "error") {
      toast.error(state.message ?? "Something went wrong.");
    }
  }, [state]);

  const errors = state.errors ?? {};

  return (
    <form
      ref={formRef}
      action={formAction}
      onReset={() => setMessage("")}
      className="space-y-5 rounded-2xl bg-card p-6 ring-1 ring-foreground/10"
    >
      <div className="space-y-1">
        <h3 className="text-lg font-semibold tracking-tight">Leave a note</h3>
        <p className="text-sm text-muted-foreground">
          Say hello, share a thought, or tell me what you are building. Kind
          words only — this is a small, friendly wall.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">
          Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          name="name"
          placeholder="Ada Lovelace"
          required
          minLength={2}
          maxLength={60}
          autoComplete="name"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          className="h-10"
        />
        <FieldError id="name-error" message={errors.name} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">
          Email <span className="text-destructive">*</span>
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          maxLength={200}
          autoComplete="email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : "email-hint"}
          className="h-10"
        />
        {errors.email ? (
          <FieldError id="email-error" message={errors.email} />
        ) : (
          <p id="email-hint" className="text-xs text-muted-foreground">
            Never shown publicly — just so I can reply.
          </p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="message">
            Message <span className="text-destructive">*</span>
          </Label>
          <span
            className={`font-mono text-xs tabular-nums ${
              message.length > MAX - 40
                ? "text-warning"
                : "text-muted-foreground"
            }`}
          >
            {message.length}/{MAX}
          </span>
        </div>
        <Textarea
          id="message"
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value.slice(0, MAX))}
          placeholder="What is on your mind?"
          required
          minLength={5}
          rows={4}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          className="min-h-28 resize-y"
        />
        <FieldError id="message-error" message={errors.message} />
      </div>

      <Button
        type="submit"
        disabled={pending}
        className="h-11 w-full rounded-full text-sm font-semibold"
      >
        {pending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Signing…
          </>
        ) : (
          <>
            <Send className="size-4" />
            Sign the guestbook
          </>
        )}
      </Button>
    </form>
  );
}