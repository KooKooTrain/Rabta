import type { Metadata, Viewport } from "next";
import { fontVariables } from "@/config/fonts";
import { site } from "@/config/site";
import { RevealObserver } from "@/components/motion/RevealObserver";
import { SkipLink } from "@/components/layout/SkipLink";
import { themeScript } from "@/lib/theme";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.meta.url),
  title: { default: site.meta.title, template: `%s · ${site.meta.title}` },
  description: site.meta.description,
  keywords: site.meta.keywords,
  openGraph: {
    title: site.meta.title,
    description: site.meta.description,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f1ea" },
    { media: "(prefers-color-scheme: dark)", color: "#141110" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang={site.locale.lang}
      dir={site.locale.dir}
      className={fontVariables}
      suppressHydrationWarning
    >
      <head>
        {/* Before paint: adds the `js` class (reveal animations never hide content
            without JS) and sets data-theme (saved choice, else the OS setting). */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh">
        <SkipLink />
        {children}
        <RevealObserver />
      </body>
    </html>
  );
}
