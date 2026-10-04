"use client";
import Link from "next/link";
import { useT } from "@/lib/i18n";

export default function Footer() {
  const { t } = useT();
  return (
    <footer className="no-print mt-20 bg-navy-900 text-slate-300">
      <div className="container-page grid gap-8 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="text-lg font-bold text-white">Hamro College · हाम्रो कलेज</p>
          <p className="mt-2 max-w-md text-sm text-slate-400">
            An independent, commission-free guide helping Nepali students and parents compare colleges on real costs, not marketing.
          </p>
          <p className="mt-4 max-w-md text-xs text-slate-500">{t("footer.disclaimer")}</p>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold text-white">Explore</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/colleges?tier=internal" className="hover:text-white">Colleges in Nepal</Link></li>
            <li><Link href="/colleges?tier=regional_hub" className="hover:text-white">Colleges in India</Link></li>
            <li><Link href="/colleges?tier=international" className="hover:text-white">Study abroad</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold text-white">Tools</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/compare" className="hover:text-white">Compare colleges</Link></li>
            <li><Link href="/calculator" className="hover:text-white">Cost calculator</Link></li>
            <li><Link href="/survival-guide" className="hover:text-white">NOC & survival guide</Link></li>
            <li><Link href="/parents" className="hover:text-white">Parent budget planner</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Hamro College. Built for Nepali students.
      </div>
    </footer>
  );
}
