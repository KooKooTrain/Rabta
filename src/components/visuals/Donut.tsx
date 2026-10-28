import { cn } from "@/lib/utils";

export interface DonutSegment {
  value: number;
  /** Any CSS colour, e.g. "var(--color-forest)" */
  color: string;
  label?: string;
}

/** Segmented donut chart with gaps; optional centre content via children. */
export function Donut({
  segments,
  className,
  thickness = 14,
  gap = 2.5,
  label,
  children,
}: {
  segments: DonutSegment[];
  className?: string;
  thickness?: number;
  /** gap between segments, in % of circumference */
  gap?: number;
  label?: string;
  children?: React.ReactNode;
}) {
  const r = 50 - thickness / 2;
  const C = 2 * Math.PI * r;
  const total = segments.reduce((a, s) => a + s.value, 0) || 1;
  // Start position of each segment along the circumference
  const starts = segments.map((_, i) =>
    segments.slice(0, i).reduce((a, s) => a + (s.value / total) * C, 0),
  );

  return (
    <div className={cn("relative aspect-square", className)}>
      <svg
        viewBox="0 0 100 100"
        className="size-full -rotate-90"
        role={label ? "img" : undefined}
        aria-label={label}
        aria-hidden={label ? undefined : true}
      >
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--t-line)" strokeWidth={thickness} />
        {segments.map((s, i) => {
          const len = Math.max((s.value / total) * C - (gap / 100) * C, 0);
          return (
            <circle
              key={i}
              cx="50"
              cy="50"
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth={thickness}
              strokeDasharray={`${len} ${C - len}`}
              strokeDashoffset={-starts[i]}
              strokeLinecap="butt"
            />
          );
        })}
      </svg>
      {children && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          {children}
        </div>
      )}
    </div>
  );
}
