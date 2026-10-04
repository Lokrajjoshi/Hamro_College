import { Suspense } from "react";
import { getColleges } from "@/lib/db";
import CalculatorView from "@/components/calculator/CalculatorView";

export const metadata = {
  title: "Cost Calculator",
  description: "Calculate the real total cost of studying abroad in NPR — tuition, rent, food, insurance, visa and travel.",
};

export default async function CalculatorPage() {
  const colleges = await getColleges();
  return (
    <div className="container-page py-12">
      <div className="mb-10">
        <p className="mb-1 text-sm font-semibold uppercase tracking-widest text-brand-600">Real-Cost Engine</p>
        <h1 className="section-title">Cost calculator</h1>
        <p className="mt-2 max-w-2xl text-slate-500">
          Use the sliders to adjust living costs and see how the total changes. Every figure is in
          Nepalese Rupees (NPR) so you can compare across countries directly.
        </p>
      </div>
      <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-slate-200" />}>
        <CalculatorView colleges={colleges} />
      </Suspense>
    </div>
  );
}
