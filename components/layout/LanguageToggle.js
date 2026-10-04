"use client";
import { useLocaleStore } from "@/store/useLocaleStore";
import { useHydrated } from "@/lib/useHydrated";

export default function LanguageToggle() {
  const locale = useLocaleStore((s) => s.locale);
  const setLocale = useLocaleStore((s) => s.setLocale);
  const hydrated = useHydrated();
  const current = hydrated ? locale : "en";

  return (
    <div className="flex rounded-xl border border-slate-200 p-0.5 text-xs font-semibold">
      {[
        { id: "en", label: "EN" },
        { id: "ne", label: "नेपाली" },
      ].map((opt) => (
        <button
          key={opt.id}
          onClick={() => setLocale(opt.id)}
          className={`rounded-lg px-2.5 py-1.5 transition ${current === opt.id ? "bg-navy-700 text-white" : "text-slate-600 hover:bg-slate-100"}`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
