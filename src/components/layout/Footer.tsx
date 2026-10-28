import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { site } from "@/config/site";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { T } from "@/components/ui/Text";
import { plain } from "@/lib/copy";
import { isLiveHref } from "@/lib/nav";
import { Container } from "./Container";

const linkCls =
  "rounded-xs underline-offset-4 decoration-line-strong transition-colors duration-[var(--dur-base)] ease-hover hover:text-fg hover:underline";

export function Footer() {
  const f = site.footer;
  const comp = site.competition;
  const columns = f.columns
    .map((col) => ({ ...col, links: col.links.filter((l) => isLiveHref(l.href)) }))
    .filter((col) => col.links.length > 0);

  return (
    <footer data-tone="night" className="relative overflow-hidden bg-bg text-fg">
      <Container className="pt-16 md:pt-24">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="flex flex-col items-start gap-6 lg:col-span-5">
            <Logo />
            <p className="max-w-sm text-muted">
              <T c={f.blurb} />
            </p>
            <Button link={site.nav.cta} />
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="label-mono text-subtle">{col.title}</p>
                <ul className="mt-4 space-y-3 text-muted">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className={linkCls}>
                        <T c={l.label} rich={false} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="col-span-2 sm:col-span-1">
              <p className="label-mono text-subtle">Competition</p>
              <dl className="label-mono mt-4 space-y-3 normal-case tracking-normal text-muted">
                <div>
                  <dt className="sr-only">Event</dt>
                  <dd>{comp.name}</dd>
                </div>
                <div>
                  <dt className="sr-only">Track</dt>
                  <dd>{comp.track}</dd>
                </div>
                <div className="flex flex-wrap gap-x-2">
                  <dt className="text-accent-text">Theme</dt>
                  <dd>{comp.theme}</dd>
                </div>
                <div>
                  <dt className="sr-only">Date</dt>
                  <dd>{comp.date}</dd>
                </div>
              </dl>
            </div>
          </nav>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-dashed border-line py-6 text-sm text-subtle md:flex-row md:items-center md:justify-between">
          <p>
            <T c={f.legal} />
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <p>
              © 2026 <T c={site.brand.teamName} rich={false} />
            </p>
            <a href="#main" className={`${linkCls} inline-flex items-center gap-1.5`}>
              Back to top
              <ArrowUp aria-hidden="true" className="size-3.5" />
            </a>
          </div>
        </div>
      </Container>

      {/* Giant decorative wordmark */}
      <div aria-hidden="true" className="pointer-events-none select-none overflow-hidden">
        <p className="-mb-[0.22em] text-center font-display text-[clamp(4.5rem,19vw,17rem)] font-bold leading-none tracking-[-0.05em] whitespace-nowrap text-fg/[0.06]">
          {plain(site.brand.productName)}
        </p>
      </div>
    </footer>
  );
}
