"use client";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const STATS = [
  { value: 13, suffix: "", label: "Colleges profiled" },
  { value: 7, suffix: "", label: "Countries covered" },
  { value: 100, suffix: "%", label: "Commission-free" },
  { value: 12, suffix: "", label: "Comparison criteria" },
];

export default function StatsRow() {
  const rowRef = useRef(null);
  const numsRef = useRef([]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Slide the whole row up
        gsap.from(rowRef.current, {
          autoAlpha: 0,
          y: 50,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: rowRef.current,
            start: "top 85%",
            once: true,
          },
        });

        // Count up each number
        numsRef.current.forEach((el, i) => {
          if (!el) return;
          const target = STATS[i].value;
          gsap.from({ val: 0 }, {
            val: target,
            duration: 1.6,
            ease: "power2.out",
            delay: i * 0.12,
            scrollTrigger: {
              trigger: rowRef.current,
              start: "top 85%",
              once: true,
            },
            onUpdate() {
              el.textContent = Math.round(this.targets()[0].val) + STATS[i].suffix;
            },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: rowRef }
  );

  return (
    <section ref={rowRef} className="bg-navy-900 py-14">
      <div className="container-page grid grid-cols-2 gap-8 sm:grid-cols-4">
        {STATS.map((s, i) => (
          <div key={s.label} className="text-center">
            <p
              ref={(el) => (numsRef.current[i] = el)}
              className="text-5xl font-extrabold text-white"
            >
              0{s.suffix}
            </p>
            <p className="mt-1 text-sm text-slate-400">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
