import type { MockRow, MockState } from "@/config/types";
import type { Copy } from "@/lib/copy";
import { PhTag, T } from "@/components/ui/Text";
import { cn } from "@/lib/utils";
import { Glyph } from "./Glyph";
import { Sparkline } from "./Sparkline";

const statusDot: Record<NonNullable<MockRow["status"]>, string> = {
  ok: "bg-ink",
  watch: "bg-ember",
  info: "bg-rule-strong",
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
        "overflow-hidden border border-ink bg-card text-fg",
        !compact && "shadow-lift",
        className,
      )}
    >
      {/* Window chrome */}
      <div className="flex items-center gap-3 border-b border-ink bg-ink px-4 py-2.5 text-paper">
        <div className="flex shrink-0 gap-1.5" aria-hidden="true">
          <span className="size-2.5 bg-signal" />
          <span className="size-2.5 bg-rule-strong" />
          <span className="size-2.5 bg-ink" />
        </div>
        <p className="label-mono truncate">
          <T c={title} rich={false} tag={false} />
        </p>
        {subtitle && !compact && (
          <p className="label-mono ms-auto hidden truncate opacity-70 sm:block">
            <T c={subtitle} rich={false} tag={false} />
          </p>
        )}
      </div>

      <div className={cn("grid", compact ? "gap-4 p-4" : "gap-5 p-6 md:p-7")}>
        <div className="flex items-center justify-between gap-3">
          <span className="label-mono inline-flex items-center gap-2 bg-signal px-2.5 py-1 text-ink">
            <span aria-hidden="true" className="live-dot size-1.5 bg-ink" />
            <T c={state.status} rich={false} tag={false} />
          </span>
          <span className="label-mono flex items-center gap-1.5 text-subtle">
            <Glyph name="spark" className="size-3.5" color="var(--color-ember)" />
            AI
          </span>
        </div>

        <p
          className={cn(
            "font-display",
            compact ? "text-title" : "text-display-lg",
          )}
        >
          <T c={state.headline} tag={false} />
          <PhTag c={state.headline} />
        </p>

        <div className="border border-dashed border-line-strong bg-paper px-4 pt-3 pb-2 text-ink">
          <div className="label-mono flex items-center justify-between text-subtle">
            <span>Trend</span>
            <span className="flex items-center gap-1.5">
              <span aria-hidden="true" className="size-1.5 bg-signal" />
              Live
            </span>
          </div>
          <Sparkline series={state.series} height={compact ? 40 : 56} className={cn("mt-2 text-signal", compact ? "h-10" : "h-14")} />
        </div>

        <ul className="divide-y divide-line">
          {state.rows.map((row, i) => (
            <li key={i} className="flex items-center justify-between gap-4 py-2.5 text-sm">
              <span className="flex min-w-0 items-center gap-2.5">
                {row.status && (
                  <>
                    <span aria-hidden="true" className={cn("size-2 shrink-0", statusDot[row.status])} />
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
