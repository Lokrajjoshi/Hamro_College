"use client";
import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Search, Sparkles, ShieldCheck, Banknote, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useT } from "@/lib/i18n";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Only render the WebGL globe in the browser
const Globe3D = dynamic(() => import("./Globe3D"), {
  ssr: false,
  loading: () => <div className="h-full w-full" />,
});

const TIER_PILLS = [
  { href: "/colleges?tier=internal", label: "🇳🇵 Nepal (TU, KU, IOE)", color: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30" },
  { href: "/colleges?tier=regional_hub", label: "🇮🇳 Bangalore & Delhi Hubs", color: "bg-amber-500/10 text-amber-300 border-amber-500/30" },
  { href: "/colleges?tier=international", label: "🌏 Australia, Canada, US, UK", color: "bg-blue-500/10 text-blue-300 border-blue-500/30" },
];

export default function HeroSection() {
  const { t } = useT();
  const router = useRouter();
  const [q, setQ] = useState("");
  const containerRef = useRef(null);
  const globeRef = useRef(null);
  const textRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 1024px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          const { reduceMotion } = ctx.conditions;
          if (reduceMotion) return;

          // ── Initial entrance timeline ──────────────────────────
          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

          tl.from(".hero-ticker", { autoAlpha: 0, y: -20, duration: 0.6 })
            .from(".hero-eyebrow", { autoAlpha: 0, y: 20, duration: 0.7 }, "-=0.3")
            .from(".hero-word", { autoAlpha: 0, y: 40, stagger: 0.06, duration: 0.7 }, "-=0.3")
            .from(".hero-sub", { autoAlpha: 0, y: 24, duration: 0.6 }, "-=0.4")
            .from(".hero-search", { autoAlpha: 0, y: 20, scale: 0.97, duration: 0.5 }, "-=0.3")
            .from(".hero-pill", { autoAlpha: 0, y: 16, scale: 0.92, stagger: 0.1, duration: 0.4 }, "-=0.2")
            .from(globeRef.current, { autoAlpha: 0, scale: 0.7, rotationY: -30, duration: 1.1, ease: "back.out(1.2)" }, 0.2);

          // ── ScrollTrigger: parallax the globe upward on scroll ─
          gsap.to(globeRef.current, {
            y: -100,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: "bottom top",
              scrub: 1.2,
            },
          });

          // ── ScrollTrigger: fade text out as user scrolls away ──
          gsap.to(textRef.current, {
            autoAlpha: 0,
            y: -60,
            ease: "none",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "30% top",
              end: "70% top",
              scrub: 1,
            },
          });
        }
      );

      return () => mm.revert();
    },
    { scope: containerRef }
  );

  function handleSearch(e) {
    e.preventDefault();
    router.push(`/colleges?q=${encodeURIComponent(q.trim())}`);
  }

  const headline = t("hero.title") || "Compare Colleges With True Costs In NPR";
  const words = headline.split(" ");

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-[94vh] items-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-navy-950"
    >
      {/* ── 3D Globe Background (WebGL) ─────────────────────────── */}
      <div
        ref={globeRef}
        className="pointer-events-none absolute right-0 top-0 h-full w-full opacity-85 lg:w-1/2"
        style={{ willChange: "transform" }}
      >
        <Globe3D className="h-full w-full" />
      </div>

      {/* Gradient overlay so text reads cleanly */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent lg:via-slate-950/75" />

      {/* ── Main Text Content ────────────────────────────────────── */}
      <div ref={textRef} className="container-page relative z-10 py-16 sm:py-24">
        <div className="max-w-3xl">
          {/* Live Peg Ticker */}
          <div className="hero-ticker mb-6 inline-flex flex-wrap items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-300 backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Official NRB Peg: ₹1 INR = रु 1.60 NPR</span>
            <span className="text-emerald-500/50">•</span>
            <span className="hidden sm:inline">AUD/NPR = 88.50</span>
            <span className="text-emerald-500/50 hidden sm:inline">•</span>
            <span>MoEST NOC: रु २,०००</span>
          </div>

          <div className="mb-4">
            <p className="hero-eyebrow inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
              <Sparkles size={14} className="text-amber-400" />
              {t("hero.eyebrow") || "The Zero-Commission Higher Education Navigator"}
            </p>
          </div>

          <h1 className="mb-6 text-4xl font-black leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
            {words.map((w, i) => (
              <span key={i} className="hero-word mr-[0.25em] inline-block">
                {w}
              </span>
            ))}
          </h1>

          <p className="hero-sub mb-8 max-w-2xl text-base sm:text-lg leading-relaxed text-slate-300">
            {t("hero.subtitle") ||
              "Dismantling hidden consultancy commissions. Calculate all-inclusive costs (Tuition + Bangalore PG rent + MoEST NOC + Insurance) converted live to Nepalese Rupees."}
          </p>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="hero-search mb-6 flex max-w-xl overflow-hidden rounded-2xl border border-slate-700 bg-slate-900/95 p-1.5 shadow-2xl shadow-black/50 backdrop-blur-md"
          >
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="h-12 w-full bg-transparent pl-11 pr-4 text-sm font-medium text-white outline-none placeholder:text-slate-500"
                placeholder={t("hero.search") || "Search CHRIST, RVCE, UTS Sydney, Pulchowk..."}
                aria-label="Search colleges"
              />
            </div>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-6 text-sm font-bold text-slate-950 transition hover:bg-emerald-400"
            >
              {t("hero.cta") || "Explore"} <ArrowRight size={14} />
            </button>
          </form>

          {/* Quick Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 mb-8">
            {TIER_PILLS.map((p) => (
              <a
                key={p.href}
                href={p.href}
                className={`hero-pill rounded-full border px-4 py-1.5 text-xs font-semibold transition hover:scale-105 ${p.color}`}
              >
                {p.label}
              </a>
            ))}
          </div>

          {/* Trust Value Props */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
            <span className="flex items-center gap-1.5 text-slate-300">
              <ShieldCheck size={14} className="text-emerald-400" /> 100% Anti-Middleman
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Banknote size={14} className="text-blue-400" /> Real Cost In NPR
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Sparkles size={14} className="text-purple-400" /> Verified Nepali Student Network
            </span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce text-slate-500" aria-hidden="true">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </section>
  );
}
