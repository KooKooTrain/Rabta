import { Plus } from "lucide-react";
import { site } from "@/config/site";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { T } from "@/components/ui/Text";
import type { SectionProps } from "./registry";

/** Native <details> accordion: works without JS, smooth where supported (globals.css). */
export function Faq({ id, tone, index }: SectionProps) {
  const c = site.content.faq;

  return (
    <Section id={id} tone={tone}>
      <Container className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionHeading
            eyebrow={c.eyebrow}
            heading={c.heading}
            index={index}
            className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]"
          />
        </div>

        <div className="border-t border-line-strong lg:col-span-7">
          {c.items.map((item, i) => (
            <details
              key={i}
              name="faq"
              data-reveal=""
              style={{ "--i": i } as React.CSSProperties}
              className="faq-item group border-b border-line-strong"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 font-display text-title font-semibold transition-colors duration-[var(--dur-base)] ease-hover hover:text-accent-text md:py-7 [&::-webkit-details-marker]:hidden">
                <span>
                  <T c={item.q} />
                </span>
                <span
                  aria-hidden="true"
                  className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full border border-line-strong transition-[transform,background-color,color] duration-[var(--dur-slow)] ease-out-soft group-open:rotate-45 group-open:bg-fg group-open:text-bg"
                >
                  <Plus className="size-4" strokeWidth={2} />
                </span>
              </summary>
              <div className="pe-12 pb-7 text-muted">
                <p className="max-w-xl">
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
