"use client";

import { useEffect, useState } from "react";

export const THEME_KEY = "opac-theme";

export default function ThemeToggle() {
  // Null until mounted: the server cannot know the reader's stored choice, so
  // the button renders a neutral placeholder rather than a wrong guess.
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    const stored = safeRead();
    const system = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    setTheme(stored ?? system);
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // Private browsing or blocked storage: the choice still applies to this page.
    }
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={theme === null ? undefined : isDark}
      className="inline-flex min-w-[6.5rem] items-center justify-center gap-2 rounded-md border border-line px-3 py-2 text-sm font-medium text-ink hover:bg-brand-soft"
    >
      {theme === null ? (
        <span className="visually-hidden">Loading theme preference</span>
      ) : (
        <>
          <span aria-hidden="true">{isDark ? "☀" : "☾"}</span>
          <span>{isDark ? "Day mode" : "Night mode"}</span>
        </>
      )}
    </button>
  );
}

function safeRead() {
  try {
    const value = localStorage.getItem(THEME_KEY);
    return value === "dark" || value === "light" ? value : null;
  } catch {
    return null;
  }
}
