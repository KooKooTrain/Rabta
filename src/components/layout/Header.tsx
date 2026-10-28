import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { site } from "@/config/site";
import { isLiveHref } from "@/lib/nav";
import { MobileMenu } from "./MobileMenu";
import { NavLinks } from "./NavLinks";

/** Sticky bar: logo + name on the left; underlined tabs, theme switch and one CTA on the right. */
export function Header() {
  const { cta } = site.nav;
  return (
    <header
      data-tone="paper"
      className="sticky top-0 z-50 h-[var(--header-h)] border-b border-line bg-bg/90 text-fg backdrop-blur-md"
    >
      <div className="container-site flex h-full items-center gap-6">
        <Logo />
        <NavLinks className="ms-auto hidden h-full lg:flex" />
        <div className="ms-auto flex items-center gap-2 lg:ms-4">
          <ThemeToggle />
          {isLiveHref(cta.href) && <Button link={cta} icon={false} className="hidden sm:inline-flex" />}
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
