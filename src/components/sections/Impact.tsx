import { site } from "@/config/site";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Stat } from "@/components/ui/Stat";
import { T } from "@/components/ui/Text";
import type { SectionProps } from "./registry";

/**
 * "The effect" bento (Wastetide): heading + note on the left; a giant number
 * with a signal tile and a grey tile under it on the right.
 */
export function Impact({ id, tone, index }: SectionProps) {
  const c = site.content.impact;
  const [lead, ...rest] = c.stats;

  return (
    <Section id={id} tone={tone}>
      <Container>
        <div className="grid gap-px border border-line bg-line lg:grid-cols-2">
          <div className="flex flex-col justify-between gap-12 bg-bg p-6 md:p-10">
            <div className="flex flex-col gap-6">
              <div data-reveal="">
                <Eyebrow c={c.eyebrow} index={index} />
              </div>
              <h2 data-reveal="" style={{ "--i": 1 } as React.CSSProperties} className="font-display text-display-2xl">
                <T c={c.heading} />
              </h2>
            </div>
            <p data-reveal="" className="max-w-sm font-mono text-[0.8125rem] leading-relaxed text-muted">
              <T c={c.note} />
            </p>
          </div>

          <div className="grid gap-px bg-line sm:grid-cols-2">
            {lead && (
              <div data-reveal="" className="flex flex-col items-end bg-bg p-6 text-end sm:col-span-2 md:p-10">
                <Stat stat={lead} size="xl" className="items-end" />
              </div>
            )}
            {rest.map((stat, i) => (
              <div
                key={i}
                data-reveal=""
                data-tone={i === 0 ? "signal" : "panel"}
                style={{ "--i": i + 1 } as React.CSSProperties}
                className="flex min-h-64 flex-col justify-end bg-bg p-6 text-fg md:p-8"
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
