"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import CostCalculator from "./CostCalculator";

export default function CalculatorView({ colleges }) {
  const params = useSearchParams();
  const initialSlug = params.get("college");
  const [slug, setSlug] = useState(colleges.some((c) => c.slug === initialSlug) ? initialSlug : colleges[0]?.slug);
  const college = colleges.find((c) => c.slug === slug);

  return (
    <div className="space-y-6">
      <div className="card p-5">
        <label htmlFor="college-select" className="label">Choose a college</label>
        <select id="college-select" className="input" value={slug} onChange={(e) => setSlug(e.target.value)}>
          {["internal", "regional_hub", "international"].map((tier) => (
            <optgroup key={tier} label={{ internal: "Nepal", regional_hub: "India", international: "International" }[tier]}>
              {colleges.filter((c) => c.tier === tier).map((c) => (
                <option key={c.slug} value={c.slug}>{c.name} — {c.city}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>
      {college && <CostCalculator college={college} />}
    </div>
  );
}
