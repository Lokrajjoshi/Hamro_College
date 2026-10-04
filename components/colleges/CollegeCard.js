"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Users, Briefcase, TrendingUp, ShieldCheck, Plane, ArrowRight } from "lucide-react";
import { calculateCost } from "@/lib/costEngine";
import { formatNprShort } from "@/lib/format";
import { useT } from "@/lib/i18n";
import TierBadge from "./TierBadge";
import CompareButton from "./CompareButton";

export default function CollegeCard({ college }) {
  const { t } = useT();
  const cost = calculateCost(college);
  const [imgSrc, setImgSrc] = useState(
    college.image ||
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80"
  );

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-slate-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
      {/* ── Visual Image Banner ───────────────────────────── */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt={`${college.name} campus`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() =>
            setImgSrc("https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1000&q=80")
          }
        />
        {/* Subtle Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

        {/* Top Badges */}
        <div className="absolute left-3 right-3 top-3 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
            <MapPin size={12} className="text-emerald-400" />
            {college.city}, {college.country}
          </span>
          <TierBadge tier={college.tier} />
        </div>

        {/* Bottom Floating Stats over Image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-600/90 px-2 py-0.5 font-bold tracking-wide shadow">
            <ShieldCheck size={12} />
            {college.accreditation || "Accredited"}
          </span>
          {college.distanceKm > 0 && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-200">
              <Plane size={11} className="text-cyan-300" />
              {college.distanceKm.toLocaleString()} km from KTM
            </span>
          )}
        </div>
      </div>

      {/* ── Main Card Body ───────────────────────────────── */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3">
          <Link
            href={`/colleges/${college.slug}`}
            className="line-clamp-1 text-lg font-bold tracking-tight text-slate-900 transition hover:text-brand-600 dark:text-white dark:hover:text-brand-400"
          >
            {college.name}
          </Link>
          <p className="line-clamp-1 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {college.affiliation}
          </p>
        </div>

        {/* Real Cost Highlight Box */}
        <div className="mb-4 rounded-xl border border-emerald-500/20 bg-emerald-50/60 p-3 dark:border-emerald-500/30 dark:bg-emerald-950/20">
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
              {t("common.totalCost")} ({cost.years} yrs)
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              ≈ {formatNprShort(cost.perYear)} / yr
            </span>
          </div>
          <p className="text-2xl font-black text-slate-950 dark:text-emerald-300 mt-0.5">
            {formatNprShort(cost.total)}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Includes Tuition + PG Rent + Mess + Insurance in NPR
          </p>
        </div>

        {/* 3 Metrics Grid */}
        <dl className="mb-5 grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-2.5 text-center text-xs dark:bg-slate-800/60">
          <div className="border-r border-slate-200 dark:border-slate-700/60 pr-1">
            <dt className="flex items-center justify-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
              <TrendingUp size={11} className="text-emerald-500" /> Salary
            </dt>
            <dd className="font-bold text-slate-900 dark:text-white mt-0.5">
              {formatNprShort(cost.salaryNpr)}
            </dd>
          </div>
          <div className="border-r border-slate-200 dark:border-slate-700/60 px-1">
            <dt className="flex items-center justify-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
              <Users size={11} className="text-blue-500" /> Nepali
            </dt>
            <dd className="font-bold text-slate-900 dark:text-white mt-0.5">
              {college.nepaliStudents != null ? `${college.nepaliStudents}` : "Home"}
            </dd>
          </div>
          <div className="pl-1">
            <dt className="flex items-center justify-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
              <Briefcase size={11} className="text-purple-500" /> Work Rights
            </dt>
            <dd
              className={`font-bold mt-0.5 ${
                college.workHoursPerWeek && college.workHoursPerWeek > 0
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-rose-600 dark:text-rose-400"
              }`}
            >
              {college.workHoursPerWeek ? `${college.workHoursPerWeek} h/wk` : "0 h (No)"}
            </dd>
          </div>
        </dl>

        {/* Action Buttons */}
        <div className="mt-auto flex items-center gap-2 pt-2">
          <Link
            href={`/colleges/${college.slug}`}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
          >
            {t("common.details")} <ArrowRight size={13} />
          </Link>
          <CompareButton college={college} />
        </div>
      </div>
    </article>
  );
}
