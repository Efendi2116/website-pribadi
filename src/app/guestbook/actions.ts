"use server";

import { updateTag } from "next/cache";
import { prisma } from "@/lib/prisma";

export type GuestbookState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: {
    name?: string;
    email?: string;
    message?: string;
  };
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function signGuestbook(
  _prev: GuestbookState,
  formData: FormData,
): Promise<GuestbookState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  const errors: NonNullable<GuestbookState["errors"]> = {};

  if (name.length < 2 || name.length > 60) {
    errors.name = "Please use between 2 and 60 characters.";
  }
  if (email.length > 200 || !EMAIL_RE.test(email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (message.length < 5 || message.length > 500) {
    errors.message = "Please use between 5 and 500 characters.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      errors,
    };
  }

  try {
    await prisma.message.create({ data: { name, email, message } });
    updateTag("messages");
    return { status: "success", message: "Your message is on the wall." };
  } catch {
    return {
      status: "error",
      message: "Could not save your message right now. Please try again.",
    };
  }
}