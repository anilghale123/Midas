"use client";

import { ThemeProvider } from "@/lib/theme";
import { LocaleProvider } from "@/lib/i18n";

export default function AppProviders({ children }) {
  return (
    <ThemeProvider defaultTheme="system">
      <LocaleProvider defaultLocale="en">{children}</LocaleProvider>
    </ThemeProvider>
  );
}
