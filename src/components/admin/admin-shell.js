"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Sidebar from "@/components/admin/sidebar";

export default function AdminShell({ user, children }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

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

  return (
    <div className="flex h-screen overflow-hidden bg-surface-secondary">
      {/* Desktop sidebar — always visible at lg+ */}
      <aside className="hidden lg:flex lg:flex-col flex-shrink-0">
        <Sidebar user={user} />
      </aside>

      {/* Mobile backdrop */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-overlay bg-black/60 animate-fade-in lg:hidden"
          onClick={() => setDrawerOpen(false)}
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
          onClick={() => setDrawerOpen(false)}
          className="absolute right-4 top-4 z-tooltip rounded-md p-1.5 text-cms-sidebar-text hover:bg-cms-sidebar-hover hover:text-cms-sidebar-text-active transition-colors duration-fast"
          aria-label="Close navigation"
        >
          <X size={18} />
        </button>
        <Sidebar user={user} mobile onNavigate={() => setDrawerOpen(false)} />
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
          <span className="text-sm font-semibold text-text-primary">
            MIDA<span className="text-brand">S</span> Admin
          </span>
        </header>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
