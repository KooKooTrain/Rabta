import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { ScatterIn } from "@/components/motion/ScatterIn";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { T } from "@/components/ui/Text";
import { PillStrip } from "@/components/visuals/PillStrip";
import { PixelField } from "@/components/visuals/PixelField";
import { Stamp } from "@/components/visuals/Stamp";
import { site } from "@/config/site";
import { seededRandom } from "@/lib/seeded";
import { cn } from "@/lib/utils";
import type { SectionProps } from "./registry";

/** Stamp collage of family photos on a dark grid, then a pill + pixel band. */
export function Moments({ id, tone, index }: SectionProps) {
  const c = site.content.moments;
  const photos = site.media.moments;
  const rand = seededRandom(`${site.brand.seed}:moments`);
  const tilts = photos.map(() => Math.round((rand() - 0.5) * 16));

  return (
    <Section id={id} tone={tone} padded={false} className="overflow-x-clip">
      <div className="bg-grid py-section [--grid-size:clamp(64px,8vw,120px)]">
        <Container>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <SectionHeading eyebrow={c.eyebrow} heading={c.heading} index={index} size="2xl" className="lg:col-span-8" />
            <p data-reveal="" className="max-w-sm font-mono text-[0.8125rem] leading-relaxed text-muted lg:col-span-4 lg:justify-self-end">
              <T c={c.intro} />
            </p>
          </div>

          <ScatterIn className="mt-14 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 md:mt-20 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-4">
            {photos.map((photo, i) => (
              <div
                key={`${photo.src}-${i}`}
                data-scatter=""
                className={cn(i % 2 === 1 && "translate-y-6", i % 4 === 2 && "lg:-translate-y-8", i % 4 === 1 && "lg:translate-y-14")}
              >
                <Stamp photo={photo} rotate={tilts[i]} />
              </div>
            ))}
          </ScatterIn>

          <ul aria-label="Moments" className="mt-16 flex flex-wrap justify-center gap-2 md:mt-24">
            {c.pills.map((pill, i) => (
              <li
                key={i}
                className={cn(
                  "font-display rounded-pill px-5 py-2 text-[clamp(1.125rem,1rem+0.8vw,1.75rem)] leading-none",
                  i % 2 === 0 ? "bg-ember text-ink" : "bg-cream text-ink",
                )}
              >
                <T c={pill} rich={false} tag={false} />
              </li>
            ))}
          </ul>
        </Container>
      </div>
      <div className="grid gap-2 p-2 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <PixelField className="h-24 rounded-[calc(var(--radius-slab)-0.5rem)] md:h-28" direction="up" cell={18} />
        <PillStrip count={9} className="h-full min-h-12 rounded-[calc(var(--radius-slab)-0.5rem)]" />
      </div>
    </Section>
  );
}
