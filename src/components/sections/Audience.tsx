import { site } from "@/config/site";
import type { Tint } from "@/config/types";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { CycleWord } from "@/components/motion/CycleWord";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PhTag, T } from "@/components/ui/Text";
import { Glyph } from "@/components/visuals/Glyph";
import { plain } from "@/lib/copy";
import type { SectionProps } from "./registry";

const tintBg: Record<Tint, string> = {
  sage: "bg-sage",
  sky: "bg-sky",
  blush: "bg-blush",
  butter: "bg-butter",
};
const tintFg: Record<Tint, string> = {
  sage: "var(--color-forest)",
  sky: "var(--color-forest)",
  blush: "var(--color-ember-ink)",
  butter: "var(--color-ember-ink)",
};

const listFormat = (words: string[]) =>
  words.length < 2 ? words.join("") : `${words.slice(0, -1).join(", ")} and ${words[words.length - 1]}`;

export function Audience({ id, tone, index }: SectionProps) {
  const c = site.content.audience;

  return (
    <Section id={id} tone={tone}>
      <Container>
        <header className="flex max-w-4xl flex-col gap-5">
          <div data-reveal="">
            <Eyebrow c={c.eyebrow} index={index} />
          </div>
          <h2
            data-reveal=""
            style={{ "--i": 1 } as React.CSSProperties}
            className="font-display text-display-xl font-semibold"
          >
            <span className="sr-only">
              {plain(c.headingPrefix)} {listFormat(c.words)}
            </span>
            <span aria-hidden="true">
              {plain(c.headingPrefix)}{" "}
              <span className="emph">
                <CycleWord words={c.words} />
              </span>
            </span>
            <PhTag c={c.headingPrefix} />
          </h2>
          <p
            data-reveal=""
            style={{ "--i": 2 } as React.CSSProperties}
            className="max-w-xl text-lead text-muted"
          >
            <T c={c.intro} />
          </p>
        </header>

        <ul className="mt-12 grid grid-cols-2 gap-3 md:mt-16 md:gap-4 lg:grid-cols-4">
          {c.items.map((item, i) => (
            <li
              key={i}
              data-reveal=""
              style={{ "--i": i } as React.CSSProperties}
              className={`group relative flex min-h-56 flex-col justify-between overflow-hidden rounded-lg p-5 text-ink md:min-h-72 md:p-6 ${tintBg[item.tint]}`}
            >
              <span className="label-mono text-ink/70">{String(i + 1).padStart(2, "0")}</span>
              <Glyph
                name={item.glyph}
                color={tintFg[item.tint]}
                className="absolute -end-4 -top-4 size-32 opacity-90 transition-transform duration-[var(--dur-slower)] ease-out-soft group-hover:-rotate-6 group-hover:scale-110 md:size-40"
              />
              <div className="relative">
                <h3 className="font-display text-title font-semibold">
                  <T c={item.name} />
                </h3>
                <p className="mt-2 text-sm text-ink/80 md:text-base">
                  <T c={item.need} />
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
