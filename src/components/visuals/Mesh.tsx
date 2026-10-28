import { cn } from "@/lib/utils";

/**
 * Soft mesh gradient from the tint tokens. Sits at -z-10, so the parent must
 * create a stacking context (`isolate` or the `grain` utility).
 */
export function Mesh({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 -z-10", className)}
      style={{
        backgroundImage: [
          "radial-gradient(55% 50% at 88% 18%, color-mix(in oklab, var(--color-sage) 75%, transparent), transparent 70%)",
          "radial-gradient(40% 45% at 8% 88%, color-mix(in oklab, var(--color-blush) 70%, transparent), transparent 70%)",
          "radial-gradient(35% 35% at 62% 72%, color-mix(in oklab, var(--color-butter) 55%, transparent), transparent 70%)",
          "radial-gradient(30% 30% at 28% 6%, color-mix(in oklab, var(--color-sky) 55%, transparent), transparent 70%)",
        ].join(", "),
      }}
    />
  );
}
