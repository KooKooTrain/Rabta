import { Logo } from "@/components/brand/Logo";
import { LiveClock } from "@/components/motion/LiveClock";
import { Button } from "@/components/ui/Button";
import { site } from "@/config/site";
import { isLiveHref } from "@/lib/nav";
import { MobileMenu } from "./MobileMenu";
import { NavLinks } from "./NavLinks";

/** Sticky bone bar: logo · numbered nav · clock · dashed + solid buttons. */
export function Header() {
  const { cta, secondary } = site.nav;
  const clock = site.content.hero.bottomBar;
  return (
    <header
      data-tone="paper"
      className="sticky top-0 z-50 h-[var(--header-h)] border-b border-line bg-bg/95 text-fg backdrop-blur-sm"
    >
      <div className="container-site flex h-full items-center justify-between gap-6">
        <Logo />
        <NavLinks className="hidden lg:flex" />
        <div className="flex items-center gap-2">
          <p className="label-mono me-2 hidden items-center gap-2 text-muted xl:flex">
            <span aria-hidden="true" className="live-dot size-1.5 bg-signal" />
            <LiveClock timeZone={clock.timeZone} className="text-fg" />
            {clock.clockLabel}
          </p>
          {secondary && isLiveHref(secondary.href) && (
            <Button link={secondary} variant="secondary" icon={false} className="hidden md:inline-flex" />
          )}
          {isLiveHref(cta.href) && <Button link={cta} className="hidden sm:inline-flex" />}
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
