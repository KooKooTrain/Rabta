import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { T } from "@/components/ui/Text";
import { Glyph } from "@/components/visuals/Glyph";
import { site } from "@/config/site";
import type { Copy } from "@/lib/copy";
import type { SectionProps } from "./registry";

function Track({ items, dup = false }: { items: Copy[]; dup?: boolean }) {
  return (
    <ul
      className="flex shrink-0 items-center gap-4 pe-4"
      data-dup={dup ? "" : undefined}
      aria-hidden={dup ? true : undefined}
    >
      {items.map((item, i) => (
        <li key={i} className="flex items-center gap-4">
          <span className="font-display rounded-pill border border-line-strong px-5 py-2 text-[clamp(1.0625rem,1rem+0.4vw,1.375rem)] font-medium whitespace-nowrap">
            <T c={item} rich={false} tag={false} />
          </span>
          <Glyph name="spark" className="size-4 shrink-0" color="var(--color-saffron)" />
        </li>
      ))}
    </ul>
  );
}

export function Marquee({ id, tone }: SectionProps) {
  const c = site.content.marquee;
  return (
    <Section id={id} tone={tone} padded={false} guides={false} className="overflow-hidden">
      <div className="py-8 md:py-10">
        <Container>
          <p className="label-mono flex items-center gap-3 text-muted">
            <span aria-hidden="true" className="h-px w-6 bg-line-strong" />
            <T c={c.label} rich={false} />
          </p>
        </Container>
        <div className="marquee mt-6 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
          <div className="marquee-track">
            <Track items={c.items} />
            <Track items={c.items} dup />
          </div>
        </div>
      </div>
    </Section>
  );
}
