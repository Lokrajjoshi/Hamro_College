"use client";
import { useT } from "@/lib/i18n";

const STYLES = {
  internal: "bg-emerald-50 text-emerald-700",
  regional_hub: "bg-amber-50 text-amber-700",
  international: "bg-navy-50 text-navy-700",
};

export default function TierBadge({ tier }) {
  const { t } = useT();
  return <span className={`badge ${STYLES[tier] || "bg-slate-100 text-slate-700"}`}>{t(`tier.${tier}`)}</span>;
}
