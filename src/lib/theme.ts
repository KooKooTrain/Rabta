/**
 * Light / dark theme. The choice lives on <html data-theme> and in
 * localStorage("theme"); with no saved choice it follows the OS setting.
 * `themeScript` runs before paint (root layout) so there is no flash.
 */
export type Theme = "light" | "dark";

export const THEME_KEY = "theme";

export const themeScript = `(function(){var d=document.documentElement;d.classList.add('js');var t;try{t=localStorage.getItem('${THEME_KEY}')}catch(e){}if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}d.dataset.theme=t})()`;

export function getTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export function setTheme(theme: Theme, persist = true) {
  document.documentElement.dataset.theme = theme;
  if (!persist) return;
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // storage blocked (private mode): the choice lasts for this page only
  }
}

export function hasSavedTheme(): boolean {
  try {
    const t = localStorage.getItem(THEME_KEY);
    return t === "light" || t === "dark";
  } catch {
    return false;
  }
}

/** Calls `cb` whenever <html data-theme> changes. Returns an unsubscribe. */
export function subscribeTheme(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  // Follow the OS setting live until the visitor picks a theme themselves
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const onMq = () => {
    if (!hasSavedTheme()) setTheme(mq.matches ? "dark" : "light", false);
  };
  mq.addEventListener("change", onMq);
  return () => {
    mo.disconnect();
    mq.removeEventListener("change", onMq);
  };
}
