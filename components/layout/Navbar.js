"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, GraduationCap } from "lucide-react";
import { useT } from "@/lib/i18n";
import { useCompareStore } from "@/store/useCompareStore";
import { useHydrated } from "@/lib/useHydrated";
import LanguageToggle from "./LanguageToggle";

const LINKS = [
  { href: "/colleges", key: "nav.colleges" },
  { href: "/compare", key: "nav.compare" },
  { href: "/calculator", key: "nav.calculator" },
  { href: "/survival-guide", key: "nav.guide" },
  { href: "/parents", key: "nav.parents" },
];

export default function Navbar() {
  const { t } = useT();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const count = useCompareStore((s) => s.items.length);
  const hydrated = useHydrated();

  return (
    <header className="no-print sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
            <GraduationCap size={20} />
          </span>
          <span className="leading-tight">
            <span className="block font-bold text-navy-900">Hamro College</span>
            <span className="block text-xs text-brand-600">हाम्रो कलेज</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => {
            const active = pathname === l.href || pathname.startsWith(l.href + "/");
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`relative rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active ? "bg-navy-50 text-navy-700" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {t(l.key)}
                {l.href === "/compare" && hydrated && count > 0 && (
                  <span className="ml-1.5 rounded-full bg-brand-600 px-1.5 py-0.5 text-[10px] font-bold text-white">{count}</span>
                )}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <LanguageToggle />
          <button className="btn-ghost p-2 lg:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <div className="container-page flex flex-col py-2">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100">
                {t(l.key)}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
