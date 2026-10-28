import type { MockRow, MockState } from "@/config/types";
import type { Copy } from "@/lib/copy";
import { PhTag, T } from "@/components/ui/Text";
import { cn } from "@/lib/utils";
import { Glyph } from "./Glyph";
import { Sparkline } from "./Sparkline";

const statusDot: Record<NonNullable<MockRow["status"]>, string> = {
  ok: "bg-forest",
  watch: "bg-ember",
  info: "bg-sky ring-1 ring-forest/40",
};
const statusText: Record<NonNullable<MockRow["status"]>, string> = {
  ok: "Good",
  watch: "Needs attention",
  info: "Info",
};

/**
 * Code-built product preview: looks like a real AI dashboard card.
 * Always renders on light "paper" tokens so it reads on any section tone.
 */
export function ProductMock({
  title,
  subtitle,
  state,
  compact = false,
  className,
}: {
  title: Copy;
  subtitle?: Copy;
  state: MockState;
  compact?: boolean;
  className?: string;
}) {
  return (
    <div
      data-tone="paper"
      className={cn(
        "overflow-hidden rounded-lg border border-line bg-card text-fg",
        compact ? "shadow-hair" : "shadow-lift",
        className,
      )}
    >
      {/* Window chrome */}
      <div className="flex items-center gap-3 border-b border-line bg-paper/60 px-4 py-3">
        <div className="flex shrink-0 gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-blush" />
          <span className="size-2.5 rounded-full bg-butter" />
          <span className="size-2.5 rounded-full bg-sage" />
        </div>
        <p className="label-mono truncate text-subtle">
          <T c={title} rich={false} tag={false} />
        </p>
        {subtitle && !compact && (
          <p className="label-mono ms-auto hidden truncate text-subtle sm:block">
            <T c={subtitle} rich={false} tag={false} />
          </p>
        )}
      </div>

      <div className={cn("grid", compact ? "gap-4 p-4" : "gap-5 p-6 md:p-7")}>
        <div className="flex items-center justify-between gap-3">
          <span className="label-mono inline-flex items-center gap-2 rounded-pill bg-forest px-3 py-1.5 text-paper">
            <span aria-hidden="true" className="live-dot size-1.5 rounded-full bg-saffron" />
            <T c={state.status} rich={false} tag={false} />
          </span>
          <span className="label-mono flex items-center gap-1.5 text-subtle">
            <Glyph name="spark" className="size-3.5" color="var(--color-ember)" />
            AI
          </span>
        </div>

        <p
          className={cn(
            "font-display font-semibold",
            compact ? "text-title" : "text-[clamp(1.5rem,1.2rem+1vw,2.125rem)] leading-[1.1] tracking-[-0.02em]",
          )}
        >
          <T c={state.headline} tag={false} />
          <PhTag c={state.headline} />
        </p>

        <div className="rounded-md border border-line bg-paper/70 px-4 pt-3 pb-2 text-forest">
          <div className="label-mono flex items-center justify-between text-subtle">
            <span>Trend</span>
            <span className="flex items-center gap-1.5">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-saffron" />
              Live
            </span>
          </div>
          <Sparkline series={state.series} height={compact ? 40 : 56} className={cn("mt-2", compact ? "h-10" : "h-14")} />
        </div>

        <ul className="divide-y divide-line">
          {state.rows.map((row, i) => (
            <li key={i} className="flex items-center justify-between gap-4 py-2.5 text-sm">
              <span className="flex min-w-0 items-center gap-2.5">
                {row.status && (
                  <>
                    <span aria-hidden="true" className={cn("size-2 shrink-0 rounded-full", statusDot[row.status])} />
                    <span className="sr-only">{statusText[row.status]}:</span>
                  </>
                )}
                <span className="truncate text-muted">
                  <T c={row.label} rich={false} tag={false} />
                </span>
              </span>
              <span className="shrink-0 font-medium tabular-nums">
                <T c={row.value} rich={false} tag={false} />
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
