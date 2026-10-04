"use client";
import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { useCompareStore, MAX_COMPARE } from "@/store/useCompareStore";
import { useHydrated } from "@/lib/useHydrated";
import { useT } from "@/lib/i18n";

export default function CompareButton({ college, className = "" }) {
  const { t } = useT();
  const hydrated = useHydrated();
  const toggle = useCompareStore((s) => s.toggle);
  const added = useCompareStore((s) => s.items.some((i) => i.slug === college.slug));
  const [warning, setWarning] = useState(false);

  function handleClick(e) {
    e.preventDefault();
    const ok = toggle(college);
    if (!ok) {
      setWarning(true);
      setTimeout(() => setWarning(false), 2000);
    }
  }

  const isAdded = hydrated && added;
  return (
    <button
      onClick={handleClick}
      className={`${isAdded ? "btn border border-emerald-300 bg-emerald-50 text-emerald-700" : "btn-outline"} ${className}`}
      title={warning ? `You can compare up to ${MAX_COMPARE} colleges` : undefined}
    >
      {isAdded ? <Check size={16} /> : <Plus size={16} />}
      {warning ? `Max ${MAX_COMPARE}` : isAdded ? t("common.added") : t("common.compare")}
    </button>
  );
}
