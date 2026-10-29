/**
 * SITE CONFIG: all copy, nav, stats, CTAs, section order/toggles and flags.
 *
 * Tomorrow:
 *   1. Replace every ph("…") with a plain "string" (search: `ph(` or PLACEHOLDER).
 *   2. Reorder / toggle sections in `sections`.
 *   3. Set flags.showPlaceholderTags = false for clean screenshots.
 *
 * Text conventions: "\n" = line break (headlines), *word* = accent-coloured word.
 * Headlines render in condensed CAPS automatically; write them in normal case.
 */
import { ph } from "@/lib/copy";
import type { LogoConfig, SiteConfig } from "./types";

export const site = {
  meta: {
    title: "Rabta: Family AI Game Day",
    description:
      "Pick a family game, set up teams, and let my AI judge watch the video, spot the goals and keep score.",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    keywords: ["AI for Family", "family wellbeing", "ADU COE 2026"],
  },

  brand: {
    teamName: ph("Team Name"), // [PLACEHOLDER]
    productName: "Rabta",
    tagline: "Family game day, judged fairly.",
    seed: "hearth-2026",
    // To use an image: { kind: "image", src: "/brand/logo.svg", width: 32, height: 32, alt: "" }
    logo: { kind: "mark" } as LogoConfig,
  },

  locale: { lang: "en", dir: "ltr" },

  flags: {
    showPlaceholderTags: true,
    showBlueprintGrid: true,
  },

  nav: {
    cta: { label: "Start game day", href: "/play" },
    secondary: { label: "How it works", href: "/#how" },
  },

  // [PLACEHOLDER] stock photos (see CREDITS.md). Swap files in /public/photos.
  media: {
    hero: [
      { src: "/photos/family-01.jpg", alt: "A family of five sharing a home-cooked meal around a table" },
      { src: "/photos/family-02.jpg", alt: "A grandmother embraced by her granddaughter" },
      { src: "/photos/family-03.jpg", alt: "A young woman and a small child laughing together outdoors" },
      { src: "/photos/family-04.jpg", alt: "Children's and an adult's hands resting together" },
      { src: "/photos/family-08.jpg", alt: "Children's and an adult's hands cutting dough in a home kitchen" },
      { src: "/photos/family-07.jpg", alt: "A family of four walking along a woodland trail" },
    ],
    moments: [
      { src: "/photos/family-01.jpg", alt: "A family of five sharing a home-cooked meal around a table", caption: ph("Sunday lunch") },
      { src: "/photos/family-06.jpg", alt: "A boy carrying his smiling little sister on his back", caption: ph("Siblings") },
      { src: "/photos/family-02.jpg", alt: "A grandmother embraced by her granddaughter", caption: ph("Grandma's stories") },
      { src: "/photos/family-09.jpg", alt: "A nurse holding the hand of an elderly man in a wheelchair", caption: ph("Care, shared") },
      { src: "/photos/family-05.jpg", alt: "A mother cuddling her young daughter beside a planter of flowers", caption: ph("Check-in") },
      { src: "/photos/family-10.jpg", alt: "A family of five watching something together on a sofa", caption: ph("Movie night") },
      { src: "/photos/family-03.jpg", alt: "A young woman and a small child laughing together outdoors", caption: ph("Park day") },
      { src: "/photos/family-08.jpg", alt: "Children's and an adult's hands cutting dough in a home kitchen", caption: ph("Cook together") },
    ],
  },

  // Order here = order on the page. enabled:false hides a section and its nav link.
  sections: [
    { id: "hero", enabled: true, tone: "paper" },
    { id: "marquee", enabled: true, tone: "coal" },
    { id: "problem", enabled: true, tone: "paper", navLabel: "Problem" },
    { id: "how", enabled: true, tone: "paper", navLabel: "How it works" },
    { id: "audience", enabled: true, tone: "brand" },
    { id: "features", enabled: true, tone: "panel", navLabel: "Features" },
    { id: "moments", enabled: true, tone: "charcoal" },
    { id: "trust", enabled: true, tone: "coal", navLabel: "Trust" },
    { id: "impact", enabled: true, tone: "paper" },
    { id: "team", enabled: true, tone: "charcoal", navLabel: "Team" },
    { id: "faq", enabled: true, tone: "paper", navLabel: "FAQ" },
    { id: "cta", enabled: true, tone: "brand" },
  ],

  content: {
    // [PLACEHOLDER] all hero copy
    hero: {
      eyebrow: "Family AI Game Day · Working prototype",
      headline: "Game day,\n*judged fairly.*",
      lead: "Pick a game, set up the teams, and play. I watch the video, spot the goals, work out who had the ball most, and hand the host a signed report to apply.",
      primaryCta: { label: "Start game day", href: "/play" },
      secondaryCta: { label: "See how it works", href: "#how" },
      insight: {
        label: ph("AI insight"),
        title: ph("Thursday looks busy"),
        detail: ph("3 overlaps found · 2 suggestions ready"),
      },
      bottomBar: {
        clockLabel: "Abu Dhabi",
        timeZone: "Asia/Dubai",
        tagline: ph("Built in 3 hours for families everywhere"),
        scrollHint: "Scroll to discover",
      },
    },

    // [PLACEHOLDER]
    marquee: {
      label: ph("Designed around"),
      items: [
        ph("Shared routines"),
        ph("Health & wellbeing"),
        ph("Caring for grandparents"),
        ph("Screen-time balance"),
        ph("Meals & groceries"),
        ph("School & activities"),
        ph("Household budgets"),
        ph("Staying connected"),
      ],
    },

    // [PLACEHOLDER] replace with the real problem + cited statistics
    problem: {
      manifesto: ph(
        "Families don't need another app. They need *one calm place* that sees the whole week.",
      ),
      eyebrow: ph("The problem"),
      heading: ph("The *invisible*\nload"),
      statement: ph(
        "Every household runs on hundreds of small decisions: who needs what, when, and why. Most of that work is unseen, unshared, and lands on one person. The result is stress, missed moments, and problems noticed too late.",
      ),
      stats: [
        {
          value: 64,
          suffix: "%",
          label: ph("of parents say they feel overwhelmed coordinating family life"),
          source: ph("Source: add citation"),
        },
        {
          value: 3.5,
          decimals: 1,
          unit: ph("hrs / week"),
          label: ph("spent on planning and reminders"),
          source: ph("Source: add citation"),
        },
        {
          value: 1,
          suffix: " in 4",
          label: ph("families report a missed health or school task each month"),
          source: ph("Source: add citation"),
        },
      ],
    },

    // [PLACEHOLDER] keep three plain verbs; rewrite around the real feature
    how: {
      eyebrow: ph("How it works"),
      heading: ph("Notice.\nUnderstand.\n*Support.*"),
      intro: ph(
        "Three simple steps turn scattered family signals into clear, shared next steps.",
      ),
      mockTitle: ph("Family overview"),
      mockSubtitle: ph("This week · 4 members"),
      steps: [
        {
          verb: ph("Notice"),
          title: ph("It quietly gathers the signals"),
          body: ph(
            "Calendars, check-ins and routines come together in one calm view, only with each member's consent.",
          ),
          mock: {
            status: ph("Listening"),
            headline: ph("12 updates gathered"),
            rows: [
              { label: ph("Calendar events"), value: ph("8"), status: "info" },
              { label: ph("Check-ins"), value: ph("3"), status: "ok" },
              { label: ph("Reminders"), value: ph("1"), status: "watch" },
            ],
            series: [3, 4, 3, 5, 4, 6, 5, 7, 6, 8],
          },
        },
        {
          verb: ph("Understand"),
          title: ph("AI finds the pattern that matters"),
          body: ph(
            "The model highlights conflicts, risks and trends, and explains why in plain language anyone can follow.",
          ),
          mock: {
            status: ph("Analysing"),
            headline: ph("Thursday is overloaded"),
            rows: [
              { label: ph("Schedule overlaps"), value: ph("3"), status: "watch" },
              { label: ph("Rest time"), value: ph("-40%"), status: "watch" },
              { label: ph("Confidence"), value: ph("92%"), status: "info" },
            ],
            series: [4, 5, 5, 7, 9, 8, 6, 5, 4, 4],
          },
        },
        {
          verb: ph("Support"),
          title: ph("Everyone gets a clear next step"),
          body: ph(
            "Suggestions are shared with the right person, and a human always makes the final call.",
          ),
          mock: {
            status: ph("Ready"),
            headline: ph("2 suggestions shared"),
            rows: [
              { label: ph("Move pickup to 4:30"), value: ph("Accepted"), status: "ok" },
              { label: ph("Swap dinner duty"), value: ph("Pending"), status: "info" },
              { label: ph("Stress outlook"), value: ph("Lower"), status: "ok" },
            ],
            series: [8, 7, 7, 6, 5, 5, 4, 4, 3, 3],
          },
        },
      ],
    },

    // [PLACEHOLDER]
    features: {
      eyebrow: ph("Features"),
      heading: ph("Thoughtful\nby *design*"),
      intro: ph("Everything a family needs, nothing it doesn't."),
      highlight: {
        icon: "sparkles",
        title: ph("A weekly family pulse"),
        body: ph(
          "One glance shows how the week is going, what changed, and where a little help would make the biggest difference.",
        ),
        chartLabel: ph("Family wellbeing index"),
        series: [52, 55, 54, 58, 61, 60, 64, 67, 66, 71, 74, 78],
      },
      items: [
        { icon: "message", title: ph("Plain-language answers"), body: ph("Ask anything; get clear, kind explanations.") },
        { icon: "bell", title: ph("Gentle nudges"), body: ph("Reminders that arrive at the right moment for the right person.") },
        { icon: "users", title: ph("Shared, not surveilled"), body: ph("Every member sees and controls what they share.") },
        { icon: "languages", title: ph("Multilingual"), body: ph("Works across the languages your family speaks.") },
        { icon: "accessibility", title: ph("Accessible for all ages"), body: ph("Large text, voice, and simple modes for grandparents and kids.") },
      ],
    },

    // [PLACEHOLDER]
    audience: {
      eyebrow: ph("Who it's for"),
      heading: ph("How it helps\nevery member"),
      intro: ph("Every role in the family gets a view that fits their needs."),
      items: [
        {
          name: ph("Parents"),
          need: ph("Less mental load, fewer dropped balls."),
          tags: [ph("Shared calendar"), ph("Auto-reminders"), ph("Weekly pulse")],
          photo: { src: "/photos/family-03.jpg", alt: "A young woman and a small child laughing together outdoors" },
          chart: {
            label: ph("Where time goes"),
            segments: [
              { label: ph("Planning"), value: 42 },
              { label: ph("Reminders"), value: 33 },
              { label: ph("Follow-ups"), value: 25 },
            ],
          },
        },
        {
          name: ph("Grandparents"),
          need: ph("Stay close and supported, simply."),
          tags: [ph("Large text"), ph("Voice mode"), ph("Gentle check-ins")],
          photo: { src: "/photos/family-02.jpg", alt: "A grandmother embraced by her granddaughter" },
          chart: {
            label: ph("Support needs"),
            segments: [
              { label: ph("Health"), value: 48 },
              { label: ph("Connection"), value: 32 },
              { label: ph("Errands"), value: 20 },
            ],
          },
        },
        {
          name: ph("Teens"),
          need: ph("Independence with a safety net."),
          tags: [ph("Private by default"), ph("Study plans"), ph("Quick check-ins")],
          photo: { src: "/photos/family-05.jpg", alt: "A mother cuddling her young daughter beside a planter of flowers" },
          chart: {
            label: ph("Week balance"),
            segments: [
              { label: ph("School"), value: 45 },
              { label: ph("Activities"), value: 30 },
              { label: ph("Rest"), value: 25 },
            ],
          },
        },
        {
          name: ph("Caregivers"),
          need: ph("Clear handovers and shared context."),
          tags: [ph("Handover notes"), ph("Medication log"), ph("Shared tasks")],
          photo: { src: "/photos/family-09.jpg", alt: "A nurse holding the hand of an elderly man in a wheelchair" },
          chart: {
            label: ph("Care tasks"),
            segments: [
              { label: ph("Medication"), value: 38 },
              { label: ph("Appointments"), value: 36 },
              { label: ph("Daily care"), value: 26 },
            ],
          },
        },
      ],
    },

    // [PLACEHOLDER]
    moments: {
      eyebrow: ph("Real moments"),
      heading: ph("Made for the\nmoments that *matter*"),
      intro: ph("Less time coordinating. More time for the things families actually remember."),
      pills: [ph("Mealtimes"), ph("Bedtimes"), ph("School runs"), ph("Visits"), ph("Weekends")],
    },

    // Mostly real principles; adapt to the actual problem.
    trust: {
      eyebrow: "Responsible AI",
      heading: ph("Trust is the\n*first* feature"),
      intro: ph(
        "Family data is the most personal data there is. These principles shaped every decision we made.",
      ),
      principles: [
        { icon: "lock", title: "Private by design", body: ph("Data stays minimal, encrypted, and is never sold or used for ads.") },
        { icon: "user-check", title: "Human in the loop", body: ph("AI suggests; people decide. Nothing important happens automatically.") },
        { icon: "shield-check", title: "Age-appropriate", body: ph("Children's views and data follow stricter defaults.") },
        { icon: "eye", title: "Transparent AI", body: ph("Every suggestion shows why it was made and how confident it is.") },
      ],
      never: {
        heading: "What we never do",
        items: [
          ph("Sell or share family data"),
          ph("Diagnose or replace professionals"),
          ph("Make decisions without consent"),
          ph("Track members secretly"),
        ],
      },
    },

    // [PLACEHOLDER] label clearly as projected / target outcomes
    impact: {
      eyebrow: ph("Projected impact"),
      heading: ph("The *family*\neffect"),
      note: ph("Targets based on our prototype testing assumptions; not yet independently measured."),
      stats: [
        { value: 2, suffix: "+", unit: ph("hrs"), label: ph("saved per family, per week") },
        { value: 40, suffix: "%", label: ph("fewer missed tasks and appointments") },
        { value: 90, suffix: "%", label: ph("of suggestions understood on first read") },
      ],
    },

    // [PLACEHOLDER]
    team: {
      eyebrow: ph("The team"),
      heading: ph("Made by\n*students*"),
      intro: ph("Advanced Track · Grades 9–12 · Abu Dhabi University COE STEM Competition 2026"),
      members: [
        { name: ph("Member One"), role: ph("Lead developer"), detail: ph("Grade 11 · School name") },
        { name: ph("Member Two"), role: ph("AI & data"), detail: ph("Grade 11 · School name") },
        { name: ph("Member Three"), role: ph("Design & research"), detail: ph("Grade 10 · School name") },
        { name: ph("Member Four"), role: ph("Frontend & UX"), detail: ph("Grade 10 · School name") },
        { name: ph("Member Five"), role: ph("Pitch & testing"), detail: ph("Grade 9 · School name") },
      ],
    },

    // [PLACEHOLDER]
    faq: {
      eyebrow: "FAQ",
      heading: ph("Questions\nfamilies *ask*"),
      items: [
        { q: ph("Is my family's data safe?"), a: ph("Yes. We collect the minimum, encrypt it, and never sell it. Each member controls what they share and can delete it at any time.") },
        { q: ph("Does the AI make decisions for us?"), a: ph("No. It suggests and explains; a person always decides. Important actions always ask for confirmation.") },
        { q: ph("Who is it for?"), a: ph("Any family: parents, grandparents, teens and caregivers each get a view designed for them.") },
        { q: ph("What AI does it use?"), a: ph("A large language model behind a privacy layer, with clear explanations and confidence for every suggestion.") },
        { q: ph("Is this a finished product?"), a: ph("It's a working prototype built for the ADU COE STEM Programming with AI Competition 2026.") },
      ],
    },

    // [PLACEHOLDER]
    cta: {
      eyebrow: ph("See it in action"),
      heading: ph("Less juggling.\nMore *together.*"),
      body: ph("Explore the working prototype and see how it supports a real family week."),
      primary: { label: "Start game day", href: "/play" },
      secondary: { label: "Read the FAQ", href: "#faq" },
    },
  },

  demo: {
    title: ph("Game"),
    subtitle: ph("A clear view of how your family is doing."),
    nav: [
      { label: "Game", icon: "volleyball" },
      { label: "History", icon: "clock" },
      { label: "Family", icon: "users" },
      { label: "Schedule", icon: "calendar" },
      { label: "Settings", icon: "settings" },
    ],
    emptyState: {
      eyebrow: ph("Prototype canvas"),
      heading: ph("The feature goes here"),
      body: ph("Replace <EmptyState /> in src/app/demo/page.tsx with the problem-specific feature."),
    },
    assistantName: "Assistant",
    suggestedPrompts: [
      ph("Summarise our family week"),
      ph("What should we plan for Thursday?"),
      ph("Explain this suggestion simply"),
    ],
    showSampleWidgets: true,
    showChat: false,
  },

  footer: {
    blurb: ph("An AI companion for everyday family life, built for the ADU COE STEM Competition 2026."),
    actions: [
      { label: "Start game day", href: "/play" },
      { label: "Read the FAQ", href: "/#faq" },
    ],
    columns: [
      {
        title: "Product",
        links: [
          { label: "How it works", href: "/#how" },
          { label: "Features", href: "/#features" },
          { label: "Game day", href: "/play" },
        ],
      },
      {
        title: "About",
        links: [
          { label: "Responsible AI", href: "/#trust" },
          { label: "Team", href: "/#team" },
          { label: "FAQ", href: "/#faq" },
        ],
      },
    ],
    legal: ph("Prototype for educational purposes. Sample data only."),
  },

  competition: {
    name: "6th Annual ADU COE STEM Programming with AI Competition",
    track: "Advanced (Champions) Track",
    theme: "AI for Family",
    date: "29 October 2026",
  },
} satisfies SiteConfig;

export type Site = typeof site;
