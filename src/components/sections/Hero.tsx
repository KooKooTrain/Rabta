import { ArrowDown } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { LiveClock } from "@/components/motion/LiveClock";
import { Button } from "@/components/ui/Button";
import { PhTag, T, renderInline } from "@/components/ui/Text";
import { PhotoShards } from "@/components/visuals/PhotoShards";
import { site } from "@/config/site";
import { plain } from "@/lib/copy";
import { enabledSections, isLiveHref } from "@/lib/nav";
import type { SectionProps } from "./registry";

const cssVars = (v: Record<string, string | number>) => v as React.CSSProperties;

/**
 * Wastetide-style hero: giant caps headline with a Chande inline pill, a band
 * of sliced photos, and a three-part bottom bar. The load sequence is pure CSS
 * (runs before hydration): lines rise, shards drop, bar fades up.
 */
export function Hero({ id, tone }: SectionProps) {
  const c = site.content.hero;
  const lines = plain(c.headline).split("\n");
  const ctas = [c.primaryCta, c.secondaryCta].filter((l) => isLiveHref(l.href));
  const pos = enabledSections.findIndex((s) => s.id === id);
  const next = enabledSections[pos + 1];

  return (
    <Section
      id={id}
      tone={tone}
      padded={false}
      guides={false}
      className="overflow-x-clip"
      innerClassName="flex flex-col lg:min-h-[calc(100svh-var(--header-h))]"
    >
      <Container className="pt-5 md:pt-7">
        <div
          className="fade-up label-caps flex items-center justify-between gap-4 text-muted"
          style={cssVars({ "--delay": "0ms" })}
        >
          <p className="flex items-center gap-2">
            <span aria-hidden="true" className="live-dot size-1.5 rounded-full bg-brand" />
            <T c={c.eyebrow} rich={false} />
          </p>
          <p className="hidden sm:block">[ {site.competition.date} ]</p>
        </div>

        <h1 className="font-display text-display-hero mt-4 md:mt-6">
          {lines.map((line, i) => (
            <span key={i} className="rise-line" style={cssVars({ "--i": i })}>
              <span>
                {renderInline(line)}
                {i === 0 && (
                  <span
                    aria-hidden="true"
                    className="ms-[0.12em] inline-flex h-[0.62em] w-[1.5em] translate-y-[-0.06em] items-center justify-end rounded-pill border-[0.07em] border-brand p-[0.06em] align-middle"
                  >
                    <span className="block aspect-square h-full rounded-full bg-brand" />
                  </span>
                )}
                {i === lines.length - 1 && <PhTag c={c.headline} />}
              </span>
            </span>
          ))}
        </h1>
      </Container>

      {/* Sliced photo band */}
      <div className="relative mt-6 flex h-[clamp(13rem,36vw,30rem)] flex-col md:mt-8 lg:h-auto lg:min-h-[15rem] lg:flex-1">
        <PhotoShards photos={site.media.hero} preload className="min-h-0 flex-1 px-[2%]" />

        {/* Floating AI insight */}
        <div
          data-tone="paper"
          className="pop-in absolute end-[var(--gutter)] -bottom-6 z-10 hidden max-w-[19rem] overflow-hidden rounded-tile border border-line bg-surface text-fg shadow-lift sm:block"
          style={cssVars({ "--delay": "1300ms" })}
        >
          <p className="label-caps flex items-center gap-2 bg-fg px-4 py-2 text-bg">
            <span aria-hidden="true" className="live-dot size-1.5 rounded-full bg-brand" />
            <T c={c.insight.label} rich={false} tag={false} />
          </p>
          <div className="p-4">
            <p className="font-display text-[1.375rem] leading-none tracking-[-0.02em]">
              <T c={c.insight.title} tag={false} />
            </p>
            <p className="mt-1.5 text-sm text-muted">
              <T c={c.insight.detail} />
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <Container
        className="fade-up mt-10 grid grid-cols-1 items-center gap-6 border-t border-dashed border-line py-6 md:mt-12 md:grid-cols-[1fr_auto_1fr]"
        style={cssVars({ "--delay": "900ms" })}
      >
        <p className="max-w-md text-[0.9375rem] leading-relaxed text-muted">
          <T c={c.lead} />
        </p>
        {ctas.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 md:justify-center">
            {ctas.map((link, i) => (
              <Button key={link.href} link={link} size="lg" variant={i === 0 ? "primary" : "secondary"} />
            ))}
          </div>
        )}
        <div className="label-caps flex items-center justify-between gap-4 text-muted md:justify-end">
          <p className="flex items-center gap-2 md:hidden xl:flex">
            <LiveClock timeZone={c.bottomBar.timeZone} className="text-fg" />
            {c.bottomBar.clockLabel}
          </p>
          {next && (
            <a
              href={`#${next.id}`}
              className="group inline-flex items-center gap-2 transition-colors duration-[var(--dur-base)] ease-hover hover:text-fg"
            >
              {c.bottomBar.scrollHint}
              <ArrowDown aria-hidden="true" className="size-3.5 motion-safe:animate-bounce" />
            </a>
          )}
        </div>
      </Container>
    </Section>
  );
}
