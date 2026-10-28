import type { Copy } from "@/lib/copy";
import type { IconName } from "@/lib/icons";

/* ----------------------------------------------------------------------------
 * SiteConfig contract. site.ts must satisfy this. Adding a section:
 *   1. add its id to SectionId  2. add a content type + key in SiteContent
 *   3. create components/sections/X.tsx  4. register it in sections/registry.ts
 *   5. list it in site.sections
 * ------------------------------------------------------------------------- */

export type SectionId =
  | "hero"
  | "marquee"
  | "problem"
  | "how"
  | "features"
  | "audience"
  | "moments"
  | "trust"
  | "impact"
  | "team"
  | "faq"
  | "cta";

export type Tone = "paper" | "panel" | "brand" | "charcoal" | "coal";
export type GlyphName =
  | "person"
  | "bond"
  | "home"
  | "embrace"
  | "sun"
  | "kin"
  | "data"
  | "spark";

/** A local photo in /public/photos (credit it in CREDITS.md). */
export interface Photo {
  src: string;
  alt: string;
  /** Short mono caption, e.g. on stamps. */
  caption?: Copy;
}

export interface SectionEntry {
  id: SectionId;
  enabled: boolean;
  tone: Tone;
  /** Shown in the header nav when set (links to /#id). */
  navLabel?: string;
}

export interface LinkItem {
  label: Copy;
  /** "/demo", "/#how", "#how", or an external https:// URL */
  href: string;
}

export interface StatItem {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  unit?: Copy;
  label: Copy;
  source?: Copy;
}

export interface MockRow {
  label: Copy;
  value: Copy;
  status?: "ok" | "watch" | "info";
}

/** One state of the code-built product preview card. */
export interface MockState {
  status: Copy;
  headline: Copy;
  rows: MockRow[];
  /** 7–12 numbers, any scale; rendered as a sparkline. */
  series: number[];
}

export interface HeroContent {
  eyebrow: Copy;
  /** Use \n for line breaks and *word* for the serif-italic emphasis. */
  headline: Copy;
  lead: Copy;
  primaryCta: LinkItem;
  secondaryCta: LinkItem;
  insight: { label: Copy; title: Copy; detail: Copy };
  bottomBar: { clockLabel: string; timeZone: string; tagline: Copy; scrollHint: string };
}

export interface MarqueeContent {
  label: Copy;
  items: Copy[];
}

export interface ProblemContent {
  /** Giant pinned statement; words scrub from faded to ink on scroll. Keep it short. */
  manifesto: Copy;
  eyebrow: Copy;
  heading: Copy;
  statement: Copy;
  /** First stat is rendered large. */
  stats: StatItem[];
}

export interface HowContent {
  eyebrow: Copy;
  heading: Copy;
  intro: Copy;
  mockTitle: Copy;
  mockSubtitle: Copy;
  steps: { verb: Copy; title: Copy; body: Copy; mock: MockState }[];
}

export interface FeaturesContent {
  eyebrow: Copy;
  heading: Copy;
  intro: Copy;
  highlight: { icon: IconName; title: Copy; body: Copy; chartLabel: Copy; series: number[] };
  items: { icon: IconName; title: Copy; body: Copy }[];
}

export interface AudienceContent {
  eyebrow: Copy;
  /** Shown above the cycling persona list on the brand slab. */
  heading: Copy;
  intro: Copy;
  items: {
    name: Copy;
    need: Copy;
    /** Outlined pills next to the list while this persona is active. */
    tags: Copy[];
    photo?: Photo;
    /** Donut card: 2–4 segments, values in any unit (shown as %). */
    chart: { label: Copy; segments: { label: Copy; value: number }[] };
  }[];
}

export interface MomentsContent {
  eyebrow: Copy;
  heading: Copy;
  intro: Copy;
  /** Stamp collage; photos come from site.media.moments. */
  pills: Copy[];
}

export interface TrustContent {
  eyebrow: Copy;
  heading: Copy;
  intro: Copy;
  principles: { icon: IconName; title: Copy; body: Copy }[];
  never: { heading: Copy; items: Copy[] };
}

export interface ImpactContent {
  eyebrow: Copy;
  heading: Copy;
  note: Copy;
  stats: StatItem[];
}

export interface TeamContent {
  eyebrow: Copy;
  heading: Copy;
  intro: Copy;
  members: { name: Copy; role: Copy; detail?: Copy; photo?: Photo }[];
}

export interface FaqContent {
  eyebrow: Copy;
  heading: Copy;
  items: { q: Copy; a: Copy }[];
}

export interface CtaContent {
  eyebrow: Copy;
  heading: Copy;
  body: Copy;
  primary: LinkItem;
  secondary?: LinkItem;
}

export interface SiteContent {
  hero: HeroContent;
  marquee: MarqueeContent;
  problem: ProblemContent;
  how: HowContent;
  features: FeaturesContent;
  audience: AudienceContent;
  moments: MomentsContent;
  trust: TrustContent;
  impact: ImpactContent;
  team: TeamContent;
  faq: FaqContent;
  cta: CtaContent;
}

export type LogoConfig =
  | { kind: "mark" }
  | { kind: "image"; src: string; width: number; height: number; alt: string };

export interface SiteConfig {
  meta: { title: string; description: string; url: string; keywords: string[] };
  brand: {
    teamName: Copy;
    productName: Copy;
    tagline: Copy;
    /** Any string; reshuffles the pixel fields and tile patterns everywhere. */
    seed: string;
    logo: LogoConfig;
  };
  locale: { lang: string; dir: "ltr" | "rtl" };
  flags: {
    /** Show visible [PLACEHOLDER] tags on ph("…") copy. Turn off for screenshots. */
    showPlaceholderTags: boolean;
    /** Dashed blueprint guide lines at the container edges. */
    showBlueprintGrid: boolean;
  };
  nav: { cta: LinkItem; secondary?: LinkItem };
  /** All photos in one place: swap files in /public/photos and edit here. */
  media: { hero: Photo[]; moments: Photo[] };
  sections: SectionEntry[];
  content: SiteContent;
  demo: {
    title: Copy;
    subtitle: Copy;
    nav: { label: string; icon: IconName }[];
    emptyState: { eyebrow: Copy; heading: Copy; body: Copy };
    assistantName: string;
    suggestedPrompts: Copy[];
    showSampleWidgets: boolean;
    showChat: boolean;
  };
  footer: {
    blurb: Copy;
    /** Big tint action squares. */
    actions: LinkItem[];
    columns: { title: string; links: LinkItem[] }[];
    legal: Copy;
  };
  competition: { name: string; track: string; theme: string; date: string };
}
