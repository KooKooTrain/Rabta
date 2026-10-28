import { icons, type IconName } from "@/lib/icons";
import type { LucideProps } from "lucide-react";

export function Icon({ name, ...props }: { name: IconName } & LucideProps) {
  const C = icons[name];
  return <C aria-hidden="true" strokeWidth={1.75} {...props} />;
}
