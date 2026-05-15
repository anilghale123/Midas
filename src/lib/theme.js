"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

const ThemeContext = createContext(null);

export const THEME_STORAGE_KEY = "midas-theme";
export const THEMES = ["light", "dark", "system"];

function resolveSystemDark() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyTheme(theme) {
  if (typeof document === "undefined") return;
  const isDark =
    theme === "dark" || (theme === "system" && resolveSystemDark());
  document.documentElement.classList.toggle("dark", isDark);
}

export function ThemeProvider({ children, defaultTheme = "system" }) {
  const [theme, setThemeState] = useState(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState("light");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored && THEMES.includes(stored)) {
        setThemeState(stored);
      }
    } catch {}
  }, []);

  useEffect(() => {
    applyTheme(theme);
    const dark =
      theme === "dark" || (theme === "system" && resolveSystemDark());
    setResolvedTheme(dark ? "dark" : "light");
  }, [theme]);

  useEffect(() => {
    if (theme !== "system" || typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    function onChange(e) {
      document.documentElement.classList.toggle("dark", e.matches);
      setResolvedTheme(e.matches ? "dark" : "light");
    }
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [theme]);

  const setTheme = useCallback((next) => {
    if (!THEMES.includes(next)) return;
    setThemeState(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {}
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    return { theme: "system", resolvedTheme: "light", setTheme: () => {} };
  }
  return ctx;
}

/**
 * Inline script string that runs BEFORE React hydrates to set the .dark class
 * based on stored preference. Prevents FOUC (white flash for dark-mode users).
 * Inject via dangerouslySetInnerHTML in the <head>.
 */
export const NO_FLASH_SCRIPT = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}")||"system";var d=t==="dark"||(t==="system"&&matchMedia("(prefers-color-scheme: dark)").matches);if(d)document.documentElement.classList.add("dark");}catch(e){}})();`;
