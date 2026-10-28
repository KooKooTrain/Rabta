import { site } from "@/config/site";
import { cn } from "@/lib/utils";
import { GlyphShape } from "./Glyph";
import { buildKinGrid, swatches, type KinCell } from "./kin";

const CELL = 100;
const GAP = 6;

export interface KinTilesProps {
  cols: number;
  rows: number;
  seed?: string;
  /** Include the single saffron AI-spark tile. */
  spark?: boolean;
  /** Play the staggered load-in animation (hero). */
  animateIn?: boolean;
  /** Corner radius of each tile in viewBox units (cell = 100). */
  radius?: number;
  className?: string;
  /** Accessible label; omit for decorative use. */
  label?: string;
  /** Pre-built cells (used by KinTilesLive to swap glyphs). */
  cells?: KinCell[];
}

/** Signature motif: seeded mosaic of family glyph tiles. Server-safe, deterministic. */
export function KinTiles({
  cols,
  rows,
  seed = site.brand.seed,
  spark = true,
  animateIn = false,
  radius = 14,
  className,
  label,
  cells,
}: KinTilesProps) {
  const grid = cells ?? buildKinGrid(seed, cols, rows, { spark });
  const w = cols * CELL + (cols - 1) * GAP;
  const h = rows * CELL + (rows - 1) * GAP;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className={cn("block h-auto w-full", className)}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {grid.map((c) => {
        const s = swatches[c.swatch];
        return (
          <g key={c.key} transform={`translate(${c.col * (CELL + GAP)} ${c.row * (CELL + GAP)})`}>
            <g
              className={animateIn ? "tile-in" : undefined}
              style={
                {
                  "--d": c.col + c.row,
                  transformBox: "fill-box",
                  transformOrigin: "center",
                } as React.CSSProperties
              }
            >
              <rect width={CELL} height={CELL} rx={radius} fill={s.bg} />
              {c.glyph && (
                <g key={c.glyph} className="kin-glyph">
                  <GlyphShape name={c.glyph} color={s.fg} />
                </g>
              )}
            </g>
          </g>
        );
      })}
    </svg>
  );
}
