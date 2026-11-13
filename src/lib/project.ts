import type { Project } from "@prisma/client";
import { hashString } from "./format";

const ACCENTS = ["iris", "cyan", "amber", "magenta", "lime", "blue", "coral"];

// Presentation metadata is derived from the stored fields so the schema stays
// minimal. Accent is keyed on the title (stable across reseeds); the lead is the
// first paragraph of the description; the year comes from createdAt.
export function projectAccent(project: Pick<Project, "title">): string {
  return ACCENTS[hashString(project.title) % ACCENTS.length];
}

export function projectLead(project: Pick<Project, "description">): string {
  return project.description.split(/\n{2,}/)[0]?.trim() ?? "";
}

export function projectYear(project: Pick<Project, "createdAt">): number {
  return project.createdAt.getUTCFullYear();
}