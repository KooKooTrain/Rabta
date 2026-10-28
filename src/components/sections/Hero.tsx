import { ArrowDown } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { LiveClock } from "@/components/motion/LiveClock";
import { Button } from "@/components/ui/Button";
import { Pill } from "@/components/ui/Pill";
import { PhTag, T, renderInline } from "@/components/ui/Text";
import { Glyph } from "@/components/visuals/Glyph";
import { KinTilesLive } from "@/components/visuals/KinTilesLive";
import { Mesh } from "@/components/visuals/Mesh";
import { site } from "@/config/site";
import { plain } from "@/lib/copy";
import { enabledSections, isLiveHref } from "@/lib/nav";
import type { SectionProps } from "./registry";

const cssVars = (v: Record<string, string | number>) => v as React.CSSProperties;

export function Hero({ id, tone }: SectionProps) {
  const c = site.content.hero;
  const lines = plain(c.headline).split("\n");
  const ctas = [c.primaryCta, c.secondaryCta].filter((l) => isLiveHref(l.href));
  const pos = enabledSections.findIndex((s) => s.id === id);
  const next = enabledSections[pos + 1];

  return (
    <Section id={id} tone={tone} padded={false} className="grain overflow-hidden">
      <Mesh />
      <Container className="flex flex-col pt-10 md:pt-14 lg:min-h-[calc(100svh-var(--header-h))] lg:pt-16">
        <div className="grid flex-1 grid-cols-1 items-center gap-14 pb-16 lg:grid-cols-12 lg:gap-8 lg:pb-14">
          {/* Copy */}
          <div className="min-w-0 lg:col-span-7">
            <div className="fade-up" style={cssVars({ "--delay": "0ms" })}>
              <Pill dot className="label-mono max-w-full bg-surface/70 py-1.5 whitespace-normal backdrop-blur-sm">
                <T c={c.eyebrow} rich={false} />
              </Pill>
            </div>

            <h1 className="font-display text-display-2xl mt-7 font-semibold">
              {lines.map((line, i) => (
                <span key={i} className="rise-line" style={cssVars({ "--i": i })}>
                  <span>
                    {renderInline(line)}
                    {i === lines.length - 1 && <PhTag c={c.headline} />}
                  </span>
                </span>
              ))}
            </h1>

            <p
              className="fade-up mt-7 max-w-xl text-lead text-muted"
              style={cssVars({ "--delay": "350ms" })}
            >
              <T c={c.lead} />
            </p>

            {ctas.length > 0 && (
              <div
                className="fade-up mt-9 flex flex-wrap items-center gap-3"
                style={cssVars({ "--delay": "450ms" })}
              >
                {ctas.map((link, i) => (
                  <Button
                    key={link.href}
                    link={link}
                    size="lg"
                    variant={i === 0 ? "primary" : "secondary"}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Visual */}
          <div className="min-w-0 lg:col-span-5">
            <div className="relative mx-auto w-full max-w-[22rem] sm:max-w-sm lg:max-w-[30rem]">
              <p className="label-mono mb-3 flex items-center justify-between text-subtle">
                <span>[ fig. 01 ]</span>
                <span>Family signals</span>
              </p>
              <div className="rounded-xl border border-line bg-surface/60 p-3 shadow-hair backdrop-blur-sm sm:p-4">
                <KinTilesLive cols={4} rows={4} seed={site.brand.seed} animateIn />
              </div>

              {/* Floating AI insight chip */}
              <div
                data-tone="paper"
                className="pop-in absolute -bottom-8 start-3 flex max-w-[16.5rem] items-start gap-3 rounded-md border border-line bg-card p-3.5 text-fg shadow-lift sm:-start-8 lg:-start-12"
                style={cssVars({ "--delay": "900ms" })}
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-saffron">
                  <Glyph name="spark" className="size-6" color="var(--color-ink)" />
                </span>
                <span className="min-w-0">
                  <span className="label-mono flex items-center gap-1.5 text-subtle">
                    <span aria-hidden="true" className="live-dot size-1.5 rounded-full bg-ember" />
                    <T c={c.insight.label} rich={false} tag={false} />
                  </span>
                  <span className="font-display mt-1 block text-[1.0625rem] leading-tight font-semibold">
                    <T c={c.insight.title} tag={false} />
                  </span>
                  <span className="mt-0.5 block text-sm text-muted">
                    <T c={c.insight.detail} />
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="label-mono mt-6 flex items-center justify-between gap-4 border-t border-dashed border-line py-5 text-muted lg:mt-0">
          <p className="flex items-center gap-2">
            <span aria-hidden="true" className="live-dot size-1.5 rounded-full bg-ember" />
            <LiveClock timeZone={c.bottomBar.timeZone} className="text-fg" />
            <span>{c.bottomBar.clockLabel}</span>
          </p>
          <p className="hidden text-center md:block">
            <T c={c.bottomBar.tagline} rich={false} />
          </p>
          {next ? (
            <a
              href={`#${next.id}`}
              className="group inline-flex items-center gap-2 rounded-sm transition-colors duration-[var(--dur-base)] ease-hover hover:text-fg"
            >
              {c.bottomBar.scrollHint}
              <ArrowDown aria-hidden="true" className="size-3.5 motion-safe:animate-bounce" />
            </a>
          ) : (
            <span />
          )}
        </div>
      </Container>
    </Section>
  );
}
