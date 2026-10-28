import { cn } from "@/lib/utils";

const STEPS = ["#141110", "#1b1a22", "#1e2340", "#22307a", "#2f47c8", "#6f86ff", "#c9d4ff", "#eef1ff"];

/**
 * Horizontal stripes stepping between coal, cobalt and pale blue; the light
 * stripes get slanted, rounded-off ends. Use as a transition between sections.
 */
export function StripeBand({
  direction = "dark-to-light",
  className,
}: {
  direction?: "dark-to-light" | "light-to-dark";
  className?: string;
}) {
  const steps = direction === "dark-to-light" ? STEPS : [...STEPS].reverse();
  return (
    <div aria-hidden="true" className={cn("flex flex-col", className)}>
      {steps.map((color, i) => {
        const light = STEPS.indexOf(color) >= STEPS.length - 3;
        return (
          <span
            key={i}
            className="block h-[clamp(0.75rem,2.2vw,1.75rem)]"
            style={{
              backgroundColor: color,
              clipPath: light ? "polygon(0 0, 100% 0, calc(100% - 14px) 100%, 14px 100%)" : undefined,
              borderRadius: light ? "0 0 999px 999px" : undefined,
            }}
          />
        );
      })}
    </div>
  );
}
