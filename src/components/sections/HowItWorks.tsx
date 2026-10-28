import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { T } from "@/components/ui/Text";
import { ProductMock } from "@/components/visuals/ProductMock";
import { site } from "@/config/site";
import { HowSticky } from "./HowSticky";
import type { SectionProps } from "./registry";

export function HowItWorks({ id, tone, index }: SectionProps) {
  const c = site.content.how;
  const total = String(c.steps.length).padStart(2, "0");

  return (
    <Section id={id} tone={tone}>
      <Container>
        <SectionHeading eyebrow={c.eyebrow} heading={c.heading} intro={c.intro} index={index} />

        <HowSticky
          mocks={c.steps.map((step, i) => (
            <ProductMock key={i} title={c.mockTitle} subtitle={c.mockSubtitle} state={step.mock} />
          ))}
        >
          {c.steps.map((step, i) => (
            <article
              key={i}
              data-step={i}
              className="rounded-lg border border-line bg-surface p-6 sm:p-8 lg:flex lg:min-h-[70vh] lg:flex-col lg:justify-center lg:rounded-none lg:border-0 lg:border-t lg:border-dashed lg:bg-transparent lg:px-0 lg:py-14"
            >
              <p className="label-mono text-subtle">
                <span className="text-accent-text">{String(i + 1).padStart(2, "0")}</span> / {total}
              </p>
              <h3 className="font-display text-display-xl mt-4 font-semibold text-accent-text">
                <T c={step.verb} />
              </h3>
              <p className="font-display text-title mt-4 font-semibold">
                <T c={step.title} />
              </p>
              <p className="mt-3 max-w-md text-muted">
                <T c={step.body} />
              </p>
              <div className="mt-7 lg:hidden">
                <ProductMock title={c.mockTitle} state={step.mock} compact />
              </div>
            </article>
          ))}
        </HowSticky>
      </Container>
    </Section>
  );
}
