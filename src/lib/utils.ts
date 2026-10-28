import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Teach tailwind-merge the custom tokens from tokens.css, otherwise it treats
// e.g. `text-display-xl` as a colour and drops it next to `text-fg`.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["display-hero", "display-2xl", "display-xl", "display-lg", "title", "lead", "stat", "label"],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
