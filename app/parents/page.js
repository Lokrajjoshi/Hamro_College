import { Suspense } from "react";
import { getColleges } from "@/lib/db";
import ParentsPlannerClient from "@/components/parents/ParentsPlannerClient";

export const metadata = {
  title: "Family Budget Planner",
  description: "Generate a printable NPR budget summary for bank education loan applications.",
};

export default async function ParentsPage() {
  const colleges = await getColleges();
  return (
    <div className="container-page py-12">
      <div className="mb-10">
        <p className="mb-1 text-sm font-semibold uppercase tracking-widest text-brand-600">
          For parents · अभिभावकका लागि
        </p>
        <h1 className="section-title">Family budget planner</h1>
        <p className="mt-2 max-w-2xl text-slate-500">
          Fill in your savings, expected scholarship and loan details. You'll get a plain-language NPR
          summary you can print and take to your bank.
        </p>
      </div>
      <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-slate-200" />}>
        <ParentsPlannerClient colleges={colleges} />
      </Suspense>
    </div>
  );
}
