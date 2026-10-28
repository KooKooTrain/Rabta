/** Easings for the `motion` library (used in /demo). Keep in sync with tokens.css. */
export const ease = {
  outSoft: [0.22, 1, 0.36, 1],
  wipe: [0.76, 0, 0.24, 1],
  hover: [0.455, 0.03, 0.515, 0.955],
} as const;

export const dur = { fast: 0.16, base: 0.3, slow: 0.7, slower: 0.9 } as const;
