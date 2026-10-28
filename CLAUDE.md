@AGENTS.md

# Project notes for AI assistants

Hackathon frame: Next.js 16 App Router + TS + Tailwind v4 (Turbopack CSS loader, no postcss config).
Read README.md first.

- **Content** lives only in `src/config/site.ts` (typed by `src/config/types.ts`). Never hardcode copy in components.
  Wrap unconfirmed copy in `ph("…")`; render Copy values with `<T c={…} />`. Use `plain()` for attributes.
- **Tokens** live only in `src/styles/tokens.css`. Components use semantic utilities (`bg-bg`, `text-fg`,
  `text-muted`, `border-line`, `bg-surface`, `bg-soft`, `bg-accent`, `text-accent-text`, `text-emph`) so section
  tones (`paper | panel | ember | charcoal | coal`) AND light/dark mode (`html[data-theme]`) both work. One warm
  palette: ember is the single accent; no greens. Fixed colours (`bg-ember`, `bg-cream`, `text-ink`) only where
  the background is fixed too. Check both themes after any colour change.
- **Look**: rounded. Buttons and tags are pills (`Button`, `Pill`); surfaces use `rounded-inner | tile | card |
  slab`; non-paper sections render as inset rounded slabs (`Section`). Hairlines not shadows, `font-display` = condensed CAPS,
  `label-mono` for `[ LABELS ]`, paragraphs stay sentence case. Custom text sizes are registered in
  `lib/utils.ts` (tailwind-merge); add new ones there too.
- **Sections**: `components/sections/*`, registered in `registry.ts`, ordered/toggled by `site.sections`.
  Wrap in `<Section id tone>` (use `overflow-x-clip`, not `overflow-hidden`, so `+` marks show) + `<Container>`;
  headings via `<SectionHeading index>`.
- **Photos**: only from `site.media` / config `photo` fields, files in `public/photos/`, credited in
  `src/config/photo-credits.json` + CREDITS.md. Render with `next/image`.
- **Motion**: simple reveals use `data-reveal` (+ `style={{"--i": n}}`), handled by RevealObserver. Scroll
  effects use GSAP from `@/lib/gsap` inside `useGSAP` + `gsap.matchMedia()` with `MQ.*` (pins/scrubs only on
  `MQ.desktop`). Lenis is in `SmoothScroll`; lock scrolling via `lockScroll()` from `lib/smooth-scroll.ts`.
  `motion` (framer) is used only in /demo. Always respect reduced motion.
- Use logical properties (`ms-`, `pe-`, `start-`, `end-`) for RTL-readiness.
- Cache Components is OFF (see next.config.ts).
- The prototype goes in `src/app/demo/page.tsx` (replace `<EmptyState />`). AI calls go through `POST /api/ai`.
