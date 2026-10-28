import { Plus } from "lucide-react";
import { site } from "@/config/site";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { T } from "@/components/ui/Text";
import type { SectionProps } from "./registry";

/** Native <details> as rounded rows: numbered caps questions, + turns to ×. Works without JS. */
export function Faq({ id, tone, index }: SectionProps) {
  const c = site.content.faq;

  return (
    <Section id={id} tone={tone}>
      <Container className="grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <SectionHeading
            eyebrow={c.eyebrow}
            heading={c.heading}
            index={index}
            className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]"
          />
        </div>

        <div className="flex flex-col gap-3 lg:col-span-8">
          {c.items.map((item, i) => (
            <details
              key={i}
              name="faq"
              data-reveal=""
              style={{ "--i": i } as React.CSSProperties}
              className="faq-item group rounded-tile border border-line bg-surface transition-colors duration-[var(--dur-base)] ease-hover open:border-line-strong"
            >
              <summary className="grid cursor-pointer list-none grid-cols-[2rem_1fr_auto] items-center gap-4 rounded-tile px-5 py-5 transition-colors duration-[var(--dur-base)] ease-hover hover:bg-fg/[0.04] md:grid-cols-[3.5rem_1fr_auto] md:px-7 md:py-6 [&::-webkit-details-marker]:hidden">
                <span className="label-mono text-subtle transition-colors group-open:text-accent-text">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-display-lg">
                  <T c={item.q} />
                </span>
                <span
                  aria-hidden="true"
                  className="grid size-10 shrink-0 place-items-center rounded-full border border-line-strong transition-[transform,background-color,color,border-color] duration-[var(--dur-slow)] ease-scale group-open:rotate-45 group-open:border-accent group-open:bg-accent group-open:text-accent-fg"
                >
                  <Plus className="size-5" strokeWidth={1.75} />
                </span>
              </summary>
              <div className="grid grid-cols-[2rem_1fr] gap-4 px-5 pb-7 md:grid-cols-[3.5rem_1fr] md:px-7">
                <span />
                <p className="max-w-xl pe-14 text-muted">
                  <T c={item.a} />
                </p>
              </div>
            </details>
          ))}
        </div>
      </Container>
    </Section>
  );
}
