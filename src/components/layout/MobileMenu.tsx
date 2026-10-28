"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { T } from "@/components/ui/Text";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { site } from "@/config/site";
import { isLiveHref, navItems } from "@/lib/nav";
import { lockScroll } from "@/lib/smooth-scroll";

const SHEET_ID = "mobile-menu";

/** Full-screen menu for < lg. Clip-path wipe, focus trap, Esc to close, theme switch. */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  // Portal target only exists on the client. The header uses backdrop-filter,
  // which would trap a position:fixed sheet inside it, so render into <body>.
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
  const toggleRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  const closeAndRefocus = () => {
    setOpen(false);
    toggleRef.current?.focus();
  };

  useEffect(() => {
    const sheet = sheetRef.current;
    if (!open || !sheet) return;

    lockScroll(true);

    const focusables = () =>
      Array.from(sheet.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"));
    const t = window.setTimeout(() => {
      sheet.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    }, 60);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        toggleRef.current?.focus();
      } else if (e.key === "Tab") {
        const f = focusables();
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    const mq = window.matchMedia("(min-width: 64rem)");
    const onMq = () => mq.matches && setOpen(false);

    document.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      lockScroll(false);
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, [open]);

  // Close when any link inside the sheet is followed
  const onSheetClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("a")) setOpen(false);
  };

  const cta = site.nav.cta;

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls={SHEET_ID}
        onClick={() => setOpen(true)}
        className="inline-flex size-10 items-center justify-center rounded-pill bg-fg text-bg transition-colors duration-[var(--dur-base)] ease-hover hover:bg-accent hover:text-accent-fg lg:hidden"
      >
        <Menu aria-hidden="true" className="size-5" />
        <span className="sr-only">Open menu</span>
      </button>

      {mounted &&
        createPortal(
          <div
            id={SHEET_ID}
            ref={sheetRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            data-tone="charcoal"
            data-lenis-prevent=""
            inert={!open}
            onClick={onSheetClick}
            className="fixed inset-0 z-[60] flex flex-col bg-bg text-fg lg:hidden"
            style={{
              clipPath: open ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
              visibility: open ? "visible" : "hidden",
              transition: open
                ? "clip-path 650ms var(--ease-wipe)"
                : "clip-path 650ms var(--ease-wipe), visibility 0s linear 650ms",
            }}
          >
            <div className="container-site flex h-[var(--header-h)] shrink-0 items-center justify-between">
              <Logo />
              <button
                type="button"
                onClick={closeAndRefocus}
                className="inline-flex size-10 items-center justify-center rounded-pill bg-accent text-accent-fg transition-colors duration-[var(--dur-base)] ease-hover hover:bg-fg hover:text-bg"
              >
                <X aria-hidden="true" className="size-5" />
                <span className="sr-only">Close menu</span>
              </button>
            </div>

            <nav aria-label="Mobile" className="container-site flex-1 overflow-y-auto py-6">
              <ul className="border-t border-line">
                {navItems.map((item, i) => (
                  <li key={item.id} className="border-b border-line">
                    <Link
                      href={item.href}
                      data-autofocus={i === 0 ? "" : undefined}
                      className="group flex items-baseline py-4"
                    >
                      <span className="block overflow-clip">
                        <span
                          className="font-display block text-[clamp(2.75rem,12vw,4.5rem)] leading-[0.9] tracking-[-0.04em] transition-[transform,color] duration-700 ease-out-soft group-hover:text-accent-text"
                          style={{
                            transform: open ? "none" : "translateY(105%)",
                            transitionDelay: open ? `${220 + i * 60}ms` : "0ms",
                          }}
                        >
                          {item.label}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="container-site flex shrink-0 flex-col gap-4 pt-4 pb-8">
              {isLiveHref(cta.href) && <Button link={cta} size="lg" className="w-full" />}
              <div className="flex items-center justify-between gap-4">
                <p className="label-caps text-muted">
                  <T c={site.brand.teamName} rich={false} /> · {site.competition.theme}
                </p>
                <ThemeToggle />
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

const noopSubscribe = () => () => {};
