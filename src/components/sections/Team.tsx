import { site } from "@/config/site";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { T } from "@/components/ui/Text";
import { Monogram } from "@/components/visuals/Monogram";
import { plain } from "@/lib/copy";
import { cn } from "@/lib/utils";
import type { SectionProps } from "./registry";

export function Team({ id, tone, index }: SectionProps) {
  const c = site.content.team;
  const n = c.members.length;
  const cols = n >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3";

  return (
    <Section id={id} tone={tone}>
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <header className="flex max-w-3xl flex-col gap-5">
            <div data-reveal="">
              <Eyebrow c={c.eyebrow} index={index} />
            </div>
            <h2
              data-reveal=""
              style={{ "--i": 1 } as React.CSSProperties}
              className="font-display text-display-xl font-semibold"
            >
              <T c={c.heading} />
            </h2>
          </header>
          <p
            data-reveal=""
            style={{ "--i": 2 } as React.CSSProperties}
            className="label-mono max-w-sm text-muted lg:text-end"
          >
            <T c={c.intro} rich={false} />
          </p>
        </div>

        <ul className={cn("mt-12 grid gap-4 sm:grid-cols-2 md:mt-16", cols)}>
          {c.members.map((m, i) => (
            <li key={i} data-reveal="" style={{ "--i": i } as React.CSSProperties}>
              <Card interactive className="flex h-full flex-col gap-5 p-4 md:p-5">
                <Monogram name={plain(m.name)} className="max-w-36" />
                <div className="flex flex-col gap-1.5 px-1 pb-1">
                  <p className="label-mono text-accent-text">
                    <T c={m.role} rich={false} />
                  </p>
                  <h3 className="font-display text-title font-semibold">
                    <T c={m.name} />
                  </h3>
                  {m.detail && (
                    <p className="text-sm text-muted">
                      <T c={m.detail} />
                    </p>
                  )}
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
