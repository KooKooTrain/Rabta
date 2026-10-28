import Image from "next/image";
import Link from "next/link";
import { site } from "@/config/site";
import { plain } from "@/lib/copy";
import { cn } from "@/lib/utils";
import { LogoMark } from "./LogoMark";

/** Logo = mark + product name. Configure via site.brand.logo / productName. */
export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  const name = plain(site.brand.productName);
  const logo = site.brand.logo;

  return (
    <Link
      href={href}
      className={cn("group inline-flex items-center gap-2.5", className)}
      aria-label={`${name}: home`}
    >
      {logo.kind === "image" ? (
        <Image src={logo.src} width={logo.width} height={logo.height} alt="" className="h-8 w-auto" />
      ) : (
        <LogoMark className="transition-transform duration-[var(--dur-slow)] ease-scale group-hover:rotate-90" />
      )}
      <span className="font-display text-[1.5rem] leading-none tracking-[-0.02em]">{name}</span>
    </Link>
  );
}
