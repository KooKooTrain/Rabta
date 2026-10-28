@AGENTS.md

# Project notes for AI assistants

Hackathon frame: Next.js 16 App Router + TS + Tailwind v4 (Turbopack CSS loader, no postcss config).
Read README.md first.

- **Content** lives only in `src/config/site.ts` (typed by `src/config/types.ts`). Never hardcode copy in components.
  Wrap unconfirmed copy in `ph("…")`; render Copy values with `<T c={…} />`. Use `plain()` for attributes.
- **Tokens** live only in `src/styles/tokens.css`. Components use semantic utilities (`bg-bg`, `text-fg`,
  `text-muted`, `border-line`, `bg-surface`, `bg-accent`, `text-accent-text`) so section tones work. Fixed light
  tints (`bg-sage`, `bg-blush`, …) must set `text-ink` explicitly.
- **Sections**: `components/sections/*`, registered in `registry.ts`, ordered/toggled by `site.sections`.
  Wrap in `<Section id tone>` + `<Container>`; headings via `<SectionHeading index>`.
- **Motion**: CSS-first. Add `data-reveal` (+ `style={{"--i": n}}`) for scroll reveals; RevealObserver handles it.
  `motion` (framer) is used only in /demo. Always respect reduced motion.
- Use logical properties (`ms-`, `pe-`, `start-`, `end-`) for RTL-readiness.
- Cache Components is OFF (see next.config.ts).
- The prototype goes in `src/app/demo/page.tsx` (replace `<EmptyState />`). AI calls go through `POST /api/ai`.
