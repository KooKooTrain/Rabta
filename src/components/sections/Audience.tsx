import { Section } from "@/components/layout/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { T } from "@/components/ui/Text";
import { site } from "@/config/site";
import { AudienceSwitcher } from "./AudienceSwitcher";
import type { SectionProps } from "./registry";

/** Signal slab with the cycling persona list + grey panel card (Wastetide split). */
export function Audience({ id, tone, index }: SectionProps) {
  const c = site.content.audience;

  return (
    <Section id={id} tone={tone} padded={false} guides={false} className="overflow-x-clip">
      <div className="grid gap-6 px-[var(--gutter)] pt-12 pb-6 md:pt-16 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-5">
          <div data-reveal="">
            <Eyebrow c={c.eyebrow} index={index} />
          </div>
          <h2 data-reveal="" className="font-display text-display-lg text-paper">
            <T c={c.heading} />
          </h2>
        </div>
        <p data-reveal="" className="max-w-sm self-end font-mono text-[0.8125rem] leading-relaxed text-muted">
          <T c={c.intro} />
        </p>
      </div>
      <AudienceSwitcher items={c.items} />
    </Section>
  );
}
