import { X } from "lucide-react";
import { site } from "@/config/site";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { ScrollScale } from "@/components/motion/ScrollScale";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";
import { T } from "@/components/ui/Text";
import { CrossMarker } from "@/components/visuals/CrossMarker";
import type { SectionProps } from "./registry";

/** Dark slab: giant centred headline that scales in, principles grid, "never" list. */
export function Trust({ id, tone, index }: SectionProps) {
  const c = site.content.trust;

  return (
    <Section id={id} tone={tone} className="overflow-x-clip">
      <Container>
        <div className="flex flex-col items-center gap-6 text-center">
          <div data-reveal="">
            <Eyebrow c={c.eyebrow} index={index} />
          </div>
          <ScrollScale>
            <h2 className="font-display text-display-2xl">
              <T c={c.heading} />
            </h2>
          </ScrollScale>
          <p data-reveal="" className="max-w-xl text-lead text-muted">
            <T c={c.intro} />
          </p>
        </div>

        <div className="relative mt-14 md:mt-20">
          <CrossMarker className="absolute -start-[7px] -top-[7px] z-10 text-lime" />
          <CrossMarker className="absolute -end-[7px] -top-[7px] z-10" />
          <CrossMarker className="absolute -start-[7px] -bottom-[7px] z-10" />
          <CrossMarker className="absolute -end-[7px] -bottom-[7px] z-10 text-lime" />
          <ul className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {c.principles.map((p, i) => (
              <li
                key={i}
                data-reveal=""
                style={{ "--i": i } as React.CSSProperties}
                className="flex min-h-72 flex-col gap-4 bg-bg p-6 md:p-8"
              >
                <div className="flex items-center justify-between">
                  <span className="grid size-11 place-items-center border border-line-strong text-accent-text">
                    <Icon name={p.icon} className="size-5" />
                  </span>
                  <span className="label-mono text-subtle">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="font-display text-title mt-auto pt-8">
                  <T c={p.title} />
                </h3>
                <p className="text-sm text-muted">
                  <T c={p.body} />
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div
          data-reveal=""
          className="mt-px grid gap-6 border border-dashed border-signal-soft p-6 md:grid-cols-[minmax(0,16rem)_1fr] md:items-center md:p-8"
        >
          <p className="label-mono text-signal-soft">
            <T c={c.never.heading} rich={false} />
          </p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {c.never.items.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center bg-signal-soft text-ink">
                  <X aria-hidden="true" className="size-3.5" strokeWidth={2.5} />
                </span>
                <span>
                  <T c={item} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
