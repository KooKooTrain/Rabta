import type { Metadata, Viewport } from "next";
import { fontVariables } from "@/config/fonts";
import { site } from "@/config/site";
import { RevealObserver } from "@/components/motion/RevealObserver";
import { SkipLink } from "@/components/layout/SkipLink";
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
  themeColor: "#f4f3ee",
  colorScheme: "light",
};

// Adds `js` class before paint so reveal animations never hide content without JS.
const jsFlag = `document.documentElement.classList.add('js')`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang={site.locale.lang}
      dir={site.locale.dir}
      className={fontVariables}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: jsFlag }} />
      </head>
      <body className="min-h-dvh">
        <SkipLink />
        {children}
        <RevealObserver />
      </body>
    </html>
  );
}
