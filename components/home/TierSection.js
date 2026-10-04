"use client";
import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useT } from "@/lib/i18n";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const TIERS = [
  {
    id: "internal",
    emoji: "🏔️",
    bg: "from-emerald-900 to-emerald-800",
    accent: "text-emerald-300",
    border: "border-emerald-700/50",
    descKey: "tier.internal.desc",
    stats: "3 colleges · Lowest cost",
  },
  {
    id: "regional_hub",
    emoji: "🏙️",
    bg: "from-amber-900 to-amber-800",
    accent: "text-amber-300",
    border: "border-amber-700/50",
    descKey: "tier.regional_hub.desc",
    stats: "4 colleges · No visa needed",
  },
  {
    id: "international",
    emoji: "✈️",
    bg: "from-navy-800 to-navy-900",
    accent: "text-blue-300",
    border: "border-navy-600/50",
    descKey: "tier.international.desc",
    stats: "6 colleges · Work while studying",
  },
];

function TiltCard({ tier, t }) {
  const cardRef = useRef(null);

  function handleMouseMove(e) {
    const card = cardRef.current;
    if (!card) return;
    const { left, top, width, height } = card.getBoundingClientRect();
    const x = ((e.clientX - left) / width - 0.5) * 18;
    const y = ((e.clientY - top) / height - 0.5) * -12;
    gsap.to(card, { rotationY: x, rotationX: y, duration: 0.3, ease: "power2.out", transformPerspective: 800 });
  }

  function handleMouseLeave() {
    gsap.to(cardRef.current, { rotationY: 0, rotationX: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" });
  }

  return (
    <Link
      href={`/colleges?tier=${tier.id}`}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`tier-card group relative flex flex-col overflow-hidden rounded-3xl border ${tier.border} bg-gradient-to-br ${tier.bg} p-7 shadow-xl transition-shadow hover:shadow-2xl`}
      style={{ transformStyle: "preserve-3d", willChange: "transform" }}
    >
      {/* Sheen overlay that follows the tilt */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

      <span className="mb-5 inline-block text-5xl">{tier.emoji}</span>
      <h3 className={`mb-2 text-2xl font-bold ${tier.accent}`}>{t(`tier.${tier.id}`)}</h3>
      <p className="mb-4 flex-1 text-slate-300">{t(tier.descKey)}</p>
      <p className="text-xs font-semibold text-slate-400">{tier.stats}</p>

      <span className={`mt-5 inline-flex items-center gap-1 text-sm font-semibold ${tier.accent}`}>
        Explore →
      </span>
    </Link>
  );
}

export default function TierSection() {
  const { t } = useT();
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".tier-section-header", {
          autoAlpha: 0,
          y: 40,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: ".tier-section-header", start: "top 80%", once: true },
        });

        ScrollTrigger.batch(".tier-card", {
          onEnter: (els) =>
            gsap.from(els, {
              autoAlpha: 0,
              y: 60,
              scale: 0.94,
              stagger: 0.15,
              duration: 0.8,
              ease: "power3.out",
            }),
          start: "top 85%",
          once: true,
        });
      });
      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="container-page py-24">
      <div className="tier-section-header mb-12 text-center">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-brand-600">Where are you going?</p>
        <h2 className="section-title">Three paths. One transparent guide.</h2>
      </div>
      <div className="grid gap-6 sm:grid-cols-3">
        {TIERS.map((tier) => (
          <TiltCard key={tier.id} tier={tier} t={t} />
        ))}
      </div>
    </section>
  );
}
