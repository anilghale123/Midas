"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme, THEMES } from "@/lib/theme";
import { cn } from "@/lib/utils";

const ICONS = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

const LABELS = {
  light: "Light theme",
  dark: "Dark theme",
  system: "System theme",
};

export default function ThemeToggle({ variant = "icon", className }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div
        aria-hidden="true"
        className={cn("h-8 w-8 rounded-btn", className)}
      />
    );
  }

  if (variant === "segmented") {
    return (
      <div
        role="radiogroup"
        aria-label="Theme"
        className={cn(
          "inline-flex items-center gap-0.5 rounded-btn border border-border bg-surface-secondary p-0.5",
          className
        )}
      >
        {THEMES.map((t) => {
          const Icon = ICONS[t];
          const active = theme === t;
          return (
            <button
              key={t}
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={LABELS[t]}
              title={LABELS[t]}
              onClick={() => setTheme(t)}
              className={cn(
                "inline-flex h-7 w-7 items-center justify-center rounded-[0.375rem] transition-colors duration-fast",
                active
                  ? "bg-surface text-text-primary shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              )}
            >
              <Icon className="h-4 w-4" />
            </button>
          );
        })}
      </div>
    );
  }

  // Default: cycling icon button
  const order = ["light", "dark", "system"];
  const current = theme;
  const next = order[(order.indexOf(current) + 1) % order.length];
  const Icon = ICONS[current];

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`Switch to ${LABELS[next].toLowerCase()}`}
      title={`Theme: ${LABELS[current]} — click for ${LABELS[next].toLowerCase()}`}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-btn border border-border bg-surface text-text-secondary hover:bg-surface-secondary hover:text-text-primary transition-colors duration-fast",
        className
      )}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
