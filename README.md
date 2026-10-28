# Hearthline: AI for Family (hackathon frame)

A home page and base frame for the **6th Annual ADU COE STEM Programming with AI Competition**
(Advanced Track · theme: *AI for Family* · 29 Oct 2026). The design system is called "Hearth Blueprint":
warm paper, a terracotta accent, oversized display type, mono labels, dashed blueprint hairlines, and
"Kin Tiles", a seeded mosaic of family glyphs that acts as the brand's signature.

**Stack:** Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 · lucide-react ·
`motion` (only on /demo). There is no backend logic, auth or database.

---

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (must pass before deploying)
npm run start      # serve the production build
npm run lint       # ESLint (flat config)
npx tsc --noEmit   # type check
```

Node 20.9+ is required (Node 22 or 24 recommended).

## Where things live

| What | File |
| --- | --- |
| **All copy, nav, stats, CTAs, section order/toggles, flags** | `src/config/site.ts` |
| Config types (the contract) | `src/config/types.ts` |
| **All design tokens** (colours, type scale, radii, shadows, easings, durations, tones) | `src/styles/tokens.css` |
| Fonts | `src/config/fonts.ts` |
| AI system prompt + scripted mock replies | `src/config/ai.ts` |
| Home page sections | `src/components/sections/*` (registered in `registry.ts`) |
| Prototype app shell | `src/app/demo/page.tsx`, `src/components/demo/*` |
| AI endpoint | `src/app/api/ai/route.ts`, `src/lib/ai/*` |
| Logo | `src/components/brand/LogoMark.tsx`, `src/app/icon.svg`, `public/brand/logo.svg` |

### Editing content
- Fake text is wrapped in `ph("…")`, which renders a visible **[PLACEHOLDER]** tag. Replace
  `ph("old")` with a plain `"new"` string and the tag disappears.
- Set `flags.showPlaceholderTags: false` to hide every tag at once, for screenshots.
- In headlines, `\n` is a line break and `*word*` becomes the serif-italic accent word.
- Reorder sections or turn them off in `site.sections`. A disabled section's nav link
  disappears automatically, and buttons that point at it are hidden, so there are no dead links.
- Icons are string keys (`"heart"`, `"shield-check"`, …) listed in `src/lib/icons.ts`. To add one,
  import it there.

### Editing tokens (rebrand in minutes)
`src/styles/tokens.css` has three blocks:
1. **Brand palette** (`@theme`): change the hex values. Keep the text/background contrast at AA (4.5:1).
2. **Tones** (`[data-tone=paper|sand|forest|night]`): which palette colour each section tone uses.
3. **Semantic utilities** (`bg-bg`, `text-fg`, `text-muted`, `border-line`, `bg-accent`, …).
   Components only use these, so steps 1 and 2 restyle everything.

Fonts: swap the imports in `src/config/fonts.ts` and keep the `variable` names.
`brand.seed` in `site.ts` reshuffles the Kin Tiles pattern everywhere.

## AI endpoint

`POST /api/ai`:
- Request body: `{ "messages": [{ "role": "user", "content": "…" }], "task"?: "…", "context"?: {} }`.
- Response: `{ id, mode: "mock" | "live", provider, model, message: { role, content }, latencyMs }`.

`GET /api/ai` is a health check.

With no key the endpoint runs in **mock mode** and returns the scripted replies from `src/config/ai.ts`.
That's useful for recording the video without a key. For a live provider, copy `.env.example` to
`.env.local` and set:

```
AI_PROVIDER=openai-compatible
AI_API_KEY=…
AI_MODEL=…
AI_BASE_URL=…   # optional: OpenAI, Groq, OpenRouter, Gemini (OpenAI-compatible) or Ollama
```

Keys are only read on the server. Never prefix them with `NEXT_PUBLIC_`.

## Deploy (Netlify + GitHub)

1. Create a GitHub repo, then run `git remote add origin <url>` and `git push -u origin main`.
2. On Netlify, go to **Add new site → Import from Git** and pick the repo. Netlify detects Next.js
   automatically through its adapter. `netlify.toml` sets the build command and Node 22.
3. Under **Site settings → Environment variables**, add `AI_PROVIDER`, `AI_API_KEY`, `AI_MODEL`
   (optional `AI_BASE_URL`), and `NEXT_PUBLIC_SITE_URL` set to the Netlify URL. Redeploy afterwards.
4. Netlify's synchronous functions time out after about 10s on the free tier, so keep AI calls short
   or use a fast model.

> Cache Components is turned **off** in `next.config.ts` on purpose. That keeps the classic Next.js
> data model, so AI-generated snippets "just work" under time pressure.

---

## Tomorrow checklist

**At 3:00 PM, when the problem is revealed**
- [ ] Read the problem twice and write a one-sentence promise: *"[Product] helps [who] [do what] so that [outcome]."*
- [ ] Set the product name, team name and tagline in `site.brand`, and `meta.title` / `meta.description`.

**Content (about 20 min)**
- [ ] Hero: eyebrow, headline (with one `*emphasis*` word), lead, insight chip.
- [ ] Problem: real statistics **with sources**. Delete any you can't cite.
- [ ] How it works: rewrite the 3 verbs and steps, and the mock rows and series, around the actual feature.
- [ ] Features, Audience, Trust (adapt the principles to the problem's real risks), Impact (label it *projected*), Team, FAQ, CTA.
- [ ] `demo.*`: title, nav items, prompts. `src/config/ai.ts`: system prompt and mock replies.
- [ ] Optional rebrand: palette in `tokens.css`, `brand.seed`, and the logo (`LogoMark.tsx` + `icon.svg`).
- [ ] Turn off sections you don't need in `site.sections`.

**Build the feature (most of the time)**
- [ ] Replace `<EmptyState />` in `src/app/demo/page.tsx`, putting new components in `src/components/demo/`.
- [ ] Reuse `Card`, `Stat`, `Sparkline`, `Donut`, `Pill`, `Button`, and the `SampleWidgets` patterns.
- [ ] Call the AI with `fetch("/api/ai", { method: "POST", body: JSON.stringify({ messages }) })`.
- [ ] Add an API key in `.env.local` (and on Netlify) if you're using live AI.

**Ship (last 30 min)**
- [ ] `grep -rn "ph(" src/config` should return nothing. Then set `flags.showPlaceholderTags: false`.
- [ ] `npm run build` passes. Push to GitHub, and Netlify deploys.
- [ ] Screenshots for the deck and video: hero, how it works, trust, and /demo at 1440px and 390px.
- [ ] Export all the AI chats into one PDF.

## Accessibility and performance notes
- Skip link, landmarks, visible focus rings (saffron on dark), AA colour pairs, and native `<details>` for the FAQ.
- `prefers-reduced-motion` is respected everywhere: CSS globally, hooks in JS components, and
  `MotionConfig` in /demo.
- Content stays visible without JS. Reveal animations only hide content once JS has added `html.js`.
- Fonts are self-hosted via `next/font`. Visuals are inline SVG and CSS, with no image requests on the home page.
