import { site } from "@/config/site";
import type { LinkItem } from "@/config/types";
import { isLiveHref } from "./nav";

/**
 * Dev-only sanity check: warns when a CTA in site.ts points to a section
 * anchor that is disabled (would be a dead link). Runs on the server.
 */
export function checkConfig() {
  if (process.env.NODE_ENV === "production") return;
  const links: [string, LinkItem | undefined][] = [
    ["nav.cta", site.nav.cta],
    ["hero.primaryCta", site.content.hero.primaryCta],
    ["hero.secondaryCta", site.content.hero.secondaryCta],
    ["cta.primary", site.content.cta.primary],
    ["cta.secondary", site.content.cta.secondary],
  ];
  for (const [where, link] of links) {
    if (link && !isLiveHref(link.href)) {
      console.warn(
        `[site.ts] ${where} links to "${link.href}" but that section is disabled. It will be hidden.`,
      );
    }
  }
}
