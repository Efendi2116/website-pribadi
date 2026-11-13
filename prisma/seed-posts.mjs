// Editorial seed for the Post model. Upserted by slug so reseeding never
// duplicates essays and preserves the original publication dates.
export const posts = [
  {
    id: "designing-with-constraints",
    slug: "designing-with-constraints",
    title: "Designing with constraints: a love letter to the grid",
    excerpt:
      "The blank canvas is a liar. Real craft starts the moment you accept the box you have to work inside.",
    accent: "iris",
    tags: "Design,Process",
    readingMinutes: 6,
    featured: true,
    publishedAt: new Date("2025-09-18T09:00:00+07:00"),
    content:
      "Every project I love started with a constraint I resented. A 12-column grid. A 200ms budget. A brand colour I could not change. At the time each felt like a cage; in hindsight each was the shape of the thing.\n\n## The blank canvas is a liar\n\nWe romanticise infinite freedom, but infinite freedom produces infinite mediocrity. When anything is possible, nothing is decided. A constraint is a decision someone already made for you — and decisions are the actual material of design.\n\nGive me a fixed type scale, a single accent hue, and a stubborn accessibility requirement, and I will give you something with a point of view. Give me a blank Figma file and a moodboard, and I will give you three hours of pretty nothing.\n\n## Constraints are a compression algorithm\n\nThink of a constraint as lossy compression for decision space. It throws away the options you would have agonised over and keeps the ones that matter. The grid does not limit your layout; it removes a thousand micro-decisions so you can spend your attention on the one that counts.\n\n- A type scale removes \"what size should this be?\"\n- A token palette removes \"which grey is this?\"\n- A motion budget removes \"should this animate?\"\n\n## How I work with them\n\nI write the constraints down before I open a design tool. Not as rules to obey, but as a surface to push against. The interesting work always happens at the seam where the constraint meets the content that refuses to fit.\n\n> Craft is not what you do with freedom. It is what you do with the little freedom you have left.\n\nSo the next time a brief boxes you in, do not fight it immediately. Live inside it for a day. Most of the time the box is not your enemy — it is the first collaborator who actually showed up.",
  },
  {
    id: "physics-of-a-good-button",
    slug: "physics-of-a-good-button",
    title: "The physics of a good button",
    excerpt:
      "A button is a tiny promise about weight, friction, and time. Here is how to make one that feels alive.",
    accent: "amber",
    tags: "Interaction,Motion,CSS",
    readingMinutes: 5,
    featured: true,
    publishedAt: new Date("2025-07-02T09:00:00+07:00"),
    content:
      "You press a button hundreds of times a day and never think about it. That is the goal. A good button is invisible until the moment it is not — and then it should feel like a small, satisfying physical object.\n\n## Weight\n\nWeight is communicated in three cues: shadow, scale, and resistance. A resting button sits slightly above the surface. On hover it rises a hair. On press it drops **into** the page, not away from it. That single translate-y of one pixel is the difference between a sticker and a key.\n\n## Friction\n\nTransitions are friction. Too fast and the control feels cheap; too slow and it feels broken. My defaults:\n\n- Hover colour: `120ms`, ease-out\n- Press transform: `80ms`, ease-in\n- Release: `200ms` with a gentle spring\n\nThe asymmetry matters. Pressing should be instant because the user caused it. Releasing can linger because the system is responding.\n\n## Time\n\nThe worst thing a button can do is nothing. Every press needs an immediate acknowledgement — a ripple, a depression, a spinner — even if the real work takes two seconds. Perceived latency is a design problem before it is an engineering one.\n\n> If the user has to wonder whether their click registered, you have already failed.\n\n## The state you forgot\n\nEveryone designs default and hover. Almost nobody designs `disabled`, `loading`, `success`, and `error` with the same care. A button that submits a form should travel through all four and land somewhere honest. Map the whole lifecycle before you ship the happy path.\n\nDo this and your interface stops feeling like a document and starts feeling like a place.",
  },
  {
    id: "webgl-without-melting-laptops",
    slug: "webgl-without-melting-laptops",
    title: "Shipping WebGL without melting laptops",
    excerpt:
      "Real-time graphics on the web is a performance budget wearing a costume. A field guide to staying smooth.",
    accent: "cyan",
    tags: "WebGL,Performance,Creative Coding",
    readingMinutes: 8,
    featured: false,
    publishedAt: new Date("2025-05-21T09:00:00+07:00"),
    content:
      "The first shader I shipped ran at 12fps on a MacBook Air and sounded like a hair dryer. The version that replaced it looked better and ran at 60. The difference was not cleverness — it was discipline.\n\n## One loop to rule them all\n\nRun a single `requestAnimationFrame` loop. Not one per object, not one per effect. One loop, one clock, and everything reads from it. Multiple loops fight for the frame and you will never debug the jitter.\n\n## Cap the pixel ratio\n\nRendering every device pixel is a trap. A 3x phone screen does not need 3x shading for a blurry background blob. Cap `devicePixelRatio` at 2 — often 1.5 — and nobody will notice except their battery.\n\n## Bake what does not move\n\nStatic shadows, environment maps, and ambient occlusion do not need to be recomputed every frame. Bake them once. Spend your per-frame budget on the things the user can actually steer.\n\n- Reuse geometry and materials; never rebuild them in the loop.\n- Do not drop resolution or disable effects *while dragging* — that is exactly when smoothness matters most.\n- Damp the controls so the camera glides instead of snapping.\n\n## Light for drama, not correctness\n\nPhysically-based does not mean boring. A coloured key light, a rim to separate the subject from the fog, and a touch of bloom will make a scene read like a still from something. Atmosphere is cheap; geometry is expensive. Spend on fog, particles, and emissive accents before you spend on another 100k triangles.\n\n## Degrade, do not break\n\nDetect a weak GPU and lower the particle count, not the ambition. The experience should get quieter on a low-end machine, never disappear. And always, always provide a reduced-motion path.\n\n> Smooth is a feature. It is the feature. Everything else is decoration on top of it.",
  },
  {
    id: "type-scales-that-scale",
    slug: "type-scales-that-scale",
    title: "Type scales that actually scale",
    excerpt:
      "Modular scales are a starting point, not a religion. How to build type that survives real content.",
    accent: "magenta",
    tags: "Typography,Design Systems",
    readingMinutes: 5,
    featured: false,
    publishedAt: new Date("2025-03-11T09:00:00+07:00"),
    content:
      "A modular type scale looks beautiful in a specimen and falls apart in a dashboard. The ratio that gives you elegant headings also gives you a 13.37px body that nobody can read. Here is how I actually build type.\n\n## Start from the body, not the display\n\nPick the body size for the reading distance and the device. 16px on desktop, 15–16px on mobile, more for long-form. Everything else is derived from that anchor — not from a golden ratio you found in a tweet.\n\n## Use a ratio, then break it on purpose\n\nA scale of `1.25` is a reasonable default. But real interfaces need exceptions: a dense table label, a hero that wants to be enormous, a legal footnote. Define the scale as tokens, then allow named overrides. The system should make the right thing easy and the wrong thing possible.\n\n- `text-xs` for meta and labels\n- `text-sm` for secondary UI\n- `text-base` for body\n- `text-lg`→`text-4xl` for headings\n- A separate `display` token for heroes\n\n## Line height is part of the size\n\nBig type wants tight leading; small type wants air. Bind line-height to the size token so a heading never inherits body leading. And measure line length in characters, not pixels — 60–75 characters is the comfortable band.\n\n## Test with the ugliest content\n\nYour scale is only as good as its worst case. Throw in a German compound word, a URL, a number with nine digits, and a heading three times longer than the design. If it survives those, it will survive production.\n\n> Typography is not decoration. It is the interface most people actually read.",
  },
  {
    id: "why-i-still-write-css-by-hand",
    slug: "why-i-still-write-css-by-hand",
    title: "Why I still write CSS by hand",
    excerpt:
      "Utility frameworks are great. But understanding the cascade is a superpower you should not outsource.",
    accent: "lime",
    tags: "CSS,Craft,Opinion",
    readingMinutes: 4,
    featured: false,
    publishedAt: new Date("2025-01-20T09:00:00+07:00"),
    content:
      "I use Tailwind every day. I also still write CSS by hand, and I think every frontend developer should. Not out of nostalgia — out of self-defence.\n\n## The abstraction leaks\n\nEvery utility framework is a thin wrapper over the cascade, specificity, and the box model. When something breaks — and it will — the person who understands what `position: sticky` actually does fixes it in two minutes. The person who only knows the class names files a bug.\n\n## Handwriting teaches the material\n\nWriting a layout in raw CSS forces you to understand intrinsic sizing, flex shrink, grid tracks, and containing blocks. Once you know them, the utilities become shorthand for things you already understand instead of incantations you memorised.\n\n## What I hand-write today\n\n- Keyframes and complex choreography\n- Custom properties and theming logic\n- Scroll-driven and view-transition experiments\n- Anything with `:has()`, container queries, or subgrid\n\nThe boring, repetitive spacing and colour? That is what utilities are for. Let the framework do the typing and keep the thinking for yourself.\n\n> Tools should compress knowledge you already have, not replace knowledge you never built.",
  },
];