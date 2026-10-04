"use client";
import { useEffect, useState } from "react";
import { Sun, Moon, Laptop, Sparkles } from "lucide-react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("system"); // "light" | "dark" | "system"
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("hamro-theme") || "system";
    setTheme(saved);
    applyTheme(saved);

    // Listen for OS theme changes if in system mode
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleMediaChange = () => {
      const current = localStorage.getItem("hamro-theme") || "system";
      if (current === "system") {
        applyTheme("system");
      }
    };
    mediaQuery.addEventListener("change", handleMediaChange);

    // Keyboard shortcut Alt + T to toggle themes quickly
    const handleKeyDown = (e) => {
      if (e.altKey && e.key.toLowerCase() === "t") {
        e.preventDefault();
        setTheme((prev) => {
          const next = prev === "light" ? "dark" : prev === "dark" ? "system" : "light";
          localStorage.setItem("hamro-theme", next);
          applyTheme(next);
          return next;
        });
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function applyTheme(mode) {
    const isDark =
      mode === "dark" ||
      (mode === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }

  function handleSelect(mode) {
    setTheme(mode);
    localStorage.setItem("hamro-theme", mode);
    applyTheme(mode);
  }

  if (!mounted) {
    return <div className="h-9 w-28 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />;
  }

  const OPTIONS = [
    {
      id: "light",
      icon: Sun,
      label: "Solar",
      np: "घाम",
      activeBg: "bg-amber-400 text-slate-950 shadow-amber-500/30",
    },
    {
      id: "dark",
      icon: Moon,
      label: "Lunar",
      np: "रात",
      activeBg: "bg-indigo-600 text-white shadow-indigo-500/30",
    },
    {
      id: "system",
      icon: Laptop,
      label: "Auto",
      np: "प्रणाली",
      activeBg: "bg-emerald-500 text-slate-950 shadow-emerald-500/30",
    },
  ];

  return (
    <div className="group relative inline-flex items-center gap-1 rounded-full border border-slate-300 bg-slate-200/80 p-1 shadow-inner backdrop-blur transition-colors dark:border-slate-800 dark:bg-slate-950/80">
      {OPTIONS.map(({ id, icon: Icon, label, np, activeBg }) => {
        const active = theme === id;
        return (
          <button
            key={id}
            onClick={() => handleSelect(id)}
            title={`${label} Mode (${np}) — Press Alt + T to toggle`}
            className={`relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all duration-300 ${
              active
                ? `${activeBg} shadow-lg scale-105`
                : "text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            <Icon
              size={14}
              className={`transition-transform duration-300 ${
                active ? "rotate-12 scale-110" : "opacity-75"
              }`}
            />
            <span className="hidden sm:inline-block">{label}</span>
            <span className="text-[10px] opacity-75 hidden md:inline-block">({np})</span>
          </button>
        );
      })}
    </div>
  );
}
