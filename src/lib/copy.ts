/**
 * Copy helpers. Fake text in site.ts is wrapped in ph("…") so it renders a
 * visible [PLACEHOLDER] tag while site.flags.showPlaceholderTags is true.
 * Replace ph("old") with a plain "new string" once the copy is real.
 */
export type Placeholder = { readonly text: string; readonly placeholder: true };
export type Copy = string | Placeholder;

export const ph = (text: string): Placeholder => ({ text, placeholder: true });

export const isPlaceholder = (c: Copy): c is Placeholder =>
  typeof c === "object" && c !== null && c.placeholder === true;

/** Plain string for attributes, metadata, aria-labels. */
export const plain = (c: Copy): string => (typeof c === "string" ? c : c.text);
