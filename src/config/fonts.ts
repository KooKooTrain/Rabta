/**
 * FONTS: the only place typefaces are chosen.
 * To swap a font: change the import + constructor below. Keep the `variable`
 * names; tokens.css maps them to font-display / font-sans / font-serif / font-mono.
 * If a new display font has no 'wdth' axis, remove `axes` and set
 * --display-stretch to 100% in tokens.css.
 */
import {
  Bricolage_Grotesque,
  Geist_Mono,
  Instrument_Sans,
  Instrument_Serif,
} from "next/font/google";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display-src",
  axes: ["opsz", "wdth"],
  display: "swap",
});

const sans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-sans-src",
  display: "swap",
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif-src",
  display: "swap",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono-src",
  display: "swap",
});

export const fontVariables = [display, sans, serif, mono]
  .map((f) => f.variable)
  .join(" ");
