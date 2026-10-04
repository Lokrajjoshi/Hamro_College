"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const MAX_COMPARE = 3;

export const useCompareStore = create(
  persist(
    (set, get) => ({
      items: [], // [{ slug, name }]
      has: (slug) => get().items.some((i) => i.slug === slug),
      toggle: (college) => {
        const { items } = get();
        if (items.some((i) => i.slug === college.slug)) {
          set({ items: items.filter((i) => i.slug !== college.slug) });
          return true;
        }
        if (items.length >= MAX_COMPARE) return false;
        set({ items: [...items, { slug: college.slug, name: college.shortName || college.name }] });
        return true;
      },
      remove: (slug) => set({ items: get().items.filter((i) => i.slug !== slug) }),
      clear: () => set({ items: [] }),
    }),
    { name: "hamro-compare" }
  )
);
