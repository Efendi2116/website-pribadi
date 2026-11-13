// Idempotent seed for the personal website (two models: Project + Message).
// Run with: npm run db:seed  (or: node prisma/seed.mjs)
import { PrismaClient } from "@prisma/client";
import { posts } from "./seed-posts.mjs";

const prisma = new PrismaClient();

// Projects use readable ids so portfolio URLs stay pretty and the seed is
// idempotent (upsert by id). createdAt is set explicitly to keep a stable,
// newest-first ordering across reseeds.
const projects = [
  {
    id: "nusa-design-system",
    title: "Nusa Design System",
    description:
      "A token-driven component library that unified six product teams across an Indonesian fintech.\n\nNusa started as a messy Figma library and grew into the shared language for six product teams. I owned the design-engineering side: a three-tier token pipeline (primitive → semantic → component), 60+ accessible React components, and documentation that reads like a workshop rather than a spec.\n\nThe hardest part was migration, not markup. We shipped a codemod, a contrast-audit CI gate, and an adoption dashboard so teams could move at their own pace without breaking production. Within two quarters, 92% of new surfaces were built on Nusa and design-to-handoff time dropped by half.",
    imageUrl: null,
    tags: "Design System,React,Tokens,Accessibility",
    githubLink: "https://github.com/example/nusa",
    liveLink: "https://example.com/nusa",
    createdAt: new Date("2025-10-01T12:00:00Z"),
  },
  {
    id: "orbit-analytics",
    title: "Orbit Analytics",
    description:
      "A realtime operations dashboard streaming 40k events a minute into calm, legible charts.\n\nOrbit is the control room for a logistics fleet. The challenge was density without noise: dozens of live metrics that a dispatcher can read at a glance under pressure.\n\nI built a streaming layer over WebSocket with backpressure, a canvas-based chart renderer that stays at 60fps with 40k events/minute, and a colour system tested for colour-vision deficiency. Every alert has a sound, a motion cue, and a plain-language explanation — no raw error codes on the floor.",
    imageUrl: null,
    tags: "Data Viz,Next.js,WebSocket,Canvas",
    githubLink: null,
    liveLink: "https://example.com/orbit",
    createdAt: new Date("2025-08-15T12:00:00Z"),
  },
  {
    id: "lumen-shader-playground",
    title: "Lumen Shader Playground",
    description:
      "A browser GLSL editor with live uniforms, a node graph, and one-click export to video.\n\nLumen is where I go to play. It is a WebGL shader playground that treats uniforms as first-class controls: every parameter gets a slider, a colour picker, or a toggle, and the canvas responds the instant you move it.\n\nUnder the hood it is a single requestAnimationFrame loop, a capped pixel ratio, and reused geometry so dragging stays fluid even on integrated graphics. There is a node graph for people who think in connections, and an exporter that renders the current state to a WebM. It is half tool, half toy — and entirely the reason I fell for creative coding.",
    imageUrl: null,
    tags: "WebGL,GLSL,Creative Coding,Tooling",
    githubLink: "https://github.com/example/lumen",
    liveLink: "https://example.com/lumen",
    createdAt: new Date("2024-11-01T12:00:00Z"),
  },
  {
    id: "pasar-commerce-kit",
    title: "Pasar Commerce Kit",
    description:
      "A headless storefront starter for local makers — fast carts, honest checkout, zero bloat.\n\nPasar (\"market\") is a headless commerce kit built for small Indonesian makers who outgrew their marketplace. It pairs a Next.js storefront with a Stripe checkout, optimistic cart updates, and an admin that a non-technical owner can actually use.\n\nI focused on the unglamorous parts that decide whether a shop survives: image budgets, skeleton states that never shift layout, idempotent order webhooks, and a returns flow that does not require a support ticket. The whole thing runs on a single SQLite-backed service so a maker can self-host it on a $5 box.",
    imageUrl: null,
    tags: "E-commerce,Stripe,Next.js,Prisma",
    githubLink: "https://github.com/example/pasar",
    liveLink: "https://example.com/pasar",
    createdAt: new Date("2024-06-01T12:00:00Z"),
  },
  {
    id: "terra-motion",
    title: "Terra Motion",
    description:
      "A scroll-driven story about deforestation that turned a report into something people felt.\n\nAn NGO handed me a 60-page deforestation report and asked for a website. I gave them a scroll-driven narrative: pinned scenes, satellite imagery that scrubs with the timeline, and a soundtrack you can mute in one tap.\n\nThe trick was restraint. Motion only ever carries meaning — a forest that recedes as you scroll, a counter that ticks toward the present day. Everything degrades to a readable static article when reduced motion is on, and the whole experience still loads in under two seconds on 3G.",
    imageUrl: null,
    tags: "Motion,Storytelling,GSAP,Accessibility",
    githubLink: null,
    liveLink: "https://example.com/terra",
    createdAt: new Date("2023-09-01T12:00:00Z"),
  },
  {
    id: "signal-chat",
    title: "Signal Chat",
    description:
      "An end-to-end encrypted messaging interface that makes security feel calm, not paranoid.\n\nSignal Chat is a product design study turned working prototype: encrypted messaging where the cryptography is real but the interface never shouts about it. Verification is a gentle colour shift, key rotation is invisible, and the composer feels like every other chat app you already know.\n\nI designed the threat model in plain language, built the React client, and ran usability tests with journalists and organisers — the people who need this most and trust it least. The result is a UI that earns confidence through clarity instead of padlock icons.",
    imageUrl: null,
    tags: "Product,Realtime,Security,UI",
    githubLink: "https://github.com/example/signal",
    liveLink: null,
    createdAt: new Date("2023-03-01T12:00:00Z"),
  },
];

