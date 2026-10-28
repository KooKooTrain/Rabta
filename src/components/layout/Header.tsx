import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { site } from "@/config/site";
import { isLiveHref } from "@/lib/nav";
import { MobileMenu } from "./MobileMenu";
import { NavLinks } from "./NavLinks";

/** Sticky site header. Background + hairline fade in on scroll (CSS scroll timeline). */
export function Header() {
  const cta = site.nav.cta;
  return (
    <header
      data-tone="paper"
      className="header-frame sticky top-0 z-50 h-[var(--header-h)] border-b border-line bg-paper/80 text-fg backdrop-blur-md"
    >
      <div className="container-site flex h-full items-center justify-between gap-6">
        <Logo />
        <NavLinks className="hidden lg:flex" />
        <div className="flex items-center gap-2">
          {isLiveHref(cta.href) && <Button link={cta} className="hidden md:inline-flex" />}
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
