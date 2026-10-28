import { cn } from "@/lib/utils";

/**
 * Strip of solid pills (brand / tint alternating) on a dark bar.
 * Decorative; for a text marquee use the Marquee section.
 */
export function PillStrip({
  count = 7,
  className,
  pillClassName,
}: {
  count?: number;
  className?: string;
  pillClassName?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn("flex h-10 items-stretch gap-1.5 bg-surface p-1.5 md:h-12", className)}
    >
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className={cn(
            "min-w-0 flex-1 rounded-pill",
            i % 2 === 0 ? "bg-brand" : "bg-tint",
            i === 0 && "max-w-10",
            pillClassName,
          )}
        />
      ))}
    </div>
  );
}
