"use client";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { calculateCost } from "@/lib/costEngine";
import { formatNprShort } from "@/lib/format";
import { useT } from "@/lib/i18n";
import CollegeCard from "./CollegeCard";

const SORTS = {
  cost_asc: { label: "Lowest total cost", fn: (a, b) => a._cost - b._cost },
  cost_desc: { label: "Highest total cost", fn: (a, b) => b._cost - a._cost },
  salary: { label: "Highest starting salary", fn: (a, b) => (b._salary || 0) - (a._salary || 0) },
  community: { label: "Largest Nepali community", fn: (a, b) => (b.nepaliStudents || 0) - (a.nepaliStudents || 0) },
  name: { label: "Name (A–Z)", fn: (a, b) => a.name.localeCompare(b.name) },
};

export default function CollegeExplorer({ colleges, initial = {} }) {
  const { t } = useT();
  const [q, setQ] = useState(initial.q || "");
  const [tier, setTier] = useState(initial.tier || "");
  const [country, setCountry] = useState(initial.country || "");
  const [sort, setSort] = useState("cost_asc");
  const [workOnly, setWorkOnly] = useState(false);

  // Precompute cost once per college
  const enriched = useMemo(
    () => colleges.map((c) => { const cost = calculateCost(c); return { ...c, _cost: cost.total, _salary: cost.salaryNpr }; }),
    [colleges]
  );
  const maxCost = Math.max(...enriched.map((c) => c._cost));
  const [budget, setBudget] = useState(maxCost);

  const countries = useMemo(() => [...new Set(colleges.map((c) => c.country))].sort(), [colleges]);

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    return enriched
      .filter((c) => !tier || c.tier === tier)
      .filter((c) => !country || c.country === country)
      .filter((c) => c._cost <= budget)
      .filter((c) => !workOnly || (c.workHoursPerWeek || 0) > 0)
      .filter((c) => {
        if (!query) return true;
        return [c.name, c.shortName, c.city, c.country, c.affiliation, ...(c.courses || []).map((x) => x.title)].join(" ").toLowerCase().includes(query);
      })
      .sort(SORTS[sort].fn);
  }, [enriched, q, tier, country, budget, workOnly, sort]);

  const hasFilters = q || tier || country || workOnly || budget < maxCost;
  function reset() {
    setQ(""); setTier(""); setCountry(""); setWorkOnly(false); setBudget(maxCost);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      {/* Filters */}
      <aside className="card h-fit space-y-5 p-5 lg:sticky lg:top-24">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-2 font-semibold"><SlidersHorizontal size={16} /> Filters</p>
          {hasFilters && <button onClick={reset} className="text-xs font-semibold text-brand-600">Reset</button>}
        </div>

        <div>
          <label className="label" htmlFor="q">Search</label>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-3 text-slate-400" />
            <input id="q" className="input pl-9" value={q} onChange={(e) => setQ(e.target.value)} placeholder="BCA, Bangalore, Australia…" />
          </div>
        </div>

        <div>
          <p className="label">Region</p>
          <div className="flex flex-wrap gap-2">
            {["", "internal", "regional_hub", "international"].map((id) => (
              <button
                key={id || "all"}
                onClick={() => setTier(id)}
                className={`badge cursor-pointer py-1.5 ${tier === id ? "bg-navy-700 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
              >
                {id ? t(`tier.${id}`) : "All"}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="label" htmlFor="country">Country</label>
          <select id="country" className="input" value={country} onChange={(e) => setCountry(e.target.value)}>
            <option value="">All countries</option>
            {countries.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="label" htmlFor="budget">Max total budget: <span className="font-bold text-navy-700">{formatNprShort(budget)}</span></label>
          <input id="budget" type="range" className="range" min={0} max={maxCost} step={100000} value={budget} onChange={(e) => setBudget(Number(e.target.value))} />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" className="h-4 w-4 accent-brand-600" checked={workOnly} onChange={(e) => setWorkOnly(e.target.checked)} />
          Only places where I can work part-time
        </label>
      </aside>

      {/* Results */}
      <section>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-600"><span className="font-bold text-slate-900">{results.length}</span> colleges found</p>
          <select className="input w-auto" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort">
            {Object.entries(SORTS).map(([id, s]) => <option key={id} value={id}>{s.label}</option>)}
          </select>
        </div>

        {results.length === 0 ? (
          <div className="card flex flex-col items-center p-12 text-center">
            <X className="mb-3 text-slate-300" size={40} />
            <p className="font-semibold">No colleges match these filters.</p>
            <button onClick={reset} className="btn-outline mt-4">Clear filters</button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((c) => <CollegeCard key={c.slug} college={c} />)}
          </div>
        )}
      </section>
    </div>
  );
}
