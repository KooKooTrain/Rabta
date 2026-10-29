# Hearthline: AI for Family (hackathon frame)

A home page and base frame for the **6th Annual ADU COE STEM Programming with AI Competition**
(Advanced Track · theme: *AI for Family* · 29 Oct 2026). The visual language:
- **One palette:** warm cream and charcoal neutrals with a single cobalt-blue accent ("brand") and a
  pale-blue soft tint. Light and dark mode (toggle in the header). To swap the accent colour, edit
  `--color-brand*` / `--color-tint` in `tokens.css` and the canvas palettes in `PixelField` / `StripeBand`.
- **Rounded shapes:** pill buttons and tags in condensed caps, rounded tiles and cards, and coloured
  sections drawn as rounded slabs inset from the page edges.
- **Structure and texture:** giant condensed caps, sliced photo hero, pinned stacking cards, stat
  bentos, animated pixel fields, pill strips, striped bands, perforated photo stamps, small `[ CAPS ]` labels.

**Stack:** Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 · lucide-react ·
GSAP + ScrollTrigger + Lenis (home page motion) · `motion` (only on /demo). There is no backend logic,
auth or database.

---

## Bayt: Family AI Game Day

Bayt runs a family game day from one screen. I pick a game, set up teams and rules, keep score during the
round, then let my AI judge check the footage. The judge proposes goals, possession and an MVP, and I decide
what counts. Football is live. Basketball, Dodgeball, Al Karabi and Al Ghomaidah show as coming soon.

**How it fits together**
- `/play` is the host wizard: game, players and teams, rules, round, AI judge, results. Match state lives in
  `localStorage` (`bayt.match.v1`), so a refresh doesn't lose the match.
- `python-judge/judge.py` reads a recorded clip with YOLOv8n plus ByteTrack, finds the ball (YOLO, with a
  colour mask as backup), works out teams from shirt colour, possession, and goals from the goal zones in the
  config. It writes `outputs/<run>/report.json`, `thumbs/*.jpg` and `annotated.mp4`.
- The report is signed with HMAC-SHA256 over canonical JSON. `POST /api/reports/verify` checks it on the
  server with a constant-time compare. If anything was edited after signing, I reject it and the official
  score stays the same. The browser never sees the secret and never decides validity.
- `GET /api/judge-files/<run>/<file>` serves thumbnails and the annotated video from `python-judge/outputs`
  (read-only, nothing goes in `public/`).

**Setup (Windows, PowerShell)**
```powershell
cd python-judge
py -3.14 -m venv .venv
.venv\Scripts\python -m pip install -r requirements.txt
.venv\Scripts\python -c "from ultralytics import YOLO; YOLO('yolov8n.pt')"
```
Make a long random secret and put it in `.env.local` as `BAYT_REPORT_SECRET=...` (see `.env.example`).
Set the same value in the shell before running the judge: `$env:BAYT_REPORT_SECRET = "<same value>"`.

**Run the judge**
```powershell
# check goal zones and ball colour on the first frame (writes outputs/demo/preview.jpg)
.venv\Scripts\python judge.py --input samples/demo.mp4 --config match.json --out outputs/demo --preview
# full run (use --frame-skip / --width to trade accuracy for speed, --no-video to skip the annotated clip)
.venv\Scripts\python judge.py --input samples/demo.mp4 --config match.json --out outputs/demo
```
`match.json` comes from the "Download judge config" button on the teams screen. `config.example.json` shows
every field, including goal zones and the ball colour range.

Easiest path: `npm run dev`, open `/play`, play the round, and upload the match MP4 on the AI judge screen. The
server saves it to `python-judge/uploads/`, runs the judge, and verifies the report before showing it. This judge
is a stand-in until the MediaPipe pipeline lands. You can still run the CLI and upload `report.json` on the
AI judge screen.

**Tamper test:** change `proposed_score` in `report.json` and upload it again. I show "Invalid signature:
report rejected" and the score doesn't move.

**Known limits**
- It runs locally only. Netlify can't run Python, and there's no camera recording in the app yet.
- YOLO often misses a small ball, so the colour mask does a lot of the work. Goals it finds that way are
  flagged for review. Tune the colour range with `--preview`.
