"use client";
import { useEffect, useState } from "react";

// Avoids server/client mismatch for values stored in localStorage.
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
