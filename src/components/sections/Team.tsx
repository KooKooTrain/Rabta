import { site } from "@/config/site";
import type { TeamContent } from "@/config/types";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { T } from "@/components/ui/Text";
import { PixelField } from "@/components/visuals/PixelField";
import { Stamp } from "@/components/visuals/Stamp";
import { plain } from "@/lib/copy";
import { TeamSlider } from "./TeamSlider";
import type { SectionProps } from "./registry";

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

const TILTS = [-3, 2, -1.5, 3, -2.5];

/** Members as perforated stamps (photo, or a seeded pixel monogram) in a slider. */
export function Team({ id, tone, index }: SectionProps) {
  const c = site.content.team;
  const members: TeamContent["members"] = c.members;

  return (
    <Section id={id} tone={tone} className="overflow-x-clip">
      <Container>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <SectionHeading eyebrow={c.eyebrow} heading={c.heading} index={index} size="2xl" className="lg:col-span-7" />
          <p data-reveal="" className="label-caps max-w-sm leading-relaxed text-muted lg:col-span-5 lg:justify-self-end">
            <T c={c.intro} rich={false} />
          </p>
        </div>

        <div className="mt-12 md:mt-16">
          <TeamSlider count={members.length}>
            {members.map((m, i) => {
              const name = plain(m.name);
              return (
                <li key={i} data-reveal="" style={{ "--i": i } as React.CSSProperties} className="w-[72%] shrink-0 snap-start sm:w-[44%] md:w-[34%] lg:w-[27%] xl:w-auto">
                  <Stamp photo={m.photo} rotate={TILTS[i % TILTS.length]} caption={false} aspect="aspect-square">
                    <PixelField
                      className="absolute inset-0"
                      direction="radial"
                      cell={16}
                      seed={`${site.brand.seed}:${name}`}
                      wave={0.1}
                    />
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 grid place-items-center"
                    >
                      <span className="font-display rounded-inner bg-paper px-4 pt-1.5 pb-0.5 text-[clamp(2.75rem,5vw,4.5rem)] leading-[0.9] text-ink">
                        {initials(name)}
                      </span>
                    </span>
                  </Stamp>
                  <div className="mt-6 border-t border-line pt-4">
                    <p className="label-caps text-accent-text">
                      [ <T c={m.role} rich={false} tag={false} /> ]
                    </p>
                    <h3 className="font-display text-title mt-2">
                      <T c={m.name} />
                    </h3>
                    {m.detail && (
                      <p className="mt-2 text-sm text-muted">
                        <T c={m.detail} />
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </TeamSlider>
        </div>
      </Container>
    </Section>
  );
}
