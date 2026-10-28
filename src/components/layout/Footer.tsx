import Link from "next/link";
import { ArrowRight, ArrowUp } from "lucide-react";
import { site } from "@/config/site";
import { Logo } from "@/components/brand/Logo";
import { WordmarkReveal } from "@/components/motion/WordmarkReveal";
import { T } from "@/components/ui/Text";
import { PixelField } from "@/components/visuals/PixelField";
import { plain } from "@/lib/copy";
import { isLiveHref } from "@/lib/nav";
import { Container } from "./Container";

const linkCls =
  "underline-offset-4 decoration-line-strong transition-colors duration-[var(--dur-base)] ease-hover hover:text-fg hover:underline";

/** Night footer: lime action squares, [ mono ] link columns, pixel block, giant wordmark. */
export function Footer() {
  const f = site.footer;
  const comp = site.competition;
  const actions = f.actions.filter((l) => isLiveHref(l.href));
  const columns = f.columns
    .map((col) => ({ ...col, links: col.links.filter((l) => isLiveHref(l.href)) }))
    .filter((col) => col.links.length > 0);

  return (
    <footer data-tone="night" className="relative overflow-x-clip bg-bg text-fg">
      {/* Action squares */}
      {actions.length > 0 && (
        <div className="grid border-b border-line md:grid-cols-2">
          {actions.map((a, i) => (
            <Link
              key={a.href}
              href={a.href}
              className="group flex items-stretch border-line md:[&:nth-child(2)]:border-s"
            >
              <span className="grid w-16 shrink-0 place-items-center bg-lime text-ink md:w-20">
                <ArrowRight
                  aria-hidden="true"
                  className="size-6 transition-transform duration-[var(--dur-base)] ease-hover group-hover:translate-x-1 rtl:-scale-x-100"
                />
              </span>
              <span
                className={`font-display flex flex-1 items-center px-5 py-6 text-[clamp(1.5rem,1.1rem+1.6vw,2.5rem)] leading-none transition-colors duration-[var(--dur-base)] ease-hover group-hover:bg-lime group-hover:text-ink md:px-8 md:py-8 ${
                  i === 0 ? "bg-forest" : "bg-night-2"
                }`}
              >
                <T c={a.label} rich={false} />
              </span>
            </Link>
          ))}
        </div>
      )}

      <Container className="pt-14 md:pt-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="flex flex-col items-start gap-6 lg:col-span-4">
            <Logo />
            <p className="max-w-sm text-sm text-muted">
              <T c={f.blurb} />
            </p>
            <PixelField className="h-20 w-full max-w-xs" direction="right" cell={14} />
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-8">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="label-mono text-subtle">[ {col.title} ]</p>
                <ul className="label-mono mt-5 space-y-3 text-muted">
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
              <p className="label-mono text-subtle">[ Competition ]</p>
              <dl className="label-mono mt-5 space-y-3 text-muted">
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

        <div className="label-mono mt-16 flex flex-col gap-4 border-t border-dashed border-line py-6 text-subtle md:flex-row md:items-center md:justify-between">
          <p>
            [ © 2026 <T c={site.brand.teamName} rich={false} /> ]
          </p>
          <p>
            [ <T c={f.legal} rich={false} /> ]
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/credits" className={linkCls}>
              [ Photo credits ]
            </Link>
            <a href="#main" className={`${linkCls} inline-flex items-center gap-1.5`}>
              [ Back to top
              <ArrowUp aria-hidden="true" className="size-3.5" /> ]
            </a>
          </div>
        </div>
      </Container>

      <WordmarkReveal
        text={plain(site.brand.productName)}
        className="font-display -mb-[0.06em] justify-center px-2 text-[clamp(4rem,18.5vw,22rem)] leading-[0.8] tracking-[-0.05em] whitespace-nowrap text-paper"
      />
    </footer>
  );
}
