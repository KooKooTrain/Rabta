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
    title: "Rabta",
    description:
      "Choose a family sport, build teams, and let Rabta review the match video, track the score, and save the result.",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    keywords: ["family sports", "AI referee", "sports game day", "ADU COE 2026"],
  },

  brand: {
    teamName: "Rabta",
    productName: "Rabta",
    tagline: "Family game day, judged fairly.",
    seed: "hearth-2026",
    // To use an image: { kind: "image", src: "/brand/logo.svg", width: 32, height: 32, alt: "" }
    logo: { kind: "mark" } as LogoConfig,
  },

  locale: { lang: "en", dir: "ltr" },

  flags: {
    showPlaceholderTags: false,
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
    { id: "moments", enabled: false, tone: "charcoal" },
    { id: "trust", enabled: true, tone: "coal", navLabel: "Trust" },
    { id: "impact", enabled: true, tone: "paper" },
    { id: "team", enabled: false, tone: "charcoal" },
    { id: "faq", enabled: true, tone: "paper", navLabel: "FAQ" },
    { id: "cta", enabled: true, tone: "brand" },
  ],

  content: {
    // [PLACEHOLDER] all hero copy
    hero: {
      eyebrow: "Family AI Game Day · Working prototype",
      headline: "Game day,\n*judged fairly.*",
      lead: "Choose a sport, set up teams, and play. Rabta reviews supported match action and prepares a clear report for the host to check.",
      primaryCta: { label: "Start game day", href: "/play" },
      secondaryCta: { label: "See how it works", href: "#how" },
      insight: {
        label: ph("Match report"),
        title: ph("Game complete"),
        detail: ph("Final score ready for host review"),
      },
      bottomBar: {
        clockLabel: "Abu Dhabi",
        timeZone: "Asia/Dubai",
        tagline: ph("Family sports, played together"),
        scrollHint: "Scroll to discover",
      },
    },

    // [PLACEHOLDER]
    marquee: {
      label: ph("Made for game day"),
      items: [
        ph("Football"),
        ph("Basketball"),
        ph("Volleyball"),
        ph("Emirati games"),
        ph("Family teams"),
        ph("Fair scoring"),
        ph("Match highlights"),
        ph("Game day together"),
      ],
    },

    // [PLACEHOLDER] replace with the real problem + cited statistics
    problem: {
      manifesto: ph(
        "Family sports should be about *playing together*, not arguing over the score.",
      ),
      eyebrow: ph("The game-day challenge"),
      heading: ph("Keep every\nmatch *fair*"),
      statement: ph(
        "Quick family matches can be hard to score consistently. Rabta reviews the recorded game, tracks what happened, and gives everyone a clear result to check together.",
      ),
      stats: [
        {
          value: 5,
          label: ph("games ready to play across sports and Emirati traditions"),
          source: ph("Football · basketball · volleyball · Al Karabi · Al Ghomaidah"),
        },
        {
          value: 2,
          unit: ph("teams"),
          label: ph("set up for a head-to-head family match"),
          source: ph("Create teams before each game"),
        },
        {
          value: 1,
          label: ph("match report saved with the final score and game details"),
          source: ph("Review the result before saving"),
        },
      ],
    },

    // [PLACEHOLDER] keep three plain verbs; rewrite around the real feature
    how: {
      eyebrow: ph("How it works"),
      heading: ph("Choose.\nPlay.\n*Review.*"),
      intro: ph(
        "Set up a family game, record the action, and review a clear match report together.",
      ),
      mockTitle: ph("Match overview"),
      mockSubtitle: ph("Family game day · 2 teams"),
      steps: [
        {
          verb: ph("Choose"),
          title: ph("Pick a game and make teams"),
          body: ph(
            "Choose football, basketball, volleyball, or an Emirati game, then add players to each team.",
          ),
          mock: {
            status: ph("Teams ready"),
            headline: ph("2 teams · 4 players"),
            rows: [
              { label: ph("Selected game"), value: ph("Football"), status: "info" },
              { label: ph("Home team"), value: ph("2 players"), status: "ok" },
              { label: ph("Away team"), value: ph("2 players"), status: "watch" },
            ],
            series: [3, 4, 3, 5, 4, 6, 5, 7, 6, 8],
          },
        },
        {
          verb: ph("Play"),
          title: ph("Rabta follows the match"),
          body: ph(
            "Record the game while Rabta tracks the action and prepares a score for the host to review.",
          ),
          mock: {
            status: ph("Match review"),
            headline: ph("Checking goals and possession"),
            rows: [
              { label: ph("Goals"), value: ph("3"), status: "watch" },
              { label: ph("Possession"), value: ph("52%"), status: "info" },
              { label: ph("Players tracked"), value: ph("4"), status: "ok" },
            ],
            series: [4, 5, 5, 7, 9, 8, 6, 5, 4, 4],
          },
        },
        {
          verb: ph("Review"),
          title: ph("Check and save the result"),
          body: ph(
            "The host checks the final report, confirms the result, and adds it to match history.",
          ),
          mock: {
            status: ph("Report ready"),
            headline: ph("3 – 2 · Match complete"),
            rows: [
              { label: ph("Final score"), value: ph("3 – 2"), status: "ok" },
              { label: ph("Match report"), value: ph("Reviewed"), status: "info" },
              { label: ph("Game history"), value: ph("Saved"), status: "ok" },
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
      intro: ph("Simple tools for a fair, fun family match."),
      highlight: {
        icon: "sparkles",
        title: ph("A clear match report"),
        body: ph(
          "Review the final score, key moments, player activity, and possession after each game.",
        ),
        chartLabel: ph("Match activity through the game"),
        series: [52, 55, 54, 58, 61, 60, 64, 67, 66, 71, 74, 78],
      },
      items: [
        { icon: "message", title: ph("Ask the game assistant"), body: ph("Get a clear explanation of a score or match report.") },
        { icon: "bell", title: ph("Plan the next match"), body: ph("Keep track of family practices and game days.") },
        { icon: "users", title: ph("Build family teams"), body: ph("Add players and see who is ready to play.") },
        { icon: "languages", title: ph("English and Arabic"), body: ph("Switch the game-day interface between both languages.") },
        { icon: "accessibility", title: ph("Easy to follow"), body: ph("Clear scores, simple setup, and calmer display options.") },
      ],
    },

    // [PLACEHOLDER]
    audience: {
      eyebrow: ph("Made for family game day"),
      heading: ph("A place for\nevery *player*"),
      intro: ph("Bring players, hosts, and supporters together around the same match."),
      items: [
        {
          name: ph("Game hosts"),
          need: ph("Set up teams and keep the match moving."),
          tags: [ph("Choose a game"), ph("Start a match"), ph("Review the score")],
          photo: { src: "/photos/family-03.jpg", alt: "A young woman and a small child laughing together outdoors" },
          chart: {
            label: ph("Game-day tasks"),
            segments: [
              { label: ph("Set up"), value: 42 },
              { label: ph("Play"), value: 33 },
              { label: ph("Review"), value: 25 },
            ],
          },
        },
        {
          name: ph("Players"),
          need: ph("Know the teams, rules, and score."),
          tags: [ph("Team colors"), ph("Game rules"), ph("Match result")],
          photo: { src: "/photos/family-02.jpg", alt: "A grandmother embraced by her granddaughter" },
          chart: {
            label: ph("Match details"),
            segments: [
              { label: ph("Teams"), value: 48 },
              { label: ph("Score"), value: 32 },
              { label: ph("Players"), value: 20 },
            ],
          },
        },
        {
          name: ph("Scorekeepers"),
          need: ph("Check the result and keep a record."),
          tags: [ph("Match report"), ph("Game history"), ph("Score review")],
          photo: { src: "/photos/family-05.jpg", alt: "A mother cuddling her young daughter beside a planter of flowers" },
          chart: {
            label: ph("Match report"),
            segments: [
              { label: ph("Goals"), value: 45 },
              { label: ph("Possession"), value: 30 },
              { label: ph("Movement"), value: 25 },
            ],
          },
        },
        {
          name: ph("Supporters"),
          need: ph("Follow the action and cheer both teams on."),
          tags: [ph("Live match"), ph("Team colors"), ph("Final score")],
          photo: { src: "/photos/family-09.jpg", alt: "A nurse holding the hand of an elderly man in a wheelchair" },
          chart: {
            label: ph("What to follow"),
            segments: [
              { label: ph("Goals"), value: 38 },
              { label: ph("Possession"), value: 36 },
              { label: ph("Team play"), value: 26 },
            ],
          },
        },
      ],
    },

    // [PLACEHOLDER]
    moments: {
      eyebrow: ph("Real moments"),
      heading: ph("Made for the\nmoments that *matter*"),
      intro: ph("From the first serve to the final score, make more of game day together."),
      pills: [ph("Team picks"), ph("Kick-off"), ph("Big saves"), ph("Family cheers"), ph("Rematches")],
    },

    // Mostly real principles; adapt to the actual problem.
    trust: {
      eyebrow: "Fair, responsible game review",
      heading: ph("Play fair.\nKeep it *clear.*"),
      intro: ph(
        "Rabta helps review recorded matches while keeping the family in control of the video and final score.",
      ),
      principles: [
        { icon: "lock", title: "Your match, your choice", body: ph("Only upload a game recording when your family is comfortable sharing it.") },
        { icon: "user-check", title: "Host confirms the score", body: ph("Rabta prepares a result for review; the host decides whether to save it.") },
        { icon: "shield-check", title: "Play safely", body: ph("Set age-appropriate teams and follow the safety rules for each game.") },
        { icon: "eye", title: "Clear match details", body: ph("Review the score and tracked events before adding a result to history.") },
      ],
      never: {
        heading: "How Rabta keeps game day fair",
        items: [
          ph("Change a result without host review"),
          ph("Choose teams without the players"),
          ph("Save a report before confirmation"),
          ph("Replace good sportsmanship"),
        ],
      },
    },

    // [PLACEHOLDER] label clearly as projected / target outcomes
    impact: {
      eyebrow: ph("The match, at a glance"),
      heading: ph("Every game\ngets a *result*"),
      note: ph("Choose a game, review its score, and keep a record of family matches. Results are examples until a host confirms them."),
      stats: [
        { value: 5, unit: ph("games"), label: ph("across worldwide sports and Emirati traditions") },
        { value: 2, label: ph("teams set up for a head-to-head match") },
        { value: 1, label: ph("reviewed result saved in match history") },
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
      heading: ph("Game day\n*questions*"),
      items: [
        { q: ph("What can we play?"), a: ph("Choose football, basketball, volleyball, Al Karabi, or Al Ghomaidah. Each game has its own setup and scoring rules.") },
        { q: ph("How does match review work?"), a: ph("Record a game and submit its video for review. Rabta tracks supported events and prepares a report for the host to check.") },
        { q: ph("Who confirms the final score?"), a: ph("The host reviews the report and decides whether to save the result to match history.") },
        { q: ph("Can we schedule practices and matches?"), a: ph("Yes. The Schedule page lets your family plan practices, friendly matches, and family games by sport.") },
        { q: ph("Is this a finished product?"), a: ph("Rabta is a working prototype built for the ADU COE STEM Programming with AI Competition 2026.") },
      ],
    },

    // [PLACEHOLDER]
    cta: {
      eyebrow: ph("See it in action"),
      heading: ph("Less scorekeeping.\nMore *playing.*"),
      body: ph("Pick a family game, build your teams, and get ready for a match."),
      primary: { label: "Start game day", href: "/play" },
      secondary: { label: "Read the FAQ", href: "#faq" },
    },
  },

  demo: {
    title: ph("Game"),
    subtitle: ph("Choose a sport, start a match, and keep the result."),
    nav: [
      { label: "Game", icon: "volleyball" },
      { label: "History", icon: "clock" },
      { label: "Family", icon: "users" },
      { label: "Schedule", icon: "calendar" },
      { label: "Settings", icon: "settings" },
    ],
    emptyState: {
      eyebrow: ph("Family sports"),
      heading: ph("Game day starts here"),
      body: ph("Choose a game and set up your teams to get started."),
    },
    assistantName: "Game day assistant",
    suggestedPrompts: [
      ph("Summarise our recent matches"),
      ph("Which game should we play next?"),
      ph("Explain this match report"),
    ],
    showSampleWidgets: true,
    showChat: false,
  },

  footer: {
    blurb: ph("A family sports referee and match companion, built for the ADU COE STEM Competition 2026."),
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
    legal: ph("Prototype for educational purposes. Match examples are sample data."),
  },

  competition: {
    name: "6th Annual ADU COE STEM Programming with AI Competition",
    track: "Advanced (Champions) Track",
    theme: "AI for Family",
    date: "29 October 2026",
  },
} satisfies SiteConfig;

export type Site = typeof site;
