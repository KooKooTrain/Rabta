import type { StatItem } from "@/config/types";
import { CountUp } from "@/components/motion/CountUp";
import { cn } from "@/lib/utils";
import { T } from "./Text";

/** Big number + small inline unit + label (+ optional source). */
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
    <div className={cn("flex flex-col gap-3", className)}>
      <p
        className={cn(
          "font-display font-semibold",
          size === "xl" && "text-stat",
          size === "lg" && "text-display-xl",
          size === "md" && "text-display-lg",
        )}
      >
        <CountUp
          value={stat.value}
          decimals={stat.decimals}
          prefix={stat.prefix}
          suffix={stat.suffix}
        />
        {stat.unit && (
          <span className="label-mono ms-2 align-baseline text-muted">
            <T c={stat.unit} rich={false} />
          </span>
        )}
      </p>
      <p className="max-w-xs text-muted">
        <T c={stat.label} />
      </p>
      {stat.source && (
        <p className="label-mono text-subtle">
          <T c={stat.source} rich={false} />
        </p>
      )}
    </div>
  );
}
