import { Plus } from "lucide-react";
import { site } from "@/config/site";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { T } from "@/components/ui/Text";
import type { SectionProps } from "./registry";

/** Native <details> rows: numbered caps questions, + turns to ×. Works without JS. */
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

        <div className="border-t border-fg lg:col-span-8">
          {c.items.map((item, i) => (
            <details
              key={i}
              name="faq"
              data-reveal=""
              style={{ "--i": i } as React.CSSProperties}
              className="faq-item group border-b border-fg"
            >
              <summary className="grid cursor-pointer list-none grid-cols-[2.5rem_1fr_auto] items-start gap-4 py-6 transition-colors duration-[var(--dur-base)] ease-hover hover:bg-fg/[0.04] md:grid-cols-[4rem_1fr_auto] md:py-8 [&::-webkit-details-marker]:hidden">
                <span className="label-mono pt-1.5 text-subtle transition-colors group-open:text-accent-text">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-display-lg">
                  <T c={item.q} />
                </span>
                <span
                  aria-hidden="true"
                  className="grid size-10 shrink-0 place-items-center border border-fg transition-[transform,background-color,color] duration-[var(--dur-slow)] ease-scale group-open:rotate-45 group-open:border-accent group-open:bg-accent group-open:text-accent-fg"
                >
                  <Plus className="size-5" strokeWidth={1.75} />
                </span>
              </summary>
              <div className="grid grid-cols-[2.5rem_1fr] gap-4 pb-8 md:grid-cols-[4rem_1fr]">
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