- Tracker ids break up when people cross, so I map tracks to players by hand on the judge screen.
- Scorer attribution is rough (last confident holder). Team detection hasn't been tested on many kits.
- Video labels are ASCII only.

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
| Photos (+ credits) | `public/photos/`, `site.media` in `site.ts`, `src/config/photo-credits.json` |
| Scroll motion (GSAP / Lenis) | `src/lib/gsap.ts`, `src/components/motion/*` |
| Visual primitives | `src/components/visuals/*` (PixelField, PhotoShards, Stamp, PillStrip, StripeBand…) |

### Editing content
- Fake text is wrapped in `ph("…")`, which renders a visible **[PLACEHOLDER]** tag. Replace
  `ph("old")` with a plain `"new"` string and the tag disappears.
- Set `flags.showPlaceholderTags: false` to hide every tag at once, for screenshots.
- In headlines, `\n` is a line break and `*word*` becomes the accent-coloured word (cobalt on light and
  dark sections, ink on the cobalt slab). Headlines render in CAPS automatically, so write them in
  normal case.
- **Photos:** drop files in `public/photos/`, point `site.media.hero` (the sliced hero band) and
  `site.media.moments` (the stamp collage) at them, and log them in `photo-credits.json` + CREDITS.md.
  Team members and audience personas take an optional `photo` too.
- Reorder sections or turn them off in `site.sections`. A disabled section's nav link
  disappears automatically, and buttons that point at it are hidden, so there are no dead links.
- Icons are string keys (`"heart"`, `"shield-check"`, …) listed in `src/lib/icons.ts`. To add one,
  import it there.

### Editing tokens (rebrand in minutes)
`src/styles/tokens.css` has four blocks:
1. **Brand palette** (`@theme`): change the hex values. Keep the text/background contrast at AA (4.5:1).
2. **Tones** (`[data-tone=paper|panel|brand|charcoal|coal]`): which palette colour each section tone uses.
   `paper` sections run full-bleed; every other tone is drawn as a rounded slab inset from the edges.
3. **Dark theme** (`[data-theme="dark"]`): overrides for the tones. The theme follows the OS until the
   visitor uses the toggle; the choice is saved in `localStorage`. Logic lives in `src/lib/theme.ts`.
4. **Semantic utilities** (`bg-bg`, `text-fg`, `text-muted`, `border-line`, `bg-accent`, `bg-soft`, …).
   Components only use these, so steps 1–3 restyle everything in both themes.

Radii are tokens too: `rounded-pill` (buttons, tags), `rounded-inner`, `rounded-tile`, `rounded-card`,
`rounded-slab`.

Fonts: swap the imports in `src/config/fonts.ts` and keep the `variable` names.
`brand.seed` in `site.ts` reshuffles the pixel fields and photo-shard shapes everywhere.

### Motion
- Simple fade-ups: add `data-reveal` (+ `style={{"--i": n}}` for stagger). Hero load is pure CSS.
- Scroll effects use GSAP inside `gsap.matchMedia()` with the queries in `src/lib/gsap.ts`:
  pins and scrubs run only at ≥1024px, and nothing animates under `prefers-reduced-motion`.
- Lenis smooth scroll is mounted in `src/app/(site)/layout.tsx`; it is skipped for reduced motion and
  touch keeps native scrolling. Same-page anchor links glide to their section below the header.

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
- [ ] Photos that fit the real problem (and credits), or keep the current set.
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
- Skip link, landmarks, visible focus rings (pale blue on dark), AA colour pairs in both themes, and native
  `<details>` for the FAQ. The theme toggle is a real button with `aria-pressed`.
- `prefers-reduced-motion` is respected everywhere: CSS globally, `gsap.matchMedia()` for scroll
  effects, no Lenis, hooks in JS components, and `MotionConfig` in /demo.
- Content stays visible without JS. Reveal animations only hide content once JS has added `html.js`.
- Fonts are self-hosted via `next/font`. Photos go through `next/image` (AVIF/WebP, lazy except the
  hero shards). Pixel fields are canvases that pause off-screen.
