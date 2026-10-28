import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stat } from "@/components/ui/Stat";
import { PhTag, renderInline } from "@/components/ui/Text";
import { KinTiles } from "@/components/visuals/KinTiles";
import { site } from "@/config/site";
import { plain } from "@/lib/copy";
import { cn } from "@/lib/utils";
import type { SectionProps } from "./registry";

const tints = ["bg-sage", "bg-blush", "bg-sky", "bg-butter"];

export function Problem({ id, tone, index }: SectionProps) {
  const c = site.content.problem;
  const [lead, ...rest] = c.stats;
  // Keep *emphasis* groups together; each word fills in on scroll
  const words = plain(c.statement).match(/\*[^*]+\*|\S+/g) ?? [];

  return (
    <Section id={id} tone={tone}>
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <SectionHeading
            eyebrow={c.eyebrow}
            heading={c.heading}
            index={index}
            className="lg:col-span-6"
          />
          <p
            data-reveal=""
            className="scroll-fill font-display text-[clamp(1.375rem,1.1rem+1.1vw,2rem)] leading-[1.3] font-medium tracking-[-0.015em] lg:col-span-6 lg:pt-12"
          >
            {words.map((w, i) => (
              <span key={i}>
                <span className="w">{renderInline(w)}</span>{" "}
              </span>
            ))}
            <PhTag c={c.statement} />
          </p>
        </div>

        {lead && (
          <div className="mt-14 grid gap-4 md:grid-cols-3 lg:mt-20">
            <Card
              data-reveal=""
              className={cn(
                "flex flex-col justify-between gap-10 p-7 md:col-span-2 md:p-10",
                rest.length > 0 && "md:row-span-2",
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <p className="label-mono text-subtle">[ Key figure ]</p>
                <span aria-hidden="true" className="live-dot size-2 rounded-full bg-ember" />
              </div>
              <Stat stat={lead} size="xl" />
              <KinTiles cols={10} rows={1} spark={false} radius={18} className="opacity-90" />
            </Card>
            {rest.map((stat, i) => (
              <div
                key={i}
                data-reveal=""
                data-tone="paper"
                style={{ "--i": i + 1 } as React.CSSProperties}
                className={cn("rounded-md p-7 text-ink", tints[i % tints.length])}
              >
                <Stat stat={stat} size="md" />
              </div>
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
