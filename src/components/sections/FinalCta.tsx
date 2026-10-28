import { site } from "@/config/site";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { T } from "@/components/ui/Text";
import { PixelField } from "@/components/visuals/PixelField";
import { StripeBand } from "@/components/visuals/StripeBand";
import { isLiveHref } from "@/lib/nav";
import type { SectionProps } from "./registry";

/** Closing slab: giant stacked headline + a rippling pixel "flag", then stripes into the footer. */
export function FinalCta({ id, tone, index }: SectionProps) {
  const c = site.content.cta;
  const secondary = c.secondary && isLiveHref(c.secondary.href) ? c.secondary : undefined;

  return (
    <Section id={id} tone={tone} guides={false} padded={false} className="overflow-x-clip">
      <Container className="grid items-center gap-12 py-section lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <div data-reveal="">
            <Eyebrow c={c.eyebrow} index={index} />
          </div>
          <h2 data-reveal="" style={{ "--i": 1 } as React.CSSProperties} className="font-display text-display-2xl mt-6">
            <T c={c.heading} />
          </h2>
          <p data-reveal="" style={{ "--i": 2 } as React.CSSProperties} className="mt-6 max-w-md text-[0.9375rem] leading-relaxed text-muted">
            <T c={c.body} />
          </p>
          <div data-reveal="" style={{ "--i": 3 } as React.CSSProperties} className="mt-10 flex flex-wrap items-center gap-2">
            {isLiveHref(c.primary.href) && <Button link={c.primary} size="lg" />}
            {secondary && <Button link={secondary} variant="secondary" size="lg" />}
          </div>
        </div>

        <div data-reveal="" style={{ "--i": 2 } as React.CSSProperties} className="lg:col-span-5 [perspective:900px]">
          <div className="flex items-stretch [transform:rotateY(-16deg)_rotateZ(-3deg)]">
            <span aria-hidden="true" className="me-1.5 w-2 shrink-0 rounded-full bg-ink" />
            <PixelField
              palette="brand"
              direction="radial"
              cell={20}
              wave={0.32}
              speed={1.6}
              noise={0.12}
              className="aspect-[4/3] flex-1 rounded-tile"
            />
          </div>
        </div>
      </Container>
      <StripeBand direction="light-to-dark" />
    </Section>
  );
}
