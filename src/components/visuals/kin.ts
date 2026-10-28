import type { GlyphName } from "@/config/types";
import { seededRandom } from "@/lib/seeded";

/** Colour pairs used by Kin Tiles: CSS colour values from tokens.css. */
export const swatches = {
  sage: { bg: "var(--color-sage)", fg: "var(--color-forest)" },
  sky: { bg: "var(--color-sky)", fg: "var(--color-forest)" },
  blush: { bg: "var(--color-blush)", fg: "var(--color-ember-ink)" },
  butter: { bg: "var(--color-butter)", fg: "var(--color-ember-ink)" },
  card: { bg: "var(--color-card)", fg: "var(--color-ink)" },
  forest: { bg: "var(--color-forest)", fg: "var(--color-sage)" },
  ember: { bg: "var(--color-ember)", fg: "var(--color-paper)" },
  spark: { bg: "var(--color-saffron)", fg: "var(--color-ink)" },
} as const;

export type SwatchName = keyof typeof swatches;

export interface KinCell {
  key: string;
  col: number;
  row: number;
  swatch: SwatchName;
  glyph: GlyphName | null;
}

const GLYPHS: GlyphName[] = ["person", "bond", "home", "embrace", "sun", "kin", "data"];
const SWATCH_POOL: SwatchName[] = [
  "sage",
  "sage",
  "sky",
  "sky",
  "blush",
  "blush",
  "butter",
  "card",
  "card",
  "forest",
  "forest",
];

/** Deterministic grid for a given seed + size. */
export function buildKinGrid(
  seed: string,
  cols: number,
  rows: number,
  opts: { spark?: boolean; maxEmber?: number } = {},
): KinCell[] {
  const { spark = true, maxEmber = 2 } = opts;
  const rand = seededRandom(`${seed}:${cols}x${rows}`);
  const pick = <T>(arr: readonly T[]) => arr[Math.floor(rand() * arr.length)];
  const cells: KinCell[] = [];
  let ember = 0;
  const sparkAt = spark ? Math.floor(rand() * cols * rows) : -1;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const i = row * cols + col;
      let swatch: SwatchName;
      let glyph: GlyphName | null;
      if (i === sparkAt) {
        swatch = "spark";
        glyph = "spark";
      } else {
        swatch = pick(SWATCH_POOL);
        // Re-roll once to avoid identical neighbours
        const left = col > 0 ? cells[i - 1] : undefined;
        const up = row > 0 ? cells[i - cols] : undefined;
        if ((left && left.swatch === swatch) || (up && up.swatch === swatch)) {
          swatch = pick(SWATCH_POOL);
        }
        if (ember < maxEmber && rand() < 0.08) {
          swatch = "ember";
          ember++;
        }
        glyph = rand() < 0.16 ? null : pick(GLYPHS);
      }
      cells.push({ key: `${col}-${row}`, col, row, swatch, glyph });
    }
  }
  return cells;
}

export function nextGlyph(current: GlyphName | null, r: number): GlyphName {
  const options = GLYPHS.filter((g) => g !== current);
  return options[Math.floor(r * options.length)];
}
