import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { Donut } from "@/components/visuals/Donut";
import { Sparkline } from "@/components/visuals/Sparkline";
import { cn } from "@/lib/utils";

/**
 * Sample widgets: copy these patterns when building the feature.
 * All values are hard-coded sample data. [PLACEHOLDER]
 */

const tasks = [
  { label: "Pharmacy pickup", who: "Dad · Today 5:30", status: "watch" },
  { label: "Grandma check-in call", who: "Layla · Today 7:00", status: "ok" },
  { label: "School form signed", who: "Mum · Tomorrow", status: "info" },
  { label: "Football kit washed", who: "Sami · Thursday", status: "ok" },
] as const;

const statusDot = {
  ok: "bg-charcoal",
  watch: "bg-brand",
  info: "bg-tint",
} as const;

const statusLabel = { ok: "On track", watch: "Needs attention", info: "Upcoming" } as const;

const split = [
  { label: "Parents", value: 46, color: "var(--t-fg)" },
  { label: "Teens", value: 28, color: "var(--color-brand)" },
  { label: "Grandparents", value: 16, color: "var(--color-tint)" },
  { label: "Kids", value: 10, color: "var(--color-rule-strong)" },
];

export function SampleWidgets() {
  return (
    <section aria-labelledby="widgets-heading" className="flex flex-col gap-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="widgets-heading" className="font-display text-title">
          This week
        </h2>
        <p className="label-caps text-subtle">Sample widgets: copy these patterns</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        {/* 1. Number card */}
        <Card className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="label-caps text-muted">Tasks done</p>
            <Icon name="list-checks" className="size-4 text-muted" />
          </div>
          <p className="font-display text-display-xl tabular-nums">
            18<span className="text-muted">/24</span>
          </p>
          <div className="h-1.5 overflow-hidden rounded-pill bg-soft" role="img" aria-label="75 percent complete">
            <div className="h-full w-3/4 rounded-pill bg-brand" />
          </div>
          <p className="text-sm text-muted">
            <span className="font-medium text-brand-ink">+12%</span> vs last week
          </p>
        </Card>

        {/* 2. List with status dots */}
        <Card className="flex flex-col gap-3 sm:row-span-2 2xl:row-span-1">
          <p className="label-caps text-muted">Up next</p>
          <ul className="divide-y divide-line">
            {tasks.map((t) => (
              <li key={t.label} className="flex items-start gap-3 py-3 first:pt-1 last:pb-0">
                <span
                  className={cn("mt-1.5 size-2 shrink-0 rounded-full", statusDot[t.status])}
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium">{t.label}</p>
                  <p className="text-xs text-subtle">
                    {t.who} · <span>{statusLabel[t.status]}</span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        {/* 3. Donut card */}
        <Card className="flex flex-col gap-4">
          <p className="label-caps text-muted">Who&apos;s carrying the load</p>
          <div className="flex items-center gap-5">
            <Donut
              segments={split.map((s) => ({ value: s.value, color: s.color }))}
              className="w-28 shrink-0"
              label="Share of tasks: parents 46%, teens 28%, grandparents 16%, kids 10%"
            >
              <span className="font-display text-xl">46%</span>
              <span className="label-caps text-[0.625rem] text-subtle">Parents</span>
            </Donut>
            <ul className="flex flex-col gap-1.5 text-sm">
              {split.map((s) => (
                <li key={s.label} className="flex items-center gap-2">
                  <span aria-hidden="true" className="size-2.5 rounded-full" style={{ background: s.color }} />
                  <span className="text-muted">{s.label}</span>
                  <span className="ms-auto ps-2 tabular-nums">{s.value}%</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        {/* 4. Sparkline card */}
        <Card className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="label-caps text-muted">Wellbeing index</p>
            <span className="rounded-pill bg-tint px-2 py-0.5 text-xs font-medium text-ink">↑ 6 pts</span>
          </div>
          <p className="font-display text-display-lg tabular-nums">78</p>
          <Sparkline
            series={[52, 55, 54, 58, 61, 60, 64, 67, 66, 71, 74, 78]}
            className="h-16 text-brand"
            label="Wellbeing index rising from 52 to 78 over 12 weeks"
          />
        </Card>
      </div>
    </section>
  );
}
