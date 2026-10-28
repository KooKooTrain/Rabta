import { X } from "lucide-react";
import { site } from "@/config/site";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Icon } from "@/components/ui/Icon";
import { T } from "@/components/ui/Text";
import type { SectionProps } from "./registry";

/**
 * Responsible-AI slab. The page background stays paper; the dark slab is a
 * rounded panel carrying the section tone.
 */
export function Trust({ id, tone, index }: SectionProps) {
  const c = site.content.trust;

  return (
    <Section id={id} tone="paper" guides={false} padded={false} className="py-6 md:py-10">
      <Container className="px-3 sm:px-[var(--gutter)]">
        <div
          data-tone={tone}
          className="grain relative overflow-hidden rounded-lg bg-bg px-5 py-14 text-fg sm:px-10 md:rounded-xl md:py-20 lg:px-16 lg:py-24"
        >
          {/* soft glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -end-32 -top-32 size-96 rounded-full bg-forest/60 blur-3xl"
          />

          <div className="relative grid gap-12 lg:grid-cols-12 lg:gap-16">
            <header className="flex flex-col gap-5 lg:col-span-5">
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
              <p
                data-reveal=""
                style={{ "--i": 2 } as React.CSSProperties}
                className="max-w-md text-lead text-muted"
              >
                <T c={c.intro} />
              </p>

              <div
                data-reveal=""
                style={{ "--i": 3 } as React.CSSProperties}
                className="mt-4 rounded-md border border-dashed border-line-strong p-5 md:p-6"
              >
                <p className="label-mono text-accent-text">
                  <T c={c.never.heading} rich={false} />
                </p>
                <ul className="mt-4 space-y-3">
                  {c.never.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border border-line-strong">
                        <X aria-hidden="true" className="size-3" strokeWidth={2.25} />
                      </span>
                      <span>
                        <T c={item} />
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </header>

            <ul className="grid content-start gap-px self-start overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2 lg:col-span-7">
              {c.principles.map((p, i) => (
                <li
                  key={i}
                  data-reveal=""
                  style={{ "--i": i } as React.CSSProperties}
                  className="flex flex-col gap-4 bg-bg p-6 md:p-8"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`grid size-11 place-items-center rounded-sm border border-line ${
                        i % 2 === 0 ? "text-saffron" : "text-ember-soft"
                      }`}
                    >
                      <Icon name={p.icon} className="size-5" />
                    </span>
                    <span className="label-mono text-subtle">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="mt-2 font-display text-title font-semibold">
                    <T c={p.title} />
                  </h3>
                  <p className="text-muted">
                    <T c={p.body} />
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  );
}
