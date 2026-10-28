import { site } from "@/config/site";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { Pill } from "@/components/ui/Pill";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { T } from "@/components/ui/Text";
import { Donut } from "@/components/visuals/Donut";
import { Sparkline } from "@/components/visuals/Sparkline";
import { plain } from "@/lib/copy";
import type { SectionProps } from "./registry";

const TINTS = ["bg-sage", "bg-blush", "bg-sky", "bg-butter", "bg-sage"] as const;

export function Features({ id, tone, index }: SectionProps) {
  const c = site.content.features;
  const h = c.highlight;
  const first = h.series[0];
  const last = h.series[h.series.length - 1];
  const change = Math.round(((last - first) / (first || 1)) * 100);

  return (
    <Section id={id} tone={tone}>
      <Container>
        <SectionHeading eyebrow={c.eyebrow} heading={c.heading} intro={c.intro} index={index} />

        <div className="mt-12 grid gap-4 md:mt-16 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {/* Highlight tile */}
          <div
            data-reveal=""
            className="relative flex flex-col overflow-hidden rounded-lg border border-line bg-surface p-6 md:col-span-2 md:p-8 lg:row-span-2"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="grid size-10 place-items-center rounded-sm bg-forest text-sage">
                <Icon name={h.icon} className="size-5" />
              </span>
              <Pill dot className="label-mono text-muted">
                Live
              </Pill>
            </div>
            <h3 className="mt-6 max-w-md font-display text-display-lg font-semibold">
              <T c={h.title} />
            </h3>
            <p className="mt-3 max-w-lg text-muted">
              <T c={h.body} />
            </p>

            {/* Chart panel */}
            <div className="mt-8 grid flex-1 gap-4 rounded-md border border-dashed border-line-strong/60 bg-bg/60 p-4 sm:grid-cols-[1fr_auto] sm:p-5">
              <div className="flex min-w-0 flex-col">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="label-mono text-muted">
                    <T c={h.chartLabel} rich={false} />
                  </p>
                  <p className="label-mono text-accent-text">
                    {change >= 0 ? "▲" : "▼"} {Math.abs(change)}% / 12 wks
                  </p>
                </div>
                <p className="mt-2 font-display text-display-lg font-semibold tabular-nums">{last}</p>
                <div className="relative mt-3 flex-1">
                  {/* Gridlines */}
                  <div aria-hidden="true" className="absolute inset-0 flex flex-col justify-between">
                    {[0, 1, 2, 3].map((i) => (
                      <span key={i} className="border-t border-dashed border-line" />
                    ))}
                  </div>
                  <Sparkline
                    series={h.series}
                    height={96}
                    className="relative h-28 text-forest [--spark-fill:var(--color-forest)] md:h-36"
                    label={`${plain(h.chartLabel)}: ${first} to ${last}`}
                  />
                </div>
                <div aria-hidden="true" className="label-mono mt-2 flex justify-between text-subtle">
                  <span>W1</span>
                  <span>W6</span>
                  <span>W12</span>
                </div>
              </div>

              <div className="flex items-center gap-4 border-t border-dashed border-line pt-4 sm:flex-col sm:justify-center sm:border-s sm:border-t-0 sm:ps-5 sm:pt-0">
                <Donut
                  className="w-24 shrink-0 sm:w-28"
                  thickness={16}
                  label="Breakdown: routines 48%, health 32%, connection 20%"
                  segments={[
                    { value: 48, color: "var(--color-forest)" },
                    { value: 32, color: "var(--color-ember)" },
                    { value: 20, color: "var(--color-saffron)" },
                  ]}
                >
                  <span className="font-display text-lg font-semibold">3</span>
                  <span className="label-mono text-[0.625rem] text-muted">areas</span>
                </Donut>
                <ul aria-hidden="true" className="label-mono space-y-1.5 text-muted">
                  {[
                    ["bg-forest", "Routines"],
                    ["bg-ember", "Health"],
                    ["bg-saffron", "Connect"],
                  ].map(([bg, l]) => (
                    <li key={l} className="flex items-center gap-2">
                      <span className={`size-2 rounded-full ${bg}`} />
                      {l}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Feature tiles */}
          {c.items.map((item, i) => (
            <Card
              key={i}
              interactive
              data-reveal=""
              style={{ "--i": i + 1 } as React.CSSProperties}
              className="flex flex-col gap-4"
            >
              <span
                className={`grid size-10 place-items-center rounded-sm text-ink ${TINTS[i % TINTS.length]}`}
              >
                <Icon name={item.icon} className="size-5" />
              </span>
              <h3 className="font-display text-title font-semibold">
                <T c={item.title} />
              </h3>
              <p className="text-muted">
                <T c={item.body} />
              </p>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
