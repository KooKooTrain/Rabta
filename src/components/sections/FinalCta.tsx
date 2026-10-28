import { site } from "@/config/site";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { T } from "@/components/ui/Text";
import { KinTiles } from "@/components/visuals/KinTiles";
import { isLiveHref } from "@/lib/nav";
import type { SectionProps } from "./registry";

export function FinalCta({ id, tone, index }: SectionProps) {
  const c = site.content.cta;
  const secondary = c.secondary && isLiveHref(c.secondary.href) ? c.secondary : undefined;

  return (
    <Section id={id} tone={tone} className="grain overflow-hidden" innerClassName="pb-0">
      <Container className="flex flex-col items-center text-center">
        <div data-reveal="">
          <Eyebrow c={c.eyebrow} index={index} className="justify-center" />
        </div>
        <h2
          data-reveal=""
          style={{ "--i": 1 } as React.CSSProperties}
          className="mt-6 max-w-4xl font-display text-display-2xl font-semibold"
        >
          <T c={c.heading} />
        </h2>
        <p
          data-reveal=""
          style={{ "--i": 2 } as React.CSSProperties}
          className="mt-6 max-w-xl text-lead text-muted"
        >
          <T c={c.body} />
        </p>
        <div
          data-reveal=""
          style={{ "--i": 3 } as React.CSSProperties}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          {isLiveHref(c.primary.href) && <Button link={c.primary} size="lg" />}
          {secondary && <Button link={secondary} variant="secondary" size="lg" />}
        </div>
      </Container>

      {/* Kin Tiles band, bleeding off the bottom edge */}
      <div
        data-reveal=""
        style={{ "--i": 4 } as React.CSSProperties}
        className="mt-16 translate-y-[18%] px-3 md:mt-24 md:px-6"
      >
        <KinTiles cols={6} rows={2} radius={16} className="md:hidden" />
        <KinTiles cols={12} rows={2} radius={16} className="hidden md:block" />
      </div>
    </Section>
  );
}
