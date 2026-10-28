import { registry } from "@/components/sections/registry";
import { checkConfig } from "@/lib/config-check";
import { enabledSections } from "@/lib/nav";

export default function HomePage() {
  checkConfig();
  return enabledSections.map((s, i) => {
    const Component = registry[s.id];
    return <Component key={s.id} id={s.id} tone={s.tone} index={i + 1} />;
  });
}
