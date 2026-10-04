import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";
import { getColleges, getCollegeBySlug, getReviews } from "@/lib/db";
import { formatNprShort, formatLocal } from "@/lib/format";
import { calculateCost } from "@/lib/costEngine";
import {
  MapPin,
  Star,
  GraduationCap,
  Briefcase,
  Shield,
  CheckCircle,
  XCircle,
  Building,
  Plane,
  Award,
  Users,
} from "lucide-react";
import CompareButton from "@/components/colleges/CompareButton";
import TierBadge from "@/components/colleges/TierBadge";
import ReviewSection from "@/components/colleges/ReviewSection";
import CollegeDetailAnimator from "@/components/colleges/CollegeDetailAnimator";

const CostCalculator = dynamic(() => import("@/components/calculator/CostCalculator"), { ssr: false });

export async function generateStaticParams() {
  const colleges = await getColleges();
  return colleges.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }) {
  const college = await getCollegeBySlug(params.slug);
  if (!college) return {};
  return {
    title: `${college.name} | Verified Nepali Student Guide & Real Costs in NPR`,
    description: college.description,
  };
}

export default async function CollegeDetailPage({ params }) {
  const [college, reviews] = await Promise.all([
    getCollegeBySlug(params.slug),
    getReviews(params.slug),
  ]);
  if (!college) notFound();

  const cost = calculateCost(college);
  const heroImage =
    college.image ||
    "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80";

  return (
    <CollegeDetailAnimator>
      {/* ── Enhanced Hero Banner with Real Campus Photography ───────────── */}
      <div className="relative overflow-hidden bg-slate-950 py-16 sm:py-24 text-white">
        {/* Background Campus Photo with Ambient Gradient */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt={`${college.name} campus view`}
            className="h-full w-full object-cover opacity-30 filter blur-[0.5px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40" />
        </div>

        <div className="container-page relative z-10">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div className="max-w-3xl">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <TierBadge tier={college.tier} />
                <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-200 backdrop-blur-md">
                  <Award size={13} className="text-amber-400" />
                  {college.accreditation}
                </span>
                {college.established && (
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-slate-300 backdrop-blur-md">
                    Est. {college.established}
                  </span>
                )}
                <span className="rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 text-xs font-semibold">
                  ✓ Verified Campus
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                {college.name}
              </h1>

              <p className="mt-3 flex flex-wrap items-center gap-2 text-sm sm:text-base text-slate-300">
                <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                  <MapPin size={16} /> {college.city}, {college.country}
                </span>
                {college.distanceKm > 0 && (
                  <>
                    <span className="text-slate-500">•</span>
                    <span className="inline-flex items-center gap-1 text-slate-300">
                      <Plane size={14} className="text-cyan-400" />
                      {college.distanceKm.toLocaleString()} km from Kathmandu ({college.connectivity})
                    </span>
                  </>
                )}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <CompareButton
                college={college}
                className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-bold text-white shadow-lg backdrop-blur-md transition hover:bg-white/20"
              />
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="detail-stats mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              {
                label: "Total Outlay (NPR)",
                value: formatNprShort(cost.total),
                sub: `${cost.years} years all-inclusive`,
                highlight: "text-emerald-400",
              },
              {
                label: "Avg. Starting Salary",
                value: cost.salaryNpr ? formatNprShort(cost.salaryNpr) : "—",
                sub: "Post-graduation / yr",
                highlight: "text-purple-400",
              },
              {
                label: "Annual Tuition",
                value: formatLocal(college.tuitionAnnual, college.currency),
                sub: `Base in ${college.currency}`,
                highlight: "text-white",
              },
              {
                label: "Legal Work Rights",
                value: college.workHoursPerWeek
                  ? `${college.workHoursPerWeek} h/wk`
                  : college.country === "Nepal"
                  ? "Standard"
                  : "0 hrs (Strict)",
                sub: college.workHoursPerWeek ? "Legal part-time" : "Illegal without sponsor",
                highlight: college.workHoursPerWeek ? "text-emerald-400" : "text-rose-400",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-xl backdrop-blur-md"
              >
                <p className="text-xs font-medium text-slate-400">{s.label}</p>
                <p className={`text-2xl font-black mt-1 ${s.highlight}`}>{s.value}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Content Grid ────────────────────────────────────────── */}
      <div className="container-page py-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          <div className="space-y-10">
            {/* About & Campus Photo Banner */}
            <section className="detail-section rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="mb-3 text-xl font-extrabold text-slate-900 dark:text-white">
                About the Institution
              </h2>
              <p className="leading-relaxed text-slate-700 dark:text-slate-300 text-sm sm:text-base">
                {college.description}
              </p>

              {college.highlights?.length > 0 && (
                <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Verified Key Highlights
                  </h3>
                  <ul className="flex flex-wrap gap-2">
                    {college.highlights.map((h) => (
                      <li
                        key={h}
                        className="rounded-lg bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20 px-3 py-1.5 text-xs font-semibold"
                      >
                        ✓ {h}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>

            {/* Courses Offered */}
            {college.courses?.length > 0 && (
              <section className="detail-section rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <h2 className="mb-4 text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <GraduationCap size={22} className="text-emerald-500" />
                  Popular Courses & Degrees
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {college.courses.map((c) => (
                    <div
                      key={c.title}
                      className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-800/50"
                    >
                      <p className="font-bold text-slate-900 dark:text-white text-sm">{c.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {c.level} Degree • {c.years} Years Duration
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Key Facts Matrix */}
            <section className="detail-section rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="mb-4 text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Building size={20} className="text-brand-600 dark:text-emerald-400" />
                Key Institutional Facts
              </h2>
              <dl className="grid gap-3 sm:grid-cols-2">
                {[
                  ["Affiliation / University Board", college.affiliation],
                  ["Minimum GPA Required", college.minGpa ? `${college.minGpa} GPA` : "Not specified"],
                  ["English Test Requirement", college.englishTest || "Not required"],
                  [
                    "Hostel Capacity",
                    college.hostelCapacity ? `${college.hostelCapacity.toLocaleString()} beds` : "—",
                  ],
                  [
                    "Active Nepali Students",
                    college.nepaliStudents != null
                      ? `${college.nepaliStudents.toLocaleString()} on campus`
                      : "Domestic Campus",
                  ],
                  [
                    "Nepali Alumni Network",
                    college.nepaliAlumni ? `${college.nepaliAlumni.toLocaleString()} graduates` : "—",
                  ],
                  [
                    "Post-Study Work Visa",
                    college.postStudyVisaYears
                      ? `Up to ${college.postStudyVisaYears} years`
                      : "0 years (India/Nepal)",
                  ],
                  ["Campus Safety Index", college.safetyIndex ? `${college.safetyIndex} / 10` : "—"],
                ].map(([label, val]) => (
                  <div
                    key={label}
                    className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-3 text-xs"
                  >
                    <dt className="text-slate-500 dark:text-slate-400">{label}</dt>
                    <dd className="font-bold text-slate-900 dark:text-slate-200 text-right">{val}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-6 flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold ${
                    college.installments
                      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30"
                      : "bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/30"
                  }`}
                >
                  {college.installments ? <CheckCircle size={14} /> : <XCircle size={14} />}
                  {college.installments
                    ? "Installment payment permitted (semester-wise)"
                    : "Full annual tuition advance demanded"}
                </span>
                {college.mandatoryPg && (
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 px-3 py-1.5 text-xs font-semibold">
                    <Shield size={14} /> PG rental needed due to limited hostel capacity
                  </span>
                )}
              </div>
            </section>

            {/* Student Reviews Section */}
            <section className="detail-section rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="mb-5 flex items-center gap-2 text-xl font-extrabold text-slate-900 dark:text-white">
                <Star size={22} className="text-amber-400 fill-amber-400" />
                Verified Student Reviews & Hidden Cost Disclosures
              </h2>
              <ReviewSection
                collegeSlug={college.slug}
                collegeName={college.name}
                initialReviews={reviews}
              />
            </section>
          </div>

          {/* Sticky Calculator Sidebar */}
          <aside className="detail-sidebar">
            <div className="sticky top-24">
              <CostCalculator college={college} compact />
            </div>
          </aside>
        </div>
      </div>
    </CollegeDetailAnimator>
  );
}
