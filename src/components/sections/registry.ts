import type { ComponentType } from "react";
import type { SectionId, Tone } from "@/config/types";
import { Audience } from "./Audience";
import { Faq } from "./Faq";
import { Features } from "./Features";
import { FinalCta } from "./FinalCta";
import { Hero } from "./Hero";
import { HowItWorks } from "./HowItWorks";
import { Impact } from "./Impact";
import { Marquee } from "./Marquee";
import { Moments } from "./Moments";
import { Problem } from "./Problem";
import { Team } from "./Team";
import { Trust } from "./Trust";

export interface SectionProps {
  id: SectionId;
  tone: Tone;
  /** 1-based position among enabled sections; shown as [ 02 ]. */
  index: number;
}

/** SectionId → component. Order/toggles live in site.sections. */
export const registry = {
  hero: Hero,
  marquee: Marquee,
  problem: Problem,
  how: HowItWorks,
  features: Features,
  audience: Audience,
  moments: Moments,
  trust: Trust,
  impact: Impact,
  team: Team,
  faq: Faq,
  cta: FinalCta,
} satisfies Record<SectionId, ComponentType<SectionProps>>;
