import { site } from "@/config/site";
import { cn } from "@/lib/utils";
import { KinTiles } from "./KinTiles";

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

/** Team avatar: a 2×2 Kin Tile seeded by name, with initials on a paper chip. */
export function Monogram({ name, className }: { name: string; className?: string }) {
  return (
    <div className={cn("relative aspect-square w-full", className)} aria-hidden="true">
      <KinTiles cols={2} rows={2} seed={`${site.brand.seed}:${name}`} spark={false} radius={18} />
      <span className="absolute inset-0 grid place-items-center">
        <span className="grid size-[42%] place-items-center rounded-full bg-card font-display text-[clamp(1.25rem,4vw,2rem)] font-semibold tracking-[-0.03em] text-ink shadow-hair">
          {initials(name)}
        </span>
      </span>
    </div>
  );
}
