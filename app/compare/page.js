import { getColleges } from "@/lib/db";
import CompareView from "@/components/compare/CompareView";

export const metadata = {
  title: "Compare Colleges",
  description: "Side-by-side comparison of up to 3 colleges across 12 criteria including total NPR cost, work rights and placement salaries.",
};

export default async function ComparePage() {
  const colleges = await getColleges();
  return (
    <div className="container-page py-12">
      <div className="mb-10">
        <p className="mb-1 text-sm font-semibold uppercase tracking-widest text-brand-600">Side by side</p>
        <h1 className="section-title">Compare colleges</h1>
        <p className="mt-2 text-slate-500">
          Add up to 3 colleges. A 🏆 marks the best value in each measurable row.
        </p>
      </div>
      <CompareView colleges={colleges} />
    </div>
  );
}
