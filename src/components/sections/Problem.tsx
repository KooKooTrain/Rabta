import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { ScrubWords } from "@/components/motion/ScrubWords";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Stat } from "@/components/ui/Stat";
import { PhTag, T } from "@/components/ui/Text";
import { Words } from "@/components/ui/Words";
import { site } from "@/config/site";
import { plain } from "@/lib/copy";
import type { SectionProps } from "./registry";

/**
 * 1. Pinned manifesto whose words fill from faded to ink (Wastetide).
 * 2. Stat bento: a rounded heading tile, then paper / brand / charcoal stat tiles.
 */
export function Problem({ id, tone, index }: SectionProps) {
  const c = site.content.problem;
  const [lead, ...rest] = c.stats;

  return (
    <Section id={id} tone={tone} padded={false} className="overflow-x-clip">
      <Container>
        <ScrubWords pin className="flex min-h-[70svh] flex-col justify-center py-section">
          <Eyebrow c={c.eyebrow} index={index} />
          <p className="font-display text-display-xl mt-8 max-w-[22ch] text-fg">
            <Words text={plain(c.manifesto)} />
            <PhTag c={c.manifesto} />
          </p>
        </ScrubWords>

        <div className="mb-section grid gap-3">
          <div data-tone="panel" className="grid gap-8 rounded-card bg-bg p-6 text-fg md:grid-cols-2 md:items-end md:p-10">
            <h2 data-reveal="" className="font-display text-display-xl">
              <T c={c.heading} />
            </h2>
            <p data-reveal="" className="max-w-md text-[0.9375rem] leading-relaxed text-muted md:justify-self-end">
              <T c={c.statement} />
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {[lead, ...rest].filter(Boolean).map((stat, i) => (
              <div
                key={i}
                data-reveal=""
                data-tone={(["panel", "brand", "charcoal"] as const)[i % 3]}
                style={{ "--i": i } as React.CSSProperties}
                className="flex min-h-72 flex-col justify-end rounded-card border border-edge bg-bg p-6 text-fg md:p-8"
              >
                <Stat stat={stat} size="md" />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
