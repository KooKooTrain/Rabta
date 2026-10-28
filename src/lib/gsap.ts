"use client";

/**
 * GSAP setup, imported by every client component that animates on scroll.
 * Always wrap effects in `gsap.matchMedia()` with these queries so reduced
 * motion gets the static final state and pins/scrubs only run on desktop.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export const MQ = {
  /** Any viewport, motion allowed */
  motion: "(prefers-reduced-motion: no-preference)",
  /** lg+ and motion allowed: pins and scrubs */
  desktop: "(min-width: 64rem) and (prefers-reduced-motion: no-preference)",
  /** below lg, motion allowed */
  mobile: "(max-width: 63.999rem) and (prefers-reduced-motion: no-preference)",
} as const;

export { gsap, ScrollTrigger, useGSAP };
