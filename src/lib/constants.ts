export const site = {
  name: "Muhammad Efendi",
  firstName: "Efendi",
  handle: "@S4N3F3ND1",
  role: "Design Engineer & Creative Developer",
  shortRole: "Design Engineer",
  location: "Jakarta, Indonesia",
  timezone: "GMT+7",
  email: "efendi2116@gmail.com",
  url: "https://efendi2116.dev",
  availableForWork: true,
  tagline:
    "I build interfaces where design engineering meets play — systems that scale, and moments that feel alive.",
  intro:
    "For eight years I have lived in the seam between design and code: turning fuzzy ideas into shipped products, design systems teams actually adopt, and the occasional shader that nobody asked for but everybody enjoys.",
};

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/writing", label: "Writing" },
  { href: "/about", label: "About" },
  { href: "/guestbook", label: "Guestbook" },
] as const;

export const ACCENTS = [
  "iris",
  "cyan",
  "amber",
  "magenta",
  "lime",
  "blue",
  "coral",
] as const;

export type Accent = (typeof ACCENTS)[number];

export type SocialIcon = "github" | "x" | "linkedin" | "dribbble" | "mail";

export const socialLinks: { label: string; href: string; icon: SocialIcon }[] =
  [
    { label: "GitHub", href: "https://github.com/example", icon: "github" },
    { label: "X / Twitter", href: "https://x.com/example", icon: "x" },
    {
      label: "LinkedIn",
      href: "https://linkedin.com/in/example",
      icon: "linkedin",
    },
    {
      label: "Dribbble",
      href: "https://dribbble.com/example",
      icon: "dribbble",
    },
    { label: "Email", href: "mailto:halo@arkawardhana.dev", icon: "mail" },
  ];

export const marqueeStack = [
  "TypeScript",
  "React",
  "Next.js",
  "Tailwind CSS",
  "Prisma",
  "WebGL / GLSL",
  "Figma",
  "Framer Motion",
  "Node.js",
  "SQLite",
  "Design Tokens",
  "Accessibility",
  "Three.js",
  "Vite",
  "Storybook",
  "PostgreSQL",
];

export const skillGroups = [
  {
    title: "Design",
    icon: "palette",
    items: [
      "Product & interaction design",
      "Design systems & tokens",
      "Typography & layout",
      "Prototyping in Figma",
      "Accessibility (WCAG 2.2)",
    ],
  },
  {
    title: "Engineering",
    icon: "code",
    items: [
      "TypeScript / React / Next.js",
      "Node & edge runtimes",
      "Prisma / SQL / data modelling",
      "Performance budgets",
      "Testing & CI",
    ],
  },
  {
    title: "Creative",
    icon: "sparkles",
    items: [
      "WebGL / GLSL shaders",
      "Motion & choreography",
      "Generative art",
      "Scroll-driven narrative",
      "Sound design",
    ],
  },
] as const;

export const experience = [
  {
    period: "2023 — Now",
    role: "Independent Design Engineer",
    org: "Studio of one",
    detail:
      "Partnering with product teams to design and ship interfaces, design systems, and the occasional creative experiment. Clients across fintech, logistics, and climate.",
    accent: "iris",
  },
  {
    period: "2020 — 2023",
    role: "Senior Frontend Engineer",
    org: "Grafika Labs",
    detail:
      "Led the frontend for a real-time analytics product. Built the charting engine, the design system, and the hiring loop for a team of six.",
    accent: "cyan",
  },
  {
    period: "2018 — 2020",
    role: "Product Designer",
    org: "Pijar (fintech)",
    detail:
      "Designed core money flows for a consumer banking app used by two million people. Learned that trust is a visual property.",
    accent: "amber",
  },
  {
    period: "2016 — 2018",
    role: "Frontend Developer",
    org: "Various agencies",
    detail:
      "Cut my teeth on campaign sites, e-commerce, and a lot of jQuery. Discovered that I liked the code as much as the pixels.",
    accent: "magenta",
  },
] as const;

export const principles = [
  {
    title: "Craft is a feature",
    body: "The last 10% — the easing curve, the empty state, the focus ring — is what people actually remember. I budget for it.",
    icon: "gem",
  },
  {
    title: "Systems over screens",
    body: "A beautiful screen that cannot be reproduced is a liability. I design the rules, then let the screens fall out of them.",
    icon: "layers",
  },
  {
    title: "Fast is a feeling",
    body: "Performance is not a benchmark, it is respect for someone's time and battery. Smoothness is the baseline, not the goal.",
    icon: "zap",
  },
  {
    title: "Everyone gets the good version",
    body: "Accessibility and reduced motion are not a separate, sadder experience. They are the same experience, designed properly.",
    icon: "heart",
  },
] as const;

export const accentHues = [
  "iris",
  "cyan",
  "amber",
  "magenta",
  "lime",
  "blue",
] as const;
