"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Language = "en" | "ar";
type Preferences = { language: Language; setLanguage: (language: Language) => void; adhdFriendly: boolean; setAdhdFriendly: (enabled: boolean) => void; reduceMotion: boolean; setReduceMotion: (enabled: boolean) => void; reminders: boolean; setReminders: (enabled: boolean) => void };
const PreferencesContext = createContext<Preferences | null>(null);

export function WorkspacePreferences({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  const [adhdFriendly, setAdhdFriendly] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [reminders, setReminders] = useState(true);
  useEffect(() => {
    try {
      setLanguage(localStorage.getItem("rabta-language") === "ar" ? "ar" : "en");
      setAdhdFriendly(localStorage.getItem("rabta-adhd-friendly") === "true");
      setReduceMotion(localStorage.getItem("rabta-reduce-motion") === "true");
      setReminders(localStorage.getItem("rabta-reminders") !== "false");
    } catch { /* preferences remain available for this session */ }
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("rabta-language", language);
      localStorage.setItem("rabta-adhd-friendly", String(adhdFriendly));
      localStorage.setItem("rabta-reduce-motion", String(reduceMotion));
      localStorage.setItem("rabta-reminders", String(reminders));
    } catch { /* storage may be unavailable */ }
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.dataset.adhdFriendly = String(adhdFriendly);
    document.documentElement.dataset.reduceMotion = String(reduceMotion);
  }, [language, adhdFriendly, reduceMotion, reminders]);
  const value = useMemo(() => ({ language, setLanguage, adhdFriendly, setAdhdFriendly, reduceMotion, setReduceMotion, reminders, setReminders }), [language, adhdFriendly, reduceMotion, reminders]);
  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function useWorkspacePreferences() {
  const value = useContext(PreferencesContext);
  if (!value) throw new Error("Workspace preferences must be used inside WorkspacePreferences.");
  return value;
}
