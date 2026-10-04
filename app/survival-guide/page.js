import dynamic from "next/dynamic";
import { GUIDES } from "@/data/guides";
import { COLLEGES } from "@/data/colleges";
import { MISSIONS } from "@/data/places";
import SurvivalGuideClient from "@/components/guide/SurvivalGuideClient";

const MapLoader = dynamic(() => import("@/components/guide/MapLoader"), { ssr: false });

export const metadata = {
  title: "NOC & Survival Guide",
  description: "Step-by-step MoEST NOC checklist, India arrival guide, and pre-departure checklist for Nepali students going abroad.",
};

// Build map points: colleges + diplomatic missions
const MAP_POINTS = [
  ...COLLEGES.filter((c) => c.lat).map((c) => ({
    name: c.name,
    lat: c.lat,
    lng: c.lng,
    type: "college",
    subtitle: `${c.city}, ${c.country}`,
    href: `/colleges/${c.slug}`,
  })),
  ...MISSIONS,
];

export default function SurvivalGuidePage() {
  return (
    <div className="container-page py-12">
      <div className="mb-10">
        <p className="mb-1 text-sm font-semibold uppercase tracking-widest text-brand-600">
          Step-by-step
        </p>
        <h1 className="section-title">NOC & Survival Guide</h1>
        <p className="mt-2 max-w-2xl text-slate-500">
          All the paperwork and practical steps Nepali students need — from the MoEST NOC application to
          arriving in Bangalore or Sydney.
        </p>
      </div>

      <SurvivalGuideClient guides={GUIDES} />

      <div className="mt-16">
        <h2 className="section-title mb-6">Colleges and Nepali missions on the map</h2>
        <MapLoader points={MAP_POINTS} zoom={2} center={[25, 90]} height={480} />
        <p className="mt-3 text-xs text-slate-500">
          <span className="mr-3">🔵 College</span>
          <span>🔴 Nepali diplomatic mission</span>
          · Embassy hours and addresses: verify on{" "}
          <a href="https://mofa.gov.np" target="_blank" rel="noreferrer" className="font-semibold text-navy-700 underline">mofa.gov.np</a>
        </p>
      </div>
    </div>
  );
}
