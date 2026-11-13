"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { CheckCircle2, Loader2, Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX = 1000;

type Values = { name: string; email: string; message: string };
type Errors = Partial<Record<keyof Values, string>>;

const EMPTY: Values = { name: "", email: "", message: "" };

function validate(values: Values): Errors {
  const errors: Errors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const message = values.message.trim();
  if (name.length < 2 || name.length > 60)
    errors.name = "Please enter a name between 2 and 60 characters.";
  if (email.length > 200 || !EMAIL_RE.test(email))
    errors.email = "Please enter a valid email address.";
  if (message.length < 5 || message.length > MAX)
    errors.message = `Message must be between 5 and ${MAX} characters.`;
  return errors;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="text-xs font-medium text-destructive">
      {message}
    </p>
  );
}

export function ContactForm() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  function update(field: keyof Values, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
    setErrors((e) => (e[field] ? { ...e, [field]: undefined } : e));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validate(values);
    setErrors(found);
    const first = (Object.keys(found) as (keyof Values)[])[0];
    if (first) {
      toast.error("Please fix the highlighted fields.", {
        description: "A couple of details need a second look.",
      });
      document.getElementById(`contact-${first}`)?.focus();
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.trim(),
          message: values.message.trim(),
        }),
      });
      const data = await res.json().catch(() => null);

      if (res.status === 201) {
        toast.success("Message sent!", {
          description: "Thanks for reaching out — I'll get back to you soon.",
        });
        setValues(EMPTY);
        setErrors({});
        setSent(true);
      } else if (res.status === 400 && data?.fields) {
        setErrors(data.fields as Errors);
        toast.error("Validation failed.", {
          description: "Please check the highlighted fields and try again.",
        });
      } else {
        toast.error(data?.error ?? "Couldn't send your message.", {
          description: "Something went wrong on the server. Please try again.",
        });
      }
    } catch {
      toast.error("Network error.", {
        description: "Couldn't reach the server. Check your connection and retry.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="animate-success-pop flex flex-col items-center gap-5 rounded-2xl bg-card p-8 text-center ring-1 ring-foreground/10 sm:p-10">
        <span className="grid size-16 place-items-center rounded-full bg-success/12 text-success ring-1 ring-success/25">
          <CheckCircle2 className="size-8" />
        </span>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold tracking-tight">
            Message sent — thank you!
          </h3>
          <p className="mx-auto max-w-sm text-sm leading-relaxed text-muted-foreground">
            Your note landed safely. I read every message and usually reply
            within a day or two. Talk soon.
          </p>
        </div>
        <Button
          variant="outline"
          size="lg"
          className="rounded-full px-5"
          onClick={() => setSent(false)}
        >
          <Mail className="size-4" />
          Send another message
        </Button>
      </div>
    );
  }

  const remaining = MAX - values.message.length;

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="relative space-y-5 overflow-hidden rounded-2xl bg-card p-6 ring-1 ring-foreground/10 sm:p-8"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          backgroundImage:
            "linear-gradient(90deg, transparent, var(--iris), var(--cyan), var(--magenta), transparent)",
        }}
      />
      <div className="space-y-1">
        <h3 className="text-lg font-semibold tracking-tight">Send a message</h3>
        <p className="text-sm text-muted-foreground">
          Have a project, a role, or just a hello? Drop it here.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-name">
            Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="contact-name"
            name="name"
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Ada Lovelace"
            autoComplete="name"
            maxLength={60}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            className="h-11"
          />
          <FieldError id="contact-name-error" message={errors.name} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-email">
            Email <span className="text-destructive">*</span>
          </Label>
          <Input
            id="contact-email"
            name="email"
            type="email"
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            maxLength={200}
            aria-invalid={!!errors.email}
            aria-describedby={
              errors.email ? "contact-email-error" : "contact-email-hint"
            }
            className="h-11"
          />
          {errors.email ? (
            <FieldError id="contact-email-error" message={errors.email} />
          ) : (
            <p id="contact-email-hint" className="text-xs text-muted-foreground">
              Never shared — only used to reply.
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="contact-message">
            Message <span className="text-destructive">*</span>
          </Label>
          <span
            className={cn(
              "font-mono text-xs tabular-nums",
              remaining < 60 ? "text-warning" : "text-muted-foreground",
            )}
          >
            {values.message.length}/{MAX}
          </span>
        </div>
        <Textarea
          id="contact-message"
          name="message"
          value={values.message}
          onChange={(e) => update("message", e.target.value.slice(0, MAX))}
          placeholder="Tell me about what you're building…"
          rows={5}
          aria-invalid={!!errors.message}
          aria-describedby={
            errors.message ? "contact-message-error" : undefined
          }
          className="min-h-32 resize-y"
        />
        <FieldError id="contact-message-error" message={errors.message} />
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={submitting}
        className="h-12 w-full rounded-full text-sm font-semibold"
      >
        {submitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Sending…
          </>
        ) : (
          <>
            <Send className="size-4" />
            Send message
          </>
        )}
      </Button>
    </form>
  );
}