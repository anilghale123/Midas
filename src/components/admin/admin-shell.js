"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Sidebar from "@/components/admin/sidebar";
import ThemeToggle from "@/components/ui/theme-toggle";

export default function AdminShell({ user, children }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = drawerOpen ? "hidden" : prev;
    return () => {
      document.body.style.overflow = prev;
    };
  }, [drawerOpen]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setDrawerOpen(false);
    }
    if (drawerOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen]);

  const closeDrawer = () => setDrawerOpen(false);

  return (
    <div className="flex h-screen overflow-hidden bg-surface-secondary">
      {/* Desktop sidebar — always visible at lg+ */}
      <aside className="hidden lg:flex lg:flex-col shrink-0">
        <Sidebar user={user} />
      </aside>

      {/* Mobile backdrop */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-overlay bg-black/60 animate-fade-in lg:hidden"
          onClick={closeDrawer}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-modal w-72 flex flex-col lg:hidden",
          "transition-transform duration-slow ease-smooth",
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        )}
        aria-label="Admin navigation"
        aria-hidden={!drawerOpen}
      >
        <button
          type="button"
          onClick={closeDrawer}
          className="absolute right-4 top-4 z-tooltip rounded-md p-1.5 text-cms-sidebar-text hover:bg-cms-sidebar-hover hover:text-cms-sidebar-text-active transition-colors duration-fast"
          aria-label="Close navigation"
        >
          <X size={18} />
        </button>
        <Sidebar user={user} mobile onNavigate={closeDrawer} />
      </aside>

      {/* Main column */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-sticky flex items-center gap-3 border-b border-border bg-surface px-4 py-3 lg:hidden">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="rounded-md p-2 text-text-secondary hover:bg-surface-tertiary hover:text-text-primary transition-colors duration-fast"
            aria-label="Open navigation"
            aria-expanded={drawerOpen}
          >
            <Menu size={20} />
          </button>
          <span className="flex-1 text-sm font-semibold text-text-primary">
            MIDA<span className="text-brand">S</span> Admin
          </span>
          <ThemeToggle />
        </header>

        {/* Desktop top bar (theme toggle) */}
        <div className="hidden lg:flex items-center justify-end gap-2 border-b border-border bg-surface px-6 py-2.5">
          <ThemeToggle variant="segmented" />
        </div>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
