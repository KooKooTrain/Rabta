import { cn } from "@/lib/utils";

const STEPS = ["#0d1411", "#13221a", "#1e4d33", "#3d6b4a", "#7d9a74", "#b9c4a3", "#e2e2cf", "#f4f3ee"];

/**
 * Horizontal stripes stepping between night and bone; the light stripes get
 * slanted ends (Chande). Use as a transition between sections.
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
    <div aria-hidden="true" className={cn("flex flex-col bg-night", className)}>
      {steps.map((color, i) => {
        const light = STEPS.indexOf(color) >= STEPS.length - 3;
        return (
          <span
            key={i}
            className="block h-[clamp(0.75rem,2.2vw,1.75rem)]"
            style={{
              backgroundColor: color,
              clipPath: light ? "polygon(0 0, 100% 0, calc(100% - 14px) 100%, 14px 100%)" : undefined,
            }}
          />
        );
      })}
    </div>
  );
}
