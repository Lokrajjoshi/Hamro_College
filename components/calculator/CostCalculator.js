"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Bar, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell } from "recharts";
import { Users } from "lucide-react";
import { calculateCost } from "@/lib/costEngine";
import { rateToNpr } from "@/lib/currency";
import { formatNpr, formatNprShort, formatLocal } from "@/lib/format";

const COLORS = { tuition: "#003893", living: "#10b981", insurance: "#f59e0b", oneTime: "#c8102e" };
const LABELS = { tuition: "Tuition", living: "Rent & food", insurance: "Insurance", oneTime: "Visa, NOC, travel & admission" };

function Slider({ id, label, value, display, ...props }) {
  return (
    <div>
      <div className="mb-1.5 flex justify-between text-sm">
        <label htmlFor={id} className="font-medium text-slate-700">{label}</label>
        <span className="font-semibold text-navy-700">{display}</span>
      </div>
      <input id={id} type="range" className="range" value={value} {...props} />
    </div>
  );
}

export default function CostCalculator({ college, compact = false }) {
  const base = calculateCost(college);
  const [years, setYears] = useState(base.years);
  const [monthlyPg, setMonthlyPg] = useState(base.defaults.monthlyPg);
  const [monthlyFood, setMonthlyFood] = useState(base.defaults.monthlyFood);
  const [scholarshipPct, setScholarshipPct] = useState(0);
  const [includeInsurance, setIncludeInsurance] = useState(true);
  const [includeVisa, setIncludeVisa] = useState(true);
  const [includeTravel, setIncludeTravel] = useState(true);

  // Reset when the user switches college
  useEffect(() => {
    const b = calculateCost(college);
    setYears(b.years);
    setMonthlyPg(b.defaults.monthlyPg);
    setMonthlyFood(b.defaults.monthlyFood);
    setScholarshipPct(0);
  }, [college]);

  const cost = calculateCost(college, { years, monthlyPg, monthlyFood, scholarshipPct, includeInsurance, includeVisa, includeTravel });
  const pieData = Object.entries(cost.breakdown).filter(([, v]) => v > 0).map(([key, value]) => ({ key, name: LABELS[key], value }));
  const pgMax = Math.max(150000, base.defaults.monthlyPg * 2);
  const foodMax = Math.max(60000, base.defaults.monthlyFood * 2);
  const isAbroad = college.country !== "Nepal";

  return (
    <div className="card overflow-hidden">
      <div className="border-b border-slate-100 bg-gradient-to-r from-navy-900 to-navy-700 p-5 text-white">
        <p className="text-sm text-slate-300">Real-Cost Engine</p>
        <h3 className="text-xl font-bold">{college.name}</h3>
        <p className="mt-1 text-sm text-slate-300">
          Tuition {formatLocal(college.tuitionAnnual, college.currency)}/yr
          {college.currency !== "NPR" && <> · 1 {college.currency} = रु {rateToNpr(college.currency)}</>}
        </p>
      </div>

      <div className={`grid gap-6 p-5 ${compact ? "" : "lg:grid-cols-[340px_1fr]"}`}>
        {/* Controls */}
        <div className="space-y-5">
          <Slider id="years" label="Program length" value={years} min={1} max={6} step={0.5} display={`${years} yrs`} onChange={(e) => setYears(Number(e.target.value))} />
          <Slider id="pg" label="Monthly rent (PG / hostel)" value={monthlyPg} min={3000} max={pgMax} step={1000} display={formatNpr(monthlyPg)} onChange={(e) => setMonthlyPg(Number(e.target.value))} />
          <Slider id="food" label="Monthly food / mess" value={monthlyFood} min={3000} max={foodMax} step={500} display={formatNpr(monthlyFood)} onChange={(e) => setMonthlyFood(Number(e.target.value))} />
          <Slider id="scholarship" label="Scholarship on tuition" value={scholarshipPct} min={0} max={100} step={5} display={`${scholarshipPct}%`} onChange={(e) => setScholarshipPct(Number(e.target.value))} />

          <div className="space-y-2 rounded-xl bg-slate-50 p-3 text-sm">
            <label className="flex items-center gap-2"><input type="checkbox" className="h-4 w-4 accent-brand-600" checked={includeInsurance} onChange={(e) => setIncludeInsurance(e.target.checked)} /> Health insurance</label>
            {isAbroad && <label className="flex items-center gap-2"><input type="checkbox" className="h-4 w-4 accent-brand-600" checked={includeVisa} onChange={(e) => setIncludeVisa(e.target.checked)} /> Visa + MoEST NOC fees</label>}
            <label className="flex items-center gap-2"><input type="checkbox" className="h-4 w-4 accent-brand-600" checked={includeTravel} onChange={(e) => setIncludeTravel(e.target.checked)} /> First journey from Kathmandu</label>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-brand-50 p-4">
              <p className="text-xs font-medium text-brand-700">Total cost ({years} yrs)</p>
              <p className="text-2xl font-bold text-brand-700">{formatNprShort(cost.total)}</p>
              <p className="text-xs text-slate-500">{formatNpr(cost.total)}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-medium text-slate-500">Expected starting salary</p>
              <p className="text-2xl font-bold">{cost.salaryNpr ? formatNprShort(cost.salaryNpr) : "—"}</p>
              <p className="text-xs text-slate-500">per year (gross)</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-medium text-slate-500">Salary-years to recover</p>
              <p className="text-2xl font-bold">{cost.paybackYears ?? "—"}</p>
              <p className="text-xs text-slate-500">total cost ÷ yearly salary</p>
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={cost.yearly} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={formatNprShort} tick={{ fontSize: 11 }} width={70} />
                <Tooltip formatter={(v) => formatNpr(v)} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                {Object.keys(COLORS).map((key, i, arr) => (
                  <Bar key={key} dataKey={key} name={LABELS[key]} stackId="a" fill={COLORS[key]} radius={i === arr.length - 1 ? [6, 6, 0, 0] : 0} />
                ))}
                <Line type="monotone" dataKey="cumulative" name="Running total" stroke="#0b1f4d" strokeWidth={2} dot={{ r: 3 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {!compact && (
            <div className="grid items-center gap-4 sm:grid-cols-[180px_1fr]">
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={2}>
                      {pieData.map((d) => <Cell key={d.key} fill={COLORS[d.key]} />)}
                    </Pie>
                    <Tooltip formatter={(v) => formatNpr(v)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="space-y-2 text-sm">
                {Object.entries(cost.breakdown).map(([key, value]) => (
                  <li key={key} className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2">
                    <span className="flex items-center gap-2"><span className="h-3 w-3 rounded-sm" style={{ background: COLORS[key] }} /> {LABELS[key]}</span>
                    <span className="font-semibold">{formatNpr(value)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Link href={`/parents?college=${college.slug}`} className="btn-outline w-full sm:w-auto">
            <Users size={16} /> Make a family budget report from this
          </Link>
        </div>
      </div>
    </div>
  );
}
