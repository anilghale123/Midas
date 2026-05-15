"use client";

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import en from "@/locales/en.json";

const LOCALES = {
  en,
  // ne: ne,  // future: import ne from "@/locales/ne.json"
};

export const SUPPORTED_LOCALES = Object.keys(LOCALES);
export const DEFAULT_LOCALE = "en";
export const LOCALE_STORAGE_KEY = "midas-locale";

const LocaleContext = createContext(null);

/**
 * Interpolate `{placeholders}` in a message with values from `params`.
 *   format("Hello {name}", { name: "Anil" }) -> "Hello Anil"
 */
function format(template, params) {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (m, key) =>
    Object.prototype.hasOwnProperty.call(params, key) ? String(params[key]) : m
  );
}

/**
 * Build a translator function bound to a specific locale's messages.
 * Missing keys return the key itself (visible flag during development).
 */
export function buildT(messages) {
  return function t(key, params) {
    const msg = messages?.[key];
    if (typeof msg !== "string") return key;
    return format(msg, params);
  };
}

/** Server-side / static helper. */
export function getT(locale = DEFAULT_LOCALE) {
  return buildT(LOCALES[locale] ?? LOCALES[DEFAULT_LOCALE]);
}

export function LocaleProvider({ children, defaultLocale = DEFAULT_LOCALE }) {
  const [locale, setLocaleState] = useState(defaultLocale);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
      if (stored && SUPPORTED_LOCALES.includes(stored)) {
        setLocaleState(stored);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  const setLocale = useCallback((next) => {
    if (!SUPPORTED_LOCALES.includes(next)) return;
    setLocaleState(next);
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {}
  }, []);

  const value = useMemo(() => {
    const messages = LOCALES[locale] ?? LOCALES[DEFAULT_LOCALE];
    return {
      locale,
      setLocale,
      t: buildT(messages),
      messages,
    };
  }, [locale, setLocale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    return {
      locale: DEFAULT_LOCALE,
      setLocale: () => {},
      t: buildT(LOCALES[DEFAULT_LOCALE]),
      messages: LOCALES[DEFAULT_LOCALE],
    };
  }
  return ctx;
}

/** Convenience hook: `const t = useT(); t("nav.home")`. */
export function useT() {
  return useLocale().t;
}
