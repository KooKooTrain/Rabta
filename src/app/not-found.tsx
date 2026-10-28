import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PixelField } from "@/components/visuals/PixelField";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" tabIndex={-1} data-tone="paper" className="bg-bg text-fg outline-none">
        <Container className="flex min-h-[70dvh] flex-col items-start justify-center py-section">
          <Eyebrow c="Error 404" />
          <h1 className="font-display text-display-hero mt-5">
            Room
            <br />
            <span className="emph">empty.</span>
          </h1>
          <p className="mt-6 max-w-md font-mono text-[0.8125rem] leading-relaxed text-muted">
            The page you were looking for doesn&apos;t exist or has moved.
          </p>
          <div className="mt-10 flex flex-wrap gap-2">
            <Button link={{ label: "Back to home", href: "/" }} size="lg" />
            <Button link={{ label: "Open the demo", href: "/demo" }} variant="secondary" size="lg" />
          </div>
        </Container>
        <PixelField palette="signal" direction="up" className="h-24 md:h-32" />
      </main>
      <Footer />
    </>
  );
}
