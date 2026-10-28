import { cn } from "@/lib/utils";

/** "+" registration mark (blueprint grid intersections). Colour: currentColor. */
export function CrossMarker({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 14 14"
      aria-hidden="true"
      className={cn("pointer-events-none size-3.5 text-mark", className)}
    >
      <path d="M7 0v14M0 7h14" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
