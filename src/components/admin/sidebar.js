"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  FileText,
  HelpCircle,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Settings,
  ShieldAlert,
  Trash2,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ALL_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, roles: ["SUPER_ADMIN", "EDITOR"] },
  { href: "/admin/page-content", label: "Site content", icon: FileText, roles: ["SUPER_ADMIN", "EDITOR"] },
  { href: "/admin/notices", label: "Notices", icon: Bell, roles: ["SUPER_ADMIN", "EDITOR"] },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle, roles: ["SUPER_ADMIN", "EDITOR"] },
  { href: "/admin/services", label: "Services", icon: ListChecks, roles: ["SUPER_ADMIN", "EDITOR"] },
  { href: "/admin/users", label: "Users", icon: Users, roles: ["SUPER_ADMIN"] },
  { href: "/admin/settings", label: "Settings", icon: Settings, roles: ["SUPER_ADMIN"] },
  { href: "/admin/audit-log", label: "Audit Log", icon: ShieldAlert, roles: ["SUPER_ADMIN"] },
  { href: "/admin/orphaned-assets", label: "Orphaned Assets", icon: Trash2, roles: ["SUPER_ADMIN"] },
];

const STORAGE_KEY = "midas-admin-sidebar-collapsed";

export default function Sidebar({ user }) {
  const pathname = usePathname();
  const role = user?.role ?? "EDITOR";
  const items = ALL_ITEMS.filter((i) => i.roles.includes(role));

  const [collapsed, setCollapsed] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "1") setCollapsed(true);
    } catch {}
    setHydrated(true);
  }, []);

  function toggle() {
    setCollapsed((c) => {
      const next = !c;
      try {
        window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {}
      return next;
    });
  }

  return (
    <aside
      className={cn(
        "relative shrink-0 border-r border-slate-200 bg-white flex flex-col h-screen transition-[width] duration-200",
        collapsed ? "w-16" : "w-64",
        // Avoid layout flash before hydration
        !hydrated && "invisible"
      )}
    >
      <div className={cn("border-b border-slate-200 flex items-center", collapsed ? "px-3 py-4 justify-center" : "px-5 py-4 justify-between")}>
        {!collapsed ? (
          <div className="min-w-0">
            <Link href="/admin" className="font-bold text-lg text-slate-900 truncate block">
              MIDAS CMS
            </Link>
            <p className="text-xs text-slate-500 mt-0.5">Admin Console</p>
          </div>
        ) : (
          <Link href="/admin" className="font-bold text-sm text-slate-900" title="MIDAS CMS">
            M
          </Link>
        )}
        <button
          type="button"
          onClick={toggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "rounded-md border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700 h-7 w-7 inline-flex items-center justify-center shrink-0",
            collapsed && "absolute -right-3 top-5 shadow-sm"
          )}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <nav className={cn("flex-1 py-4 space-y-1", collapsed ? "px-2" : "px-3")}>
        {items.map((item) => {
          const Icon = item.icon;
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "group relative flex items-center rounded-md text-sm font-medium transition",
                collapsed ? "justify-center px-2 py-2" : "gap-3 px-3 py-2",
                active
                  ? "bg-slate-900 text-white"
                  : "text-slate-700 hover:bg-slate-100"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}

              {collapsed && (
                <span className="pointer-events-none absolute left-full ml-2 z-50 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs font-medium text-white opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-100">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className={cn("border-t border-slate-200", collapsed ? "p-2" : "p-4")}>
        {!collapsed ? (
          <>
            <div className="text-sm">
              <p className="font-medium text-slate-900 truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              <span className="mt-1 inline-block rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                {role}
              </span>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="mt-3 flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </>
        ) : (
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            title={`Sign out (${user?.email ?? ""})`}
            className="group relative flex w-full items-center justify-center rounded-md px-2 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            <LogOut className="h-4 w-4" />
            <span className="pointer-events-none absolute left-full ml-2 z-50 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs font-medium text-white opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-100">
              Sign out
            </span>
          </button>
        )}
      </div>
    </aside>
  );
}
