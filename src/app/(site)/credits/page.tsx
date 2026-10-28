import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import credits from "@/config/photo-credits.json";

export const metadata: Metadata = {
  title: "Credits",
  description: "Photo, font and library credits.",
};

const FONTS = [
  ["Archivo", "Omnibus-Type", "SIL Open Font License 1.1"],
  ["Instrument Sans", "Instrument", "SIL Open Font License 1.1"],
  ["Geist Mono", "Vercel", "SIL Open Font License 1.1"],
];

/** Attribution for every bundled photo (CC BY / BY-SA require it) and font. */
export default function CreditsPage() {
  return (
    <Section id="credits" tone="paper">
      <Container>
        <Eyebrow c="Credits" />
        <h1 className="font-display text-display-xl mt-6">Photo &amp; font credits</h1>
        <p className="mt-6 max-w-xl text-muted">
          Photos are from Wikimedia Commons, downloaded and served locally, and shown under the
          licence listed for each one. Photos may be cropped, recoloured or cut into shapes.
        </p>

        <ul className="mt-12 grid gap-3 md:grid-cols-2">
          {credits.map((c) => (
            <li key={c.file} className="flex flex-col gap-2 rounded-tile border border-line bg-surface p-6">
              <p className="label-mono text-subtle">{c.file}</p>
              <p className="text-sm">{c.alt}</p>
              <p className="label-mono text-muted">
                {c.author} · {c.licence}
              </p>
              <a
                href={c.source_url}
                className="label-mono break-all text-accent-text underline-offset-4 hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                Source ↗
              </a>
            </li>
          ))}
        </ul>

        <h2 className="font-display text-display-lg mt-16">Fonts &amp; icons</h2>
        <ul className="label-mono mt-6 space-y-3 text-muted">
          {FONTS.map(([name, by, licence]) => (
            <li key={name}>
              {name} · {by} · {licence}
            </li>
          ))}
          <li>Lucide icons · ISC License</li>
        </ul>
      </Container>
    </Section>
  );
}
