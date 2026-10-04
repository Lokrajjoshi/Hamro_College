"use client";
import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ChevronDown, Check, ExternalLink, Clock, FileText } from "lucide-react";
import { formatNpr } from "@/lib/format";
import { useLocaleStore } from "@/store/useLocaleStore";
import { useHydrated } from "@/lib/useHydrated";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const STORAGE_KEY = "hamro-guide-progress";

function getProgress() {
  try { return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")); }
  catch { return new Set(); }
}
function saveProgress(set) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...set])); } catch {}
}

function GuideStep({ step, locale, index }) {
  const id = step.id;
  const label = locale === "ne" && step.title.ne ? step.title.ne : step.title.en;
  const body = locale === "ne" && step.body?.ne ? step.body.ne : step.body?.en || "";
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(() => getProgress().has(id));
  const bodyRef = useRef(null);

  function toggleOpen() {
    const next = !open;
    setOpen(next);
    if (bodyRef.current) {
      if (next) {
        gsap.fromTo(bodyRef.current, { height: 0, autoAlpha: 0 }, { height: "auto", autoAlpha: 1, duration: 0.35, ease: "power2.out" });
      } else {
        gsap.to(bodyRef.current, { height: 0, autoAlpha: 0, duration: 0.25, ease: "power2.in" });
      }
    }
  }

  function toggleDone(e) {
    e.stopPropagation();
    const next = !done;
    setDone(next);
    const progress = getProgress();
    if (next) progress.add(id); else progress.delete(id);
    saveProgress(progress);
  }

  return (
    <li className="guide-step overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <button
        onClick={toggleOpen}
        className="flex w-full items-center gap-4 p-5 text-left"
        aria-expanded={open}
      >
        {/* Step number / check */}
        <span
          onClick={toggleDone}
          className={`flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 font-bold text-sm transition ${
            done ? "border-emerald-500 bg-emerald-500 text-white" : "border-slate-300 text-slate-500"
          }`}
          title={done ? "Mark incomplete" : "Mark complete"}
        >
          {done ? <Check size={16} /> : index + 1}
        </span>

        <div className="flex-1">
          <p className={`font-semibold leading-tight ${done ? "line-through text-slate-400" : "text-slate-900"}`}>{label}</p>
          <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-500">
            {step.feeNpr > 0 && <span className="badge bg-amber-50 text-amber-700">{formatNpr(step.feeNpr)}</span>}
            <span className="flex items-center gap-1"><Clock size={11} /> ~{step.days}d</span>
            {step.docs?.length > 0 && <span className="flex items-center gap-1"><FileText size={11} /> {step.docs.length} docs needed</span>}
          </div>
        </div>

        <ChevronDown
          size={20}
          className={`shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div ref={bodyRef} style={{ height: 0, overflow: "hidden" }}>
        <div className="border-t border-slate-100 px-5 pb-5 pt-4">
          {body && <p className="mb-4 text-sm leading-relaxed text-slate-700">{body}</p>}
          {step.docs?.length > 0 && (
            <div className="mb-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Documents needed</p>
              <ul className="flex flex-wrap gap-2">
                {step.docs.map((d) => (
                  <li key={d} className="badge bg-indigo-50 text-indigo-700">{d}</li>
                ))}
              </ul>
            </div>
          )}
          {step.url && (
            <a href={step.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-700 hover:underline">
              <ExternalLink size={14} /> Open official portal
            </a>
          )}
        </div>
      </div>
    </li>
  );
}

function GuideSection({ guide, locale }) {
  const title = locale === "ne" && guide.title.ne ? guide.title.ne : guide.title.en;
  const summary = locale === "ne" && guide.summary.ne ? guide.summary.ne : guide.summary.en;
  const total = guide.steps.reduce((s, x) => s + x.feeNpr, 0);
  const totalDays = guide.steps.reduce((s, x) => s + x.days, 0);

  return (
    <div className="guide-section">
      <div className="mb-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-600">{summary}</p>
        <div className="mt-3 flex gap-4 text-xs text-slate-500">
          <span>~{totalDays} days total</span>
          {total > 0 && <span>{formatNpr(total)} in fees</span>}
        </div>
      </div>
      <ol className="space-y-3">
        {guide.steps.map((step, i) => (
          <GuideStep key={step.id} step={step} locale={locale} index={i} />
        ))}
      </ol>
    </div>
  );
}

export default function SurvivalGuideClient({ guides }) {
  const locale = useLocaleStore((s) => s.locale);
  const hydrated = useHydrated();
  const loc = hydrated ? locale : "en";
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        ScrollTrigger.batch(".guide-step", {
          onEnter: (els) =>
            gsap.from(els, {
              autoAlpha: 0,
              x: -24,
              stagger: 0.07,
              duration: 0.5,
              ease: "power2.out",
            }),
          start: "top 88%",
          once: true,
        });

        ScrollTrigger.batch(".guide-section", {
          onEnter: (els) =>
            gsap.from(els, {
              autoAlpha: 0,
              y: 40,
              stagger: 0.18,
              duration: 0.7,
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
    <div ref={sectionRef} className="grid gap-12 lg:grid-cols-[1fr_1fr] xl:grid-cols-[1fr_1fr_1fr]">
      {guides.map((g) => (
        <GuideSection key={g.id} guide={g} locale={loc} />
      ))}
    </div>
  );
}
