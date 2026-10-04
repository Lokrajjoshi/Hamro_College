import { getColleges } from "@/lib/db";
import CollegeExplorer from "@/components/colleges/CollegeExplorer";

export const metadata = {
  title: "Browse Colleges",
  description: "Find and filter colleges in Nepal, India, Australia, Canada, UK, USA and Japan with transparent NPR cost estimates.",
};

export default async function CollegesPage({ searchParams }) {
  const colleges = await getColleges();

  return (
    <div className="container-page py-12">
      <div className="mb-10">
        <p className="mb-1 text-sm font-semibold uppercase tracking-widest text-brand-600">
          {colleges.length} colleges verified
        </p>
        <h1 className="section-title">Find your college</h1>
        <p className="mt-2 text-slate-500">
          Filter by region, budget or work rights. Every cost is converted to NPR.
        </p>
      </div>
      <CollegeExplorer colleges={colleges} initial={searchParams} />
    </div>
  );
}
