import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { T } from "@/components/ui/Text";
import { ProductMock } from "@/components/visuals/ProductMock";
import type { Tone } from "@/config/types";
import { site } from "@/config/site";
import { cn } from "@/lib/utils";
import { HowStack } from "./HowStack";
import type { SectionProps } from "./registry";

/** Card colours in order (Wastetide: 01 red, 02 black, 03 grey). */
const CARD_TONES: Tone[] = ["signal", "night", "panel"];

export function HowItWorks({ id, tone, index }: SectionProps) {
  const c = site.content.how;
  const total = String(c.steps.length).padStart(2, "0");

  return (
    <Section id={id} tone={tone} className="overflow-x-clip">
      <Container>
        <HowStack
          heading={<SectionHeading eyebrow={c.eyebrow} heading={c.heading} intro={c.intro} index={index} size="md" />}
          cards={c.steps.map((step, i) => (
            <article
              key={i}
              data-tone={CARD_TONES[i % CARD_TONES.length]}
              className={cn(
                "grid h-full gap-6 overflow-hidden border border-line bg-bg p-6 text-fg sm:p-8 md:grid-cols-[1fr_minmax(0,17rem)] md:gap-8 lg:p-9",
              )}
            >
              <div className="flex flex-col justify-between gap-8">
                <div className="flex items-start justify-between gap-4">
                  <p className="font-display text-display-lg">{String(i + 1).padStart(2, "0")}</p>
                  <p className="label-mono text-muted">
                    [ {String(i + 1).padStart(2, "0")} / {total} ]
                  </p>
                </div>
                <div>
                  <h3 className="font-display text-[clamp(2.5rem,1rem+3.4vw,4.25rem)] leading-[0.86] tracking-[-0.035em]">
                    <T c={step.verb} />
                  </h3>
                  <p className="font-display text-title mt-4">
                    <T c={step.title} />
                  </p>
                  <p className="mt-3 max-w-md font-mono text-[0.8125rem] leading-relaxed text-muted">
                    <T c={step.body} />
                  </p>
                </div>
              </div>
              <ProductMock title={c.mockTitle} state={step.mock} compact className="self-center" />
            </article>
          ))}
        />
      </Container>
    </Section>
  );
}
