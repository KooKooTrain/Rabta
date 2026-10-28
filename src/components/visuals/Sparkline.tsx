import { cn } from "@/lib/utils";

/**
 * Smooth line chart from any number series. Scales to its container width;
 * colours come from currentColor (line) and --spark-fill (area).
 */
export function Sparkline({
  series,
  className,
  height = 64,
  area = true,
  dot = true,
  label,
}: {
  series: number[];
  className?: string;
  /** viewBox height; width is fixed at 240 and scales responsively. */
  height?: number;
  area?: boolean;
  dot?: boolean;
  label?: string;
}) {
  const W = 240;
  const H = height;
  const pad = 6;
  const min = Math.min(...series);
  const max = Math.max(...series);
  const span = max - min || 1;
  const pts = series.map((v, i) => [
    pad + (i / Math.max(series.length - 1, 1)) * (W - pad * 2),
    pad + (1 - (v - min) / span) * (H - pad * 2),
  ]);

  // Catmull-Rom → cubic Bézier for a soft curve
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  const last = pts[pts.length - 1];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className={cn("block w-full overflow-visible", className)}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {area && (
        <path
          d={`${d} L${last[0]},${H} L${pts[0][0]},${H} Z`}
          fill="var(--spark-fill, currentColor)"
          opacity={0.14}
        />
      )}
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      {dot && (
        <circle
          cx={last[0]}
          cy={last[1]}
          r={4}
          fill="var(--color-saffron)"
          stroke="currentColor"
          strokeWidth={1.5}
          vectorEffect="non-scaling-stroke"
        />
      )}
    </svg>
  );
}
