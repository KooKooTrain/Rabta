import { site } from "@/config/site";
import type { Tone } from "@/config/types";
import { CrossMarker } from "@/components/visuals/CrossMarker";
import { cn } from "@/lib/utils";

const showGrid: boolean = site.flags.showBlueprintGrid;

/**
 * Section wrapper: sets the tone (colours flip via tokens.css), the anchor id
 * and vertical rhythm.
 * - `paper` sections run full-bleed with a dashed top rule and blueprint
 *   guides at the container edges ("+" marks where they meet the rule).
 * - Every other tone is a rounded slab inset from the page edges.
 * Use `overflow-x-clip` (not overflow-hidden) on paper sections so the marks show.
 */
export function Section({
  id,
  tone,
  className,
  innerClassName,
  padded = true,
  guides = true,
  children,
  ...props
}: {
  id: string;
  tone: Tone;
  padded?: boolean;
  guides?: boolean;
  innerClassName?: string;
} & React.ComponentProps<"section">) {
  const slab = tone !== "paper";
  const grid = showGrid && guides && !slab;
  return (
    <section
      id={id}
      data-tone={tone}
      className={cn(
        "relative bg-bg text-fg",
        slab && "mx-[var(--inset)] my-[var(--inset)] overflow-clip rounded-slab border border-edge",
        grid && "border-t border-dashed border-line",
        className,
      )}
      {...props}
    >
      {grid && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block">
          <div className="container-site relative h-full">
            <div className="absolute inset-y-0 start-[var(--gutter)] border-s border-dashed border-line" />
            <div className="absolute inset-y-0 end-[var(--gutter)] border-e border-dashed border-line" />
            <CrossMarker className="absolute -top-[7px] start-[calc(var(--gutter)-7px)] z-10" />
            <CrossMarker className="absolute -top-[7px] end-[calc(var(--gutter)-7px)] z-10" />
          </div>
        </div>
      )}
      <div className={cn("relative", padded && "py-section", innerClassName)}>{children}</div>
    </section>
  );
}
