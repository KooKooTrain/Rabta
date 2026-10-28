import Image from "next/image";
import type { Photo } from "@/config/types";
import { site } from "@/config/site";
import { seededRandom } from "@/lib/seeded";
import { cn } from "@/lib/utils";

const pct = (n: number) => `${n.toFixed(1)}%`;

/**
 * Wastetide-style hero band: photos cut into jagged, slightly rotated slices,
 * greyscale with one ember-red slice. Shards drop in on load (CSS .shard-in).
 * Shapes are seeded, so server and client match.
 */
export function PhotoShards({
  photos,
  className,
  redIndex = 2,
  preload = false,
}: {
  photos: Photo[];
  className?: string;
  /** Which shard gets the red duotone (-1 for none) */
  redIndex?: number;
  preload?: boolean;
}) {
  const rand = seededRandom(`${site.brand.seed}:shards`);
  const shards = photos.map((photo, i) => {
    const r = () => rand();
    const poly = [
      [r() * 8, r() * 10],
      [35 + r() * 25, r() * 6],
      [92 + r() * 8, r() * 12],
      [96 + r() * 4, 45 + r() * 10],
      [90 + r() * 10, 88 + r() * 12],
      [40 + r() * 25, 94 + r() * 6],
      [r() * 10, 90 + r() * 10],
      [r() * 6, 40 + r() * 20],
    ]
      .map(([x, y]) => `${pct(x)} ${pct(y)}`)
      .join(", ");
    return {
      photo,
      poly,
      grow: 0.75 + r() * 0.7,
      height: 78 + r() * 22,
      lift: (r() - 0.5) * 14,
      rot: (r() - 0.5) * 16,
      rest: (r() - 0.5) * 4,
      red: i === redIndex,
    };
  });

  return (
    <div className={cn("flex items-stretch", className)}>
      {shards.map((s, i) => (
        <div
          key={`${s.photo.src}-${i}`}
          className="shard-in relative -mx-[1.2%] min-w-0"
          style={
            {
              flex: `${s.grow} 1 0`,
              zIndex: i % 2 ? 2 : 1,
              "--i": i,
              "--rot": `${s.rot}deg`,
              "--rest": `${s.rest}deg`,
              transform: `rotate(${s.rest}deg)`,
            } as React.CSSProperties
          }
        >
          <div
            className={cn("absolute inset-x-0 overflow-hidden", s.red ? "bg-ember" : "bg-ink")}
            style={{
              clipPath: `polygon(${s.poly})`,
              height: `${s.height}%`,
              top: `calc(${(100 - s.height) / 2}% + ${s.lift}%)`,
            }}
          >
            <Image
              src={s.photo.src}
              alt={i === 0 ? s.photo.alt : ""}
              fill
              // Above the fold: preload the first three, load the rest eagerly
              {...(preload ? (i < 3 ? { preload: true } : { loading: "eager" as const }) : {})}
              sizes="(min-width: 1024px) 20vw, 30vw"
              className={cn(
                "object-cover grayscale",
                s.red ? "contrast-125 mix-blend-multiply" : "contrast-[1.1]",
              )}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
