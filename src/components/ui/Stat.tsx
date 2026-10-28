import type { StatItem } from "@/config/types";
import { CountUp } from "@/components/motion/CountUp";
import { cn } from "@/lib/utils";
import { T } from "./Text";

/** Big condensed number + small inline unit + mono label (+ optional source). */
export function Stat({
  stat,
  size = "lg",
  className,
}: {
  stat: StatItem;
  size?: "xl" | "lg" | "md";
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <p
        className={cn(
          "font-display",
          size === "xl" && "text-stat",
          size === "lg" && "text-display-2xl",
          size === "md" && "text-display-xl",
        )}
      >
        <CountUp
          value={stat.value}
          decimals={stat.decimals}
          prefix={stat.prefix}
          suffix={stat.suffix}
        />
        {stat.unit && (
          <span className="ms-2 align-baseline text-[0.3em] tracking-[-0.01em] whitespace-nowrap">
            <T c={stat.unit} rich={false} />
          </span>
        )}
      </p>
      <p className="label-caps max-w-xs leading-relaxed text-muted">
        <T c={stat.label} rich={false} />
      </p>
      {stat.source && (
        <p className="label-caps text-subtle opacity-80">
          <T c={stat.source} rich={false} />
        </p>
      )}
    </div>
  );
}
