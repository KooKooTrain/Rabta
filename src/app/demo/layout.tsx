import type { Metadata } from "next";
import { AppShell } from "@/components/demo/AppShell";

export const metadata: Metadata = {
  title: "Game",
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
