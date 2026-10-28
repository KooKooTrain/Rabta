import { site } from "@/config/site";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stat } from "@/components/ui/Stat";
import { T } from "@/components/ui/Text";
import { cn } from "@/lib/utils";
import type { SectionProps } from "./registry";

export function Impact({ id, tone, index }: SectionProps) {
  const c = site.content.impact;
  const cols = c.stats.length >= 4 ? "md:grid-cols-4" : c.stats.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2";

  return (
    <Section id={id} tone={tone}>
      <Container>
        <SectionHeading eyebrow={c.eyebrow} heading={c.heading} index={index} />

        <div
          className={cn(
            "mt-12 grid border-y border-dashed border-line-strong md:mt-16",
            cols,
          )}
        >
          {c.stats.map((s, i) => (
            <div
              key={i}
              data-reveal=""
              style={{ "--i": i } as React.CSSProperties}
              className={cn(
                "py-8 md:px-8 md:py-12 md:first:ps-0",
                i > 0 && "border-t border-dashed border-line-strong md:border-s md:border-t-0",
              )}
            >
              <Stat stat={s} size="lg" />
            </div>
          ))}
        </div>

        <p className="label-mono mt-6 max-w-2xl text-subtle">
          <span aria-hidden="true">* </span>
          <T c={c.note} rich={false} />
        </p>
      </Container>
    </Section>
  );
}
