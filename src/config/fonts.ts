/** Manrope matches the clean, rounded typography in the Rabta UI reference. */
import { Manrope } from "next/font/google";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-sans-src", display: "swap" });

export const fontVariables = manrope.variable;
