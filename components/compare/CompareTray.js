"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Scale } from "lucide-react";
import { useCompareStore, MAX_COMPARE } from "@/store/useCompareStore";
import { useHydrated } from "@/lib/useHydrated";

// Floating bar that follows the user around once they start adding colleges.
export default function CompareTray() {
  const items = useCompareStore((s) => s.items);
  const remove = useCompareStore((s) => s.remove);
  const hydrated = useHydrated();
  const pathname = usePathname();

  if (!hydrated || items.length === 0 || pathname === "/compare") return null;

  return (
    <div className="no-print fixed inset-x-0 bottom-4 z-50 px-4">
      <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-3 rounded-2xl bg-navy-900 p-3 text-white shadow-2xl">
        <Scale size={18} className="ml-1 text-brand-100" />
        <div className="flex flex-1 flex-wrap gap-2">
          {items.map((i) => (
            <span key={i.slug} className="badge bg-white/10 py-1 text-white">
              {i.name}
              <button onClick={() => remove(i.slug)} aria-label={`Remove ${i.name}`}>
                <X size={12} />
              </button>
            </span>
          ))}
          <span className="self-center text-xs text-slate-400">{items.length}/{MAX_COMPARE}</span>
        </div>
        <Link href="/compare" className="btn-primary py-2">
          Compare now
        </Link>
      </div>
    </div>
  );
}
