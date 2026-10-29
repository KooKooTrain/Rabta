"use client";

import { Languages, Sparkles, Bell, Eye } from "lucide-react";
import { useWorkspacePreferences } from "@/components/demo/WorkspacePreferences";

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={onChange} className={`relative h-6 w-11 rounded-full transition-colors ${checked ? "bg-brand" : "bg-line-strong"}`}><span className={`absolute top-0.5 size-5 rounded-full bg-white shadow-sm transition-transform ${checked ? "translate-x-[1.375rem]" : "translate-x-0.5"}`} /></button>;
}

export function SettingsPage() {
  const { language, setLanguage, adhdFriendly, setAdhdFriendly, reduceMotion, setReduceMotion, reminders, setReminders } = useWorkspacePreferences();
  const ar = language === "ar";
  return (
    <div className="mx-auto max-w-3xl px-5 py-9 sm:px-8 lg:px-12 lg:py-12">
      <div><p className="text-sm text-muted">{ar ? "اجعل رابطة مناسبة لك." : "Make Rabta work the way you prefer."}</p><h2 className="mt-2 text-3xl font-medium tracking-[-0.045em]">{ar ? "الإعدادات" : "Settings"}</h2></div>
      <section className="mt-8 overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="flex items-center gap-4 border-b border-line px-5 py-5 sm:px-6"><Languages aria-hidden="true" className="size-5 text-muted" /><div className="min-w-0 flex-1"><h3 className="font-medium">{ar ? "اللغة" : "Language"}</h3><p className="mt-1 text-sm text-muted">{ar ? "اختر لغة الواجهة." : "Choose your interface language."}</p></div><div className="flex rounded-full bg-soft p-1" role="group" aria-label="Language"><button type="button" aria-pressed={language === "en"} onClick={() => setLanguage("en")} className={`rounded-full px-3 py-1.5 text-sm ${language === "en" ? "bg-surface text-fg shadow-sm" : "text-muted"}`}>English</button><button type="button" aria-pressed={language === "ar"} onClick={() => setLanguage("ar")} className={`rounded-full px-3 py-1.5 text-sm ${language === "ar" ? "bg-surface text-fg shadow-sm" : "text-muted"}`}>العربية</button></div></div>
        <div className="flex items-center gap-4 border-b border-line px-5 py-5 sm:px-6"><Sparkles aria-hidden="true" className="size-5 text-muted" /><div className="min-w-0 flex-1"><h3 className="font-medium">{ar ? "واجهة مناسبة لـ ADHD" : "ADHD-friendly UI"}</h3><p className="mt-1 text-sm text-muted">{ar ? "تقليل الحركة والمسافات البصرية." : "Use calmer spacing and reduce visual distractions."}</p></div><Toggle checked={adhdFriendly} onChange={() => setAdhdFriendly(!adhdFriendly)} label="ADHD-friendly UI" /></div>
        <PreferenceRow icon={<Eye aria-hidden="true" className="size-5 text-muted" />} title={ar ? "تقليل الحركة" : "Reduce motion"} detail={ar ? "استخدام انتقالات أقل." : "Use fewer animations and transitions."} checked={reduceMotion} onChange={() => setReduceMotion(!reduceMotion)} />
        <PreferenceRow icon={<Bell aria-hidden="true" className="size-5 text-muted" />} title={ar ? "تذكيرات لطيفة" : "Gentle reminders"} detail={ar ? "تذكير قبل الأحداث العائلية." : "A reminder before upcoming family events."} checked={reminders} onChange={() => setReminders(!reminders)} last />
      </section>
      <p className="mt-4 text-xs text-subtle">{ar ? "يتم حفظ تفضيلاتك على هذا الجهاز." : "Your preferences are saved on this device."}</p>
    </div>
  );
}

function PreferenceRow({ icon, title, detail, checked, onChange, last = false }: { icon: React.ReactNode; title: string; detail: string; checked: boolean; onChange: () => void; last?: boolean }) {
  return <div className={`flex items-center gap-4 px-5 py-5 sm:px-6 ${last ? "" : "border-b border-line"}`}>{icon}<div className="min-w-0 flex-1"><h3 className="font-medium">{title}</h3><p className="mt-1 text-sm text-muted">{detail}</p></div><Toggle checked={checked} onChange={onChange} label={title} /></div>;
}
