import { Section } from "@/components/layout/Section";
import { T } from "@/components/ui/Text";
import { PixelField } from "@/components/visuals/PixelField";
import { site } from "@/config/site";
import type { Copy } from "@/lib/copy";
import { cn } from "@/lib/utils";
import type { SectionProps } from "./registry";

function Track({ items, dup = false }: { items: Copy[]; dup?: boolean }) {
  return (
    <ul
      className="flex shrink-0 items-center gap-2 pe-2"
      data-dup={dup ? "" : undefined}
      aria-hidden={dup ? true : undefined}
    >
      {items.map((item, i) => (
        <li
          key={i}
          className={cn(
            "font-display rounded-pill px-6 py-2.5 text-[clamp(1.25rem,1rem+1.2vw,2.25rem)] leading-none whitespace-nowrap",
            i % 2 === 0 ? "bg-brand text-white" : "bg-tint text-ink",
          )}
        >
          <T c={item} rich={false} tag={false} />
        </li>
      ))}
    </ul>
  );
}

/** Rounded coal slab: tint label pill + brand/tint pill marquee, over a pixel-field band. */
export function Marquee({ id, tone }: SectionProps) {
  const c = site.content.marquee;
  return (
    <Section id={id} tone={tone} padded={false} guides={false} className="overflow-x-clip">
      <div className="flex flex-col md:flex-row md:items-stretch">
        <p className="label-caps m-2 flex shrink-0 items-center justify-center gap-2 rounded-[calc(var(--radius-slab)-0.5rem)] bg-tint px-6 py-4 whitespace-nowrap text-ink md:w-64 md:py-0">
          <span aria-hidden="true">[</span>
          <T c={c.label} rich={false} />
          <span aria-hidden="true">]</span>
        </p>
        <div className="marquee min-w-0 flex-1 overflow-hidden py-5 md:py-7">
          <div className="marquee-track">
            <Track items={c.items} />
            <Track items={c.items} dup />
          </div>
        </div>
      </div>
      <PixelField className="h-14 md:h-20" direction="right" cell={20} intensity={0.95} />
    </Section>
  );
}
