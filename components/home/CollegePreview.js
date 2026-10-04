"use client";
import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import CollegeCard from "@/components/colleges/CollegeCard";
import { ArrowRight, Globe2, Building2, Landmark } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function CollegePreview({ colleges = [] }) {
  const sectionRef = useRef(null);

  // Group colleges by region/country
  const nepalColleges = colleges.filter((c) => c.country === "Nepal").slice(0, 3);
  const indiaColleges = colleges.filter((c) => c.country === "India").slice(0, 3);
  
  // Pick UK, Germany, Australia for foreign universities section
  const foreignSlugs = ["university-of-manchester", "tum-germany", "unsw-sydney"];
  const foreignColleges = foreignSlugs
    .map((slug) => colleges.find((c) => c.slug === slug))
    .filter(Boolean);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".preview-heading", {
          autoAlpha: 0,
          y: 36,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: ".preview-heading", start: "top 82%", once: true },
        });

        ScrollTrigger.batch(".preview-card", {
          onEnter: (els) =>
            gsap.from(els, {
              autoAlpha: 0,
              y: 48,
              scale: 0.95,
              stagger: { each: 0.08, from: "start" },
              duration: 0.7,
              ease: "power3.out",
            }),
          start: "top 88%",
          once: true,
        });
      });
      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="container-page py-20 space-y-20">
      {/* ── Main Section Header ─────────────────────────────────────────── */}
      <div className="preview-heading flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-slate-800 pb-8">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
            Higher Education Transparency
          </p>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Explore Study Destinations by Region
          </h2>
          <p className="mt-2 text-sm text-slate-400 max-w-2xl">
            Real tuition, Bangalore PG rent, MoEST NOC fees, and post-study work rights converted live to NPR.
          </p>
        </div>
        <Link
          href="/colleges"
          className="inline-flex items-center gap-2 rounded-xl bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          View all 15+ universities <ArrowRight size={16} />
        </Link>
      </div>

      {/* ── 1. NEPAL UNIVERSITIES ────────────────────────────────────────── */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Landmark size={20} />
            </span>
            <div>
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                🇳🇵 Study in Nepal
              </h3>
              <p className="text-xs text-slate-400">
                Public & Autonomous Institutions (TU, KU, IOE Pulchowk) — Lowest Total Cost
              </p>
            </div>
          </div>
          <Link
            href="/colleges?tier=internal"
            className="text-xs font-semibold text-emerald-400 hover:underline hidden sm:inline-block"
          >
            Explore all Nepal options →
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {nepalColleges.map((c) => (
            <div key={c.slug} className="preview-card">
              <CollegeCard college={c} />
            </div>
          ))}
        </div>
      </div>

      {/* ── 2. INDIA (BANGALORE & DELHI HUBS) ────────────────────────────── */}
      <div className="space-y-6 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Building2 size={20} />
            </span>
            <div>
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                🇮🇳 Regional Study Hubs (Bangalore & Delhi)
              </h3>
              <p className="text-xs text-slate-400">
                Top choices for IT, Engineering & Management — No Student Visa Required
              </p>
            </div>
          </div>
          <Link
            href="/colleges?tier=regional_hub"
            className="text-xs font-semibold text-amber-400 hover:underline hidden sm:inline-block"
          >
            Explore all Bangalore/India hubs →
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {indiaColleges.map((c) => (
            <div key={c.slug} className="preview-card">
              <CollegeCard college={c} />
            </div>
          ))}
        </div>
      </div>

      {/* ── 3. INTERNATIONAL DESTINATIONS (UK, GERMANY, AUSTRALIA) ──────── */}
      <div className="space-y-6 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Globe2 size={20} />
            </span>
            <div>
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                🌏 Global Study Destinations (UK 🇬🇧, Germany 🇩🇪, Australia 🇦🇺)
              </h3>
              <p className="text-xs text-slate-400">
                World-Ranked Universities with Legal Work Rights & Post-Study Work Visas
              </p>
            </div>
          </div>
          <Link
            href="/colleges?tier=international"
            className="text-xs font-semibold text-blue-400 hover:underline hidden sm:inline-block"
          >
            Explore all International destinations →
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {foreignColleges.map((c) => (
            <div key={c.slug} className="preview-card">
              <CollegeCard college={c} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