// Guestbook wall, backed by the Message model. Email is collected (required by
// the schema) but never shown publicly — these are friendly demo addresses.
const messages = [
  {
    name: "Maya Kusuma",
    email: "maya.kusuma@example.com",
    message:
      "The shader playground kept me up until 2am. Ended up using the export for my album cover — thank you for building toys that grow up into tools.",
    daysAgo: 2,
  },
  {
    name: "Diego Ferreira",
    email: "diego.ferreira@example.com",
    message:
      "Read your piece on button physics and immediately refactored our entire design system's press states. Small details, huge difference. FELT.",
    daysAgo: 5,
  },
  {
    name: "Siti Rahmawati",
    email: "siti.rahmawati@example.com",
    message:
      "Fellow Bandung-ish designer here. Nusa's token pipeline article finally made semantic tokens click for me. Keep writing, please!",
    daysAgo: 9,
  },
  {
    name: "Kenji Watanabe",
    email: "kenji.watanabe@example.com",
    message:
      "Orbit's colour-vision testing write-up is bookmarked by our whole team. Rare to see data viz that respects everyone's eyes.",
    daysAgo: 14,
  },
  {
    name: "Ayu Pramesti",
    email: "ayu.pramesti@example.com",
    message:
      "Signed after lurking for a year. Your work made me switch from marketing to creative development. This guestbook is my tiny thank-you.",
    daysAgo: 21,
  },
  {
    name: "Liam O'Connor",
    email: "liam.oconnor@example.com",
    message:
      "The reduced-motion fallback on Terra is the best I've seen. Accessibility as a first-class experience, not an afterthought. Respect.",
    daysAgo: 30,
  },
];

async function main() {
  for (const project of projects) {
    const { id, ...data } = project;
    await prisma.project.upsert({
      where: { id },
      update: data,
      create: project,
    });
  }

  for (const post of posts) {
    const data = { ...post };
    delete data.id;
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: data,
      create: post,
    });
  }

  const existing = await prisma.message.count();
  if (existing === 0) {
    const now = Date.now();
    await prisma.message.createMany({
      data: messages.map((m) => ({
        name: m.name,
        email: m.email,
        message: m.message,
        createdAt: new Date(now - m.daysAgo * 86400000),
      })),
    });
  }

  const [pc, mc, wc] = await Promise.all([
    prisma.project.count(),
    prisma.message.count(),
    prisma.post.count(),
  ]);
  console.log(`Seed complete: ${pc} projects, ${mc} messages, ${wc} posts.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });