import type Lenis from "lenis";

/** The page's Lenis instance (null on /demo, during SSR, or with reduced motion). */
let instance: Lenis | null = null;

export const setLenis = (l: Lenis | null) => {
  instance = l;
};
export const getLenis = () => instance;

/** Lock / unlock page scrolling (mobile menu). Falls back to overflow on <html>. */
export function lockScroll(locked: boolean) {
  if (instance) {
    if (locked) instance.stop();
    else instance.start();
  }
  document.documentElement.style.overflow = locked ? "hidden" : "";
}
