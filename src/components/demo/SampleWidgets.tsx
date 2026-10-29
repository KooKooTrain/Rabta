import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { Donut } from "@/components/visuals/Donut";
import { Sparkline } from "@/components/visuals/Sparkline";
import { cn } from "@/lib/utils";

/**
 * Example sports dashboard widgets with illustrative match data.
 */

const fixtures = [
  { label: "Football practice", who: "Noor & Sami · Today 5:30", status: "watch" },
  { label: "Basketball friendly", who: "Omar & Noor · Tomorrow 9:00", status: "ok" },
  { label: "Volleyball family game", who: "Everyone · Saturday 4:00", status: "info" },
  { label: "Al Karabi", who: "Family teams · Sunday 10:00", status: "ok" },
] as const;

const statusDot = {
  ok: "bg-charcoal",
  watch: "bg-brand",
  info: "bg-tint",
} as const;

const statusLabel = { ok: "Ready", watch: "Team setup", info: "Upcoming" } as const;

const split = [
  { label: "Home", value: 52, color: "var(--t-fg)" },
  { label: "Away", value: 48, color: "var(--color-brand)" },
];

export function SampleWidgets() {
  return (
    <section aria-labelledby="widgets-heading" className="flex flex-col gap-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="widgets-heading" className="font-display text-title">
          Game day overview
        </h2>
        <p className="label-caps text-subtle">Family sports</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        {/* 1. Number card */}
        <Card className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="label-caps text-muted">Matches played</p>
            <Icon name="list-checks" className="size-4 text-muted" />
          </div>
          <p className="font-display text-display-xl tabular-nums">
            3<span className="text-muted">/5</span>
          </p>
          <div className="h-1.5 overflow-hidden rounded-pill bg-soft" role="img" aria-label="60 percent of planned matches played">
            <div className="h-full w-3/5 rounded-pill bg-brand" />
          </div>
          <p className="text-sm text-muted">
            <span className="font-medium text-brand-ink">2</span> results saved
          </p>
        </Card>

        {/* 2. List with status dots */}
        <Card className="flex flex-col gap-3 sm:row-span-2 2xl:row-span-1">
          <p className="label-caps text-muted">Upcoming games</p>
          <ul className="divide-y divide-line">
            {fixtures.map((t) => (
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
          <p className="label-caps text-muted">Possession</p>
          <div className="flex items-center gap-5">
            <Donut
              segments={split.map((s) => ({ value: s.value, color: s.color }))}
              className="w-28 shrink-0"
              label="Possession split: Home 52%, Away 48%"
            >
              <span className="font-display text-xl">52%</span>
              <span className="label-caps text-[0.625rem] text-subtle">Home</span>
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
            <p className="label-caps text-muted">Match activity</p>
            <span className="rounded-pill bg-tint px-2 py-0.5 text-xs font-medium text-ink">2 teams</span>
          </div>
          <p className="font-display text-display-lg tabular-nums">78</p>
          <Sparkline
            series={[52, 55, 54, 58, 61, 60, 64, 67, 66, 71, 74, 78]}
            className="h-16 text-brand"
            label="Match activity through the game"
          />
        </Card>
      </div>
    </section>
  );
}
