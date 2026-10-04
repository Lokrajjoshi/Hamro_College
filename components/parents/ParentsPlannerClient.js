"use client";
import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Printer, TrendingUp, BookOpen } from "lucide-react";
import { calculateCost, calculateEmi } from "@/lib/costEngine";
import { formatNpr } from "@/lib/format";

gsap.registerPlugin(useGSAP);

export default function ParentsPlannerClient({ colleges }) {
  const params = useSearchParams();
  const initialSlug = params.get("college") || colleges[0]?.slug;
  const [collegeSlug, setCollegeSlug] = useState(initialSlug);
  const [savings, setSavings] = useState(500000);
  const [scholarship, setScholarship] = useState(0);
  const [interestRate, setInterestRate] = useState(10);
  const [tenureYears, setTenureYears] = useState(5);
  const containerRef = useRef(null);

  const college = colleges.find((c) => c.slug === collegeSlug) || colleges[0];
  const cost = calculateCost(college, { scholarshipPct: scholarship });
  const loanNeeded = Math.max(0, cost.total - savings);
  const emi = calculateEmi(loanNeeded, interestRate, tenureYears);

  useGSAP(
    () => {
      gsap.from(".parents-card", {
        autoAlpha: 0,
        y: 30,
        stagger: 0.12,
        duration: 0.6,
        ease: "power3.out",
      });
    },
    { scope: containerRef }
  );

  function handlePrint() {
    window.print();
  }

  return (
    <div ref={containerRef} className="grid gap-8 lg:grid-cols-[420px_1fr]">
      {/* ── Input panel ──────────────────────────────────────────── */}
      <div className="parents-card card h-fit space-y-5 p-6">
        <div>
          <label className="label" htmlFor="p-college">College</label>
          <select
            id="p-college"
            className="input"
            value={collegeSlug}
            onChange={(e) => setCollegeSlug(e.target.value)}
          >
            {colleges.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name} — {c.city}</option>
            ))}
          </select>
        </div>

        {[
          { id: "savings", label: "Family savings available", value: savings, set: setSavings, min: 0, max: 10000000, step: 50000 },
          { id: "scholarship", label: "Scholarship on tuition (%)", value: scholarship, set: setScholarship, min: 0, max: 100, step: 5, suffix: "%" },
          { id: "interest", label: "Loan interest rate (% per year)", value: interestRate, set: setInterestRate, min: 5, max: 20, step: 0.5, suffix: "%" },
          { id: "tenure", label: "Loan repayment period (years)", value: tenureYears, set: setTenureYears, min: 1, max: 15, step: 1, suffix: " yrs" },
        ].map(({ id, label, value, set, min, max, step, suffix }) => (
          <div key={id}>
            <div className="mb-1.5 flex justify-between text-sm">
              <label htmlFor={`p-${id}`} className="font-medium text-slate-700">{label}</label>
              <span className="font-bold text-navy-700">
                {suffix ? value + suffix : formatNpr(value)}
              </span>
            </div>
            <input
              id={`p-${id}`}
              type="range"
              className="range"
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={(e) => set(Number(e.target.value))}
            />
          </div>
        ))}

        <button
          onClick={handlePrint}
          className="btn-navy w-full no-print"
        >
          <Printer size={16} /> Print / Save as PDF
        </button>
      </div>

      {/* ── Report panel ─────────────────────────────────────────── */}
      <div id="parents-report" className="parents-card space-y-6">
        {/* Printable header */}
        <div className="print-only mb-6 border-b pb-4">
          <h2 className="text-2xl font-bold">Education Budget Report · Hamro College</h2>
          <p className="text-slate-500">Prepared for bank education loan application · {new Date().toLocaleDateString("en-NP")}</p>
        </div>

        {/* Summary cards */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Total estimated cost", value: formatNpr(cost.total), sub: `${cost.years} yrs in ${college.city}`, icon: BookOpen, accent: "bg-brand-50 text-brand-700" },
            { label: "Family savings", value: formatNpr(savings), sub: "Available upfront", accent: "bg-emerald-50 text-emerald-700" },
            { label: "Loan required", value: formatNpr(loanNeeded), sub: "After savings & scholarship", accent: "bg-amber-50 text-amber-700" },
            { label: "Monthly EMI", value: formatNpr(emi.emi), sub: `${tenureYears} yr repayment @ ${interestRate}%`, icon: TrendingUp, accent: "bg-navy-50 text-navy-700" },
          ].map((s) => (
            <div key={s.label} className={`rounded-2xl p-5 ${s.accent}`}>
              <p className="text-xs font-semibold opacity-70">{s.label}</p>
              <p className="my-1 text-2xl font-bold">{s.value}</p>
              <p className="text-xs opacity-60">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Year-by-year breakdown */}
        <div className="card overflow-hidden">
          <div className="border-b border-slate-100 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-600">
            Year-by-year cost breakdown (NPR)
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs text-slate-500">
                <th className="p-3 text-left">Year</th>
                <th className="p-3 text-right">Tuition</th>
                <th className="p-3 text-right">Living</th>
                <th className="p-3 text-right">Other</th>
                <th className="p-3 text-right font-semibold text-slate-700">Total</th>
              </tr>
            </thead>
            <tbody>
              {cost.yearly.map((y, i) => (
                <tr key={y.year} className={i % 2 ? "bg-slate-50" : "bg-white"}>
                  <td className="p-3 font-medium">Year {y.year}</td>
                  <td className="p-3 text-right">{formatNpr(y.tuition)}</td>
                  <td className="p-3 text-right">{formatNpr(y.living)}</td>
                  <td className="p-3 text-right">{formatNpr(y.insurance + y.oneTime)}</td>
                  <td className="p-3 text-right font-semibold">{formatNpr(y.total)}</td>
                </tr>
              ))}
              <tr className="border-t-2 border-slate-300 bg-navy-50 font-bold">
                <td className="p-3">Grand total</td>
                <td className="p-3 text-right">{formatNpr(cost.breakdown.tuition)}</td>
                <td className="p-3 text-right">{formatNpr(cost.breakdown.living)}</td>
                <td className="p-3 text-right">{formatNpr(cost.breakdown.insurance + cost.breakdown.oneTime)}</td>
                <td className="p-3 text-right text-brand-700">{formatNpr(cost.total)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Plain-language summary */}
        <div className="card border-navy-200 bg-navy-50 p-6">
          <h3 className="mb-3 font-bold text-navy-900">Plain-language summary</h3>
          <p className="text-sm leading-relaxed text-slate-700">
            Your child plans to study at <strong>{college.name}</strong> in {college.city}, {college.country}
            {college.durationYears && ` for ${college.durationYears} years`}.
            The total estimated cost — including tuition, accommodation, food, insurance and one-time fees —
            is <strong>{formatNpr(cost.total)}</strong>.
            With family savings of <strong>{formatNpr(savings)}</strong>
            {scholarship > 0 && ` and a ${scholarship}% scholarship`},
            a loan of approximately <strong>{formatNpr(loanNeeded)}</strong> will be needed.
            At {interestRate}% annual interest repaid over {tenureYears} years, the monthly installment
            will be <strong>{formatNpr(emi.emi)}</strong> (total interest payable: {formatNpr(emi.totalInterest)}).
          </p>
          <p className="mt-3 text-xs text-slate-500">
            All figures are estimates. Actual costs may vary. Verify tuition and fees directly with {college.name} before applying for a loan.
          </p>
        </div>
      </div>
    </div>
  );
}
