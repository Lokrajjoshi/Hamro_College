"use client";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function CollegeDetailAnimator({ children }) {
  const ref = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Hero entrance
        gsap.from(".detail-hero", { autoAlpha: 0, y: -30, duration: 0.7, ease: "power3.out" });

        // Stats bar items
        gsap.from(".detail-stats > *", {
          autoAlpha: 0,
          y: 20,
          stagger: 0.1,
          duration: 0.5,
          ease: "power2.out",
          delay: 0.3,
        });

        // Sidebar slides in from the right
        gsap.from(".detail-sidebar", {
          autoAlpha: 0,
          x: 40,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.4,
        });

        // Content sections reveal as user scrolls
        ScrollTrigger.batch(".detail-section", {
          onEnter: (els) =>
            gsap.from(els, {
              autoAlpha: 0,
              y: 32,
              stagger: 0.12,
              duration: 0.65,
              ease: "power2.out",
            }),
          start: "top 88%",
          once: true,
        });
      });
      return () => mm.revert();
    },
    { scope: ref }
  );

  return <div ref={ref}>{children}</div>;
}
