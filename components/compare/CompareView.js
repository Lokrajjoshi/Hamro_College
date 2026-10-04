"use client";
import Link from "next/link";
import { Check, Minus, Plus, Trophy, X } from "lucide-react";
import { useCompareStore, MAX_COMPARE } from "@/store/useCompareStore";
import { useHydrated } from "@/lib/useHydrated";
import { calculateCost } from "@/lib/costEngine";
import { formatNpr, formatNprShort } from "@/lib/format";
import TierBadge from "@/components/colleges/TierBadge";

// Each criterion: how to read a value, how to display it, and which direction is "better".
const CRITERIA = [
  { label: "Total estimated outlay (NPR)", get: (c, k) => k.total, show: (v) => formatNprShort(v), better: "low" },
  { label: "Legal part-time work rights", get: (c) => c.workHoursPerWeek ?? 0, show: (v, c) => (c.country === "Nepal" ? "Local jobs" : v ? `${v} hrs/week` : "Not allowed"), better: "high" },
  { label: "Post-study work visa", get: (c) => c.postStudyVisaYears ?? 0, show: (v, c) => (c.country === "Nepal" ? "N/A (home)" : v ? `Up to ${v} yrs` : "None"), better: "high" },
  { label: "Nepali students on campus", get: (c) => c.nepaliStudents, show: (v) => (v == null ? "Home country" : v.toLocaleString()), better: "high" },
  { label: "Distance & connectivity from Kathmandu", get: (c) => c.distanceKm, show: (v, c) => `${v.toLocaleString()} km · ${c.connectivity}`, better: "low" },
  { label: "Accreditation / grade", get: (c) => c.accreditation, show: (v) => v },
  { label: "Average starting salary (NPR)", get: (c, k) => k.salaryNpr, show: (v) => formatNprShort(v), better: "high" },
  { label: "Campus safety index", get: (c) => c.safetyIndex, show: (v) => `${v} / 10`, better: "high" },
  { label: "Hostel vs. mandatory PG", get: (c) => c.hostelCapacity, show: (v, c) => `${v?.toLocaleString() ?? "—"} beds${c.mandatoryPg ? " · PG usually needed" : ""}` },
  { label: "Minimum eligibility", get: (c) => c.minGpa, show: (v, c) => `GPA ${v} · ${c.englishTest}` },
  { label: "Nepali alumni registered", get: (c) => c.nepaliAlumni, show: (v) => v?.toLocaleString() ?? "—", better: "high" },
  { label: "Tuition in installments", get: (c) => c.installments, show: (v) => v, type: "bool" },
];

function bestIndex(values, better) {
  if (!better) return -1;
  const nums = values.map((v) => (typeof v === "number" ? v : null));
  if (nums.filter((n) => n != null).length < 2) return -1;
  let best = -1;
  nums.forEach((n, i) => {
    if (n == null) return;
    if (best === -1 || (better === "low" ? n < nums[best] : n > nums[best])) best = i;
  });
  // No winner if everyone ties
  return nums.every((n) => n === nums[best]) ? -1 : best;
}

export default function CompareView({ colleges }) {
  const hydrated = useHydrated();
  const items = useCompareStore((s) => s.items);
  const toggle = useCompareStore((s) => s.toggle);
  const remove = useCompareStore((s) => s.remove);
  const clear = useCompareStore((s) => s.clear);

  if (!hydrated) return <div className="card h-64 animate-pulse" />;

  const selected = items.map((i) => colleges.find((c) => c.slug === i.slug)).filter(Boolean);
  const costs = selected.map((c) => calculateCost(c));
  const available = colleges.filter((c) => !items.some((i) => i.slug === c.slug));

  return (
    <div className="space-y-6">
      <div className="card flex flex-wrap items-end gap-3 p-5">
        <div className="min-w-[240px] flex-1">
          <label className="label" htmlFor="add">Add a college ({selected.length}/{MAX_COMPARE})</label>
          <select
            id="add"
            className="input"
            value=""
            disabled={selected.length >= MAX_COMPARE}
            onChange={(e) => {
              const c = colleges.find((x) => x.slug === e.target.value);
              if (c) toggle(c);
            }}
          >
            <option value="">{selected.length >= MAX_COMPARE ? "Remove one to add another" : "Select a college…"}</option>
            {available.map((c) => <option key={c.slug} value={c.slug}>{c.name} — {c.city}</option>)}
          </select>
        </div>
        {selected.length > 0 && <button onClick={clear} className="btn-ghost">Clear all</button>}
      </div>

      {selected.length === 0 ? (
        <div className="card flex flex-col items-center p-12 text-center">
          <Plus className="mb-3 text-slate-300" size={40} />
          <p className="font-semibold">Pick up to 3 colleges to compare side by side.</p>
          <p className="mt-1 text-sm text-slate-500">Use the dropdown above or press “Compare” on any college card.</p>
          <Link href="/colleges" className="btn-primary mt-5">Browse colleges</Link>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr>
                <th className="sticky left-0 top-0 z-20 w-56 bg-slate-50 p-4 text-left text-xs font-semibold uppercase text-slate-500">Criteria</th>
                {selected.map((c) => (
                  <th key={c.slug} className="sticky top-0 z-10 bg-slate-50 p-4 text-left align-top">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link href={`/colleges/${c.slug}`} className="font-bold text-slate-900 hover:text-brand-600">{c.name}</Link>
                        <p className="mb-2 text-xs font-normal text-slate-500">{c.city}, {c.country}</p>
                        <TierBadge tier={c.tier} />
                      </div>
                      <button onClick={() => remove(c.slug)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-200" aria-label={`Remove ${c.name}`}><X size={16} /></button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CRITERIA.map((crit, row) => {
                const values = selected.map((c, i) => crit.get(c, costs[i]));
                const winner = bestIndex(values, crit.better);
                return (
                  <tr key={crit.label} className={row % 2 ? "bg-slate-50/60" : "bg-white"}>
                    <td className="sticky left-0 z-10 bg-inherit p-4 font-medium text-slate-600">{crit.label}</td>
                    {selected.map((c, i) => (
                      <td key={c.slug} className={`p-4 ${winner === i ? "bg-emerald-50/70" : ""}`}>
                        {crit.type === "bool" ? (
                          values[i] ? (
                            <span className="badge bg-emerald-50 text-emerald-700"><Check size={12} /> Yes</span>
                          ) : (
                            <span className="badge bg-brand-50 text-brand-700"><Minus size={12} /> No</span>
                          )
                        ) : (
                          <span className={winner === i ? "font-semibold text-emerald-800" : ""}>
                            {crit.show(values[i], c)}
                            {winner === i && <Trophy size={13} className="ml-1.5 inline text-emerald-600" />}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {selected.length > 0 && (
        <p className="text-xs text-slate-500">
          <Trophy size={12} className="mr-1 inline text-emerald-600" /> marks the best value in each measurable row. Total outlay uses default living costs for {costs.map((k) => `${k.years} yrs`).join(" / ")} — adjust exact numbers in the <Link href="/calculator" className="font-semibold text-navy-700 underline">cost calculator</Link>. Exact total: {costs.map((k) => formatNpr(k.total)).join(" · ")}.
        </p>
      )}
    </div>
  );
}
