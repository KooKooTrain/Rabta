import { site } from "@/config/site";
import type { SectionEntry } from "@/config/types";

/** Enabled sections in page order. */
export const enabledSections: SectionEntry[] = site.sections.filter((s) => s.enabled);

/** Header nav = enabled sections that have a navLabel. Never links to a hidden section. */
export const navItems = enabledSections
  .filter((s): s is SectionEntry & { navLabel: string } => Boolean(s.navLabel))
  .map((s) => ({ id: s.id, label: s.navLabel, href: `/#${s.id}` }));

const enabledIds = new Set<string>(enabledSections.map((s) => s.id));

/**
 * Footer/CTA links may point at sections that were toggled off. This drops
 * those so there are never dead anchors.
 */
export function isLiveHref(href: string): boolean {
  const m = href.match(/^\/?#([\w-]+)$/);
  return m ? enabledIds.has(m[1]) : true;
}
