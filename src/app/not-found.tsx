import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { KinTiles } from "@/components/visuals/KinTiles";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" tabIndex={-1} data-tone="paper" className="bg-bg text-fg outline-none">
        <Container className="flex min-h-[70dvh] flex-col items-center justify-center py-section text-center">
          <div className="w-32 md:w-40">
            <KinTiles cols={3} rows={3} seed="not-found" animateIn />
          </div>
          <Eyebrow c="Error 404" className="mt-10 justify-center" />
          <h1 className="mt-5 max-w-2xl font-display text-display-xl font-semibold">
            This room is <em className="emph">empty</em>
          </h1>
          <p className="mt-5 max-w-md text-lead text-muted">
            The page you were looking for doesn&apos;t exist or has moved.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button link={{ label: "Back to home", href: "/" }} />
            <Button link={{ label: "Open the demo", href: "/demo" }} variant="secondary" />
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
