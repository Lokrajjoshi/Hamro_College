"use client";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { BarChart3, ShieldCheck, BookOpen, MapPin, Users, ChevronLeft, ChevronRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const FEATURES = [
  {
    icon: BarChart3,
    title: "Real-Cost Engine",
    body: "Tuition, rent, food, insurance, visa and travel — all converted to NPR for every college. Adjust sliders to see your personal estimate.",
    color: "text-brand-600",
    bg: "bg-brand-50",
  },
  {
    icon: ShieldCheck,
    title: "Verified Reviews",
    body: "Every review is tagged with a verification type: university email, student ID or uploaded document. Unverified ratings are clearly marked.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: BookOpen,
    title: "NOC & Survival Guide",
    body: "Step-by-step MoEST NOC checklist, SIM card setup for India and pre-departure guide for Australia/Canada/UK — with progress saved locally.",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    icon: MapPin,
    title: "Interactive Map",
    body: "See Nepali diplomatic missions and colleges on an OpenStreetMap base layer. No API key required.",
    color: "text-navy-700",
    bg: "bg-navy-50",
  },
  {
    icon: Users,
    title: "Parent Budget Planner",
    body: "Enter savings, loan interest rate and repayment period. Get a printable NPR report with EMI calculations — perfect for bank loan applications.",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
];

export default function FeaturesScroll() {
  const outerRef = useRef(null);
  const scrollContainerRef = useRef(null);

  function scroll(direction) {
    const container = scrollContainerRef.current;
    if (!container) return;
    const scrollAmount = direction === "left" ? -360 : 360;
    container.scrollBy({ left: scrollAmount, behavior: "smooth" });
  }

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        {
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (ctx) => {
          if (ctx.conditions.reduceMotion) return;

          gsap.from(".feature-card", {
            autoAlpha: 0,
            y: 40,
            stagger: 0.1,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: outerRef.current,
              start: "top 80%",
              once: true,
            },
          });
        }
      );
      return () => mm.revert();
    },
    { scope: outerRef }
  );

  return (
    <section ref={outerRef} className="overflow-hidden bg-slate-950 py-20">
      <div className="container-page">
        {/* Header with Navigation Controls */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-8">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-brand-400">
              Built for Nepali Students & Families
            </p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Everything in One Place
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Use touchpad, mouse drag, or the arrow buttons below to explore features.
            </p>
          </div>

          {/* Interactive Left / Right Scroll Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => scroll("left")}
              aria-label="Scroll left"
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 text-white transition hover:bg-slate-800 hover:border-emerald-500 active:scale-95 shadow-lg"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={() => scroll("right")}
              aria-label="Scroll right"
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900 text-white transition hover:bg-slate-800 hover:border-emerald-500 active:scale-95 shadow-lg"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </div>

        {/* Scrollable Container (Touchpad + Wheel + Touch Drag Native Support) */}
        <div
          ref={scrollContainerRef}
          className="flex snap-x snap-mandatory overflow-x-auto pb-6 pt-2 scrollbar-none gap-6"
          style={{ scrollBehavior: "smooth", WebkitOverflowScrolling: "touch" }}
        >
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="feature-card flex w-[300px] sm:w-[340px] shrink-0 snap-start flex-col rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-xl transition-all duration-300 hover:border-slate-700 hover:bg-slate-900"
              >
                <span className={`mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl ${f.bg}`}>
                  <Icon size={24} className={f.color} />
                </span>
                <h3 className="mb-3 text-xl font-bold text-white">{f.title}</h3>
                <p className="text-sm leading-relaxed text-slate-300">{f.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
