"use client";

import { Languages, Sparkles, Bell, Eye, type LucideIcon } from "lucide-react";
import { useWorkspacePreferences } from "@/components/demo/WorkspacePreferences";

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={onChange} className={`relative h-6 w-11 rounded-full transition-colors ${checked ? "bg-brand" : "bg-line-strong"}`}><span className={`absolute top-0.5 size-5 rounded-full bg-white shadow-sm transition-transform ${checked ? "translate-x-[1.375rem]" : "translate-x-0.5"}`} /></button>;
}

export function SettingsPage() {
  const { language, setLanguage, adhdFriendly, setAdhdFriendly, reduceMotion, setReduceMotion, reminders, setReminders } = useWorkspacePreferences();
  const ar = language === "ar";
  return (
    <div className="mx-auto max-w-[88rem] px-5 py-9 sm:px-8 lg:px-12 lg:py-12">
      <div><p className="text-sm text-muted">{ar ? "اجعل رابطة مناسبة لك." : "Make Rabta work the way you prefer."}</p><h2 className="mt-2 text-3xl font-medium tracking-[-0.045em]">{ar ? "الإعدادات" : "Settings"}</h2></div>
      <section className="mt-8 grid gap-4 md:grid-cols-2" aria-label={ar ? "التفضيلات" : "Preferences"}>
        <PreferenceCard icon={Languages} title={ar ? "اللغة" : "Language"} detail={ar ? "اختر لغة الواجهة." : "Choose your interface language."}>
          <div className="flex rounded-full bg-soft p-1" role="group" aria-label={ar ? "اللغة" : "Language"}><button type="button" aria-pressed={language === "en"} onClick={() => setLanguage("en")} className={`rounded-full px-3 py-1.5 text-sm ${language === "en" ? "bg-surface text-fg shadow-sm" : "text-muted"}`}>English</button><button type="button" aria-pressed={language === "ar"} onClick={() => setLanguage("ar")} className={`rounded-full px-3 py-1.5 text-sm ${language === "ar" ? "bg-surface text-fg shadow-sm" : "text-muted"}`}>العربية</button></div>
        </PreferenceCard>
        <PreferenceCard icon={Sparkles} title={ar ? "واجهة مناسبة لـ ADHD" : "ADHD-friendly UI"} detail={ar ? "تقليل المشتتات وتوضيح الخطوات." : "Reduce distractions and make each step easier to follow."}>
          <Toggle checked={adhdFriendly} onChange={() => setAdhdFriendly(!adhdFriendly)} label={ar ? "واجهة مناسبة لـ ADHD" : "ADHD-friendly UI"} />
        </PreferenceCard>
        <PreferenceCard icon={Eye} title={ar ? "تقليل الحركة" : "Reduce motion"} detail={ar ? "استخدام انتقالات أقل." : "Use fewer animations and transitions."}>
          <Toggle checked={reduceMotion} onChange={() => setReduceMotion(!reduceMotion)} label={ar ? "تقليل الحركة" : "Reduce motion"} />
        </PreferenceCard>
        <PreferenceCard icon={Bell} title={ar ? "تذكيرات لطيفة" : "Gentle reminders"} detail={ar ? "تذكير قبل مواعيد الرياضة العائلية." : "A reminder before family sports sessions."}>
          <Toggle checked={reminders} onChange={() => setReminders(!reminders)} label={ar ? "تذكيرات لطيفة" : "Gentle reminders"} />
        </PreferenceCard>
      </section>
      <p className="mt-5 text-xs text-subtle">{ar ? "يتم حفظ تفضيلاتك على هذا الجهاز." : "Your preferences are saved on this device."}</p>
    </div>
  );
}

function PreferenceCard({ icon: Icon, title, detail, children }: { icon: LucideIcon; title: string; detail: string; children: React.ReactNode }) {
  return <div className="flex min-h-40 flex-col justify-between gap-6 rounded-2xl border border-line bg-surface p-5 sm:p-6">
    <div className="flex items-start gap-4"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-soft text-muted"><Icon aria-hidden="true" className="size-5" /></span><div className="min-w-0"><h3 className="font-medium">{title}</h3><p className="mt-1 text-sm leading-relaxed text-muted">{detail}</p></div></div>
    <div className="flex justify-end">{children}</div>
  </div>;
}
