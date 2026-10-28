/**
 * FONTS: the only place typefaces are chosen.
 * To swap a font: change the import + constructor below. Keep the `variable`
 * names; tokens.css maps them to font-display / font-sans. (font-mono is a
 * system stack, used only for code snippets.)
 * Display is Archivo on its condensed 'wdth' axis (--display-stretch in
 * tokens.css). If a new display font has no 'wdth' axis, remove `axes` and set
 * --display-stretch to 100%.
 */
import { Archivo, Instrument_Sans } from "next/font/google";

const display = Archivo({
  subsets: ["latin"],
  variable: "--font-display-src",
  axes: ["wdth"],
  display: "swap",
});

const sans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-sans-src",
  display: "swap",
});

export const fontVariables = [display, sans].map((f) => f.variable).join(" ");
