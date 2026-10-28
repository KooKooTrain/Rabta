import { site } from "@/config/site";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Icon } from "@/components/ui/Icon";
import { Pill } from "@/components/ui/Pill";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { T } from "@/components/ui/Text";
import { Sparkline } from "@/components/visuals/Sparkline";
import { plain } from "@/lib/copy";
import { cn } from "@/lib/utils";
import type { SectionProps } from "./registry";

/** Rounded bento: one large live-chart tile + icon tiles that fill ember on hover. */
export function Features({ id, tone, index }: SectionProps) {
  const c = site.content.features;
  const h = c.highlight;
  const first = h.series[0];
  const last = h.series[h.series.length - 1];
  const change = Math.round(((last - first) / (first || 1)) * 100);
  // Stretch the last tile so the grid never ends with empty cells
  // (lg: highlight fills 2×2 next to 4 tiles, then rows of 4; md: rows of 2)
  const n = c.items.length;
  const lgRem = n > 4 ? (n - 4) % 4 : 0;
  const lastSpan = cn(
    n % 2 === 1 && "md:col-span-2",
    lgRem === 0 ? "lg:col-span-1" : ({ 1: "lg:col-span-4", 2: "lg:col-span-3", 3: "lg:col-span-2" } as const)[lgRem],
  );

  return (
    <Section id={id} tone={tone}>
      <Container>
        <SectionHeading
          eyebrow={c.eyebrow}
          heading={c.heading}
          intro={c.intro}
          index={index}
          align="center"
          size="2xl"
        />

        <div className="mt-12 grid gap-3 md:mt-16 md:grid-cols-2 lg:grid-cols-4">
          {/* Highlight tile */}
          <div
            data-reveal=""
            data-tone="charcoal"
            className="relative flex flex-col rounded-card border border-edge bg-bg p-6 text-fg md:col-span-2 md:p-8 lg:row-span-2"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="grid size-11 place-items-center rounded-full bg-accent text-accent-fg">
                <Icon name={h.icon} className="size-5" />
              </span>
              <Pill dot className="label-mono text-muted">
                Live
              </Pill>
            </div>
            <h3 className="font-display text-display-lg mt-8 max-w-md">
              <T c={h.title} />
            </h3>
            <p className="mt-3 max-w-lg font-mono text-[0.8125rem] leading-relaxed text-muted">
              <T c={h.body} />
            </p>

            <div className="mt-auto pt-10">
              <div className="flex flex-wrap items-end justify-between gap-2 border-b border-dashed border-line pb-3">
                <div>
                  <p className="label-mono text-muted">
                    <T c={h.chartLabel} rich={false} />
                  </p>
                  <p className="font-display text-display-xl mt-2 tabular-nums">{last}</p>
                </div>
                <p className="label-mono text-accent-text">
                  {change >= 0 ? "▲" : "▼"} {Math.abs(change)}% / 12 wks
                </p>
              </div>
              <Sparkline
                series={h.series}
                height={96}
                className="mt-4 h-28 text-accent-text [--spark-fill:var(--t-accent-text)] md:h-36"
                label={`${plain(h.chartLabel)}: ${first} to ${last}`}
              />
              <div aria-hidden="true" className="label-mono mt-2 flex justify-between text-subtle">
                <span>W1</span>
                <span>W6</span>
                <span>W12</span>
              </div>
            </div>
          </div>

          {/* Feature tiles */}
          {c.items.map((item, i) => (
            <div
              key={i}
              data-reveal=""
              style={{ "--i": i + 1 } as React.CSSProperties}
              className={cn(
                "wipe-tile group flex min-h-60 flex-col rounded-tile bg-surface p-6 text-fg transition-colors duration-[var(--dur-wipe)] ease-wipe hover:text-ink md:p-7",
                i === c.items.length - 1 && lastSpan,
              )}
            >
              <div className="flex items-start justify-between">
                <span className="grid size-11 place-items-center rounded-full border border-current">
                  <Icon name={item.icon} className="size-5" />
                </span>
                <span className="label-mono text-muted transition-colors duration-[var(--dur-wipe)] group-hover:text-ink">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="font-display text-title mt-auto pt-10">
                <T c={item.title} />
              </h3>
              <p className="mt-2 text-sm text-muted transition-colors duration-[var(--dur-wipe)] group-hover:text-ink">
                <T c={item.body} />
              </p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
