"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { ScrollTrigger, gsap } from "@/lib/gsap";
import { setLenis } from "@/lib/smooth-scroll";

/**
 * Lenis smooth scrolling for the marketing pages, driven by GSAP's ticker so
 * ScrollTrigger pins and scrubs stay in sync. Not created for reduced motion
 * (native scrolling is used instead). Same-page anchor links glide to their
 * section, below the sticky header. Renders nothing.
 */
export function SmoothScroll() {
  // Pins add height above later triggers; once everything has mounted (and
  // again when fonts/images settle) re-sort and re-measure every trigger.
  useEffect(() => {
    const refresh = () => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    };
    const raf = requestAnimationFrame(refresh);
    window.addEventListener("load", refresh);
    void document.fonts?.ready.then(refresh);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("load", refresh);
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ lerp: 0.11, syncTouch: false, autoRaf: false });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Capture phase: runs before next/link, whose handler skips prevented events
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]");
      if (!(a instanceof HTMLAnchorElement) || a.target === "_blank") return;
      const url = new URL(a.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;
      const target = url.hash === "#main" ? 0 : document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (target === null) return;
      e.preventDefault();
      // Lenis already honours html { scroll-padding-top } (the header offset)
      lenis.start();
      lenis.scrollTo(target, { duration: 1.3 });
      history.replaceState(null, "", url.hash === "#main" ? location.pathname : url.hash);
      if (target instanceof HTMLElement) {
        target.setAttribute("tabindex", target.getAttribute("tabindex") ?? "-1");
        target.focus({ preventScroll: true });
      }
    };
    document.addEventListener("click", onClick, true);

    return () => {
      document.removeEventListener("click", onClick, true);
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
