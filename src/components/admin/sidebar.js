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

function roleBadgeClass(role) {
  if (role === "SUPER_ADMIN") return "bg-brand/15 text-brand";
  return "bg-info-light text-info-text";
}

export default function Sidebar({ user, mobile = false, onNavigate }) {
  const pathname = usePathname();
  const role = user?.role ?? "EDITOR";
  const items = ALL_ITEMS.filter((i) => i.roles.includes(role));

  const [collapsed, setCollapsed] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (mobile) {
      setHydrated(true);
      return;
    }
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "1") setCollapsed(true);
    } catch {}
    setHydrated(true);
  }, [mobile]);

  function toggle() {
    setCollapsed((c) => {
      const next = !c;
      try {
        window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {}
      return next;
    });
  }

  // Mobile drawer: never collapse, full width, no toggle button.
  const isCollapsed = !mobile && collapsed;

  return (
    <div
      className={cn(
        "relative flex h-full flex-col bg-cms-sidebar text-cms-sidebar-text border-r border-cms-sidebar-border",
        mobile ? "w-full" : isCollapsed ? "w-sidebar-sm" : "w-sidebar",
        !mobile && "transition-[width] duration-base ease-smooth",
        !hydrated && "invisible"
      )}
    >
      <div
        className={cn(
          "flex items-center border-b border-cms-sidebar-border",
          isCollapsed ? "justify-center px-3 py-4" : "justify-between px-5 py-4"
        )}
      >
        {!isCollapsed ? (
          <div className="min-w-0">
            <Link
              href="/admin"
              onClick={onNavigate}
              className="block truncate text-lg font-bold text-cms-sidebar-text-active"
            >
              MIDA<span className="text-brand">S</span> CMS
            </Link>
            <p className="mt-0.5 text-xs text-cms-sidebar-text">Admin Console</p>
          </div>
        ) : (
          <Link
            href="/admin"
            onClick={onNavigate}
            title="MIDAS CMS"
            className="text-sm font-bold text-cms-sidebar-text-active"
          >
            M
          </Link>
        )}

        {!mobile && (
          <button
            type="button"
            onClick={toggle}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={cn(
              "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-cms-sidebar-border bg-cms-sidebar text-cms-sidebar-text hover:bg-cms-sidebar-hover hover:text-cms-sidebar-text-active",
              isCollapsed && "absolute -right-3 top-5 shadow-sm"
            )}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        )}
      </div>

      <nav className={cn("flex-1 space-y-1 py-4 overflow-y-auto", isCollapsed ? "px-2" : "px-3")}>
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
              onClick={onNavigate}
              title={isCollapsed ? item.label : undefined}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group relative flex items-center rounded-md text-sm font-medium transition-colors duration-fast",
                isCollapsed ? "justify-center px-2 py-2" : "gap-3 px-3 py-2",
                active
                  ? "bg-cms-sidebar-active text-cms-sidebar-text-active"
                  : "text-cms-sidebar-text hover:bg-cms-sidebar-hover hover:text-cms-sidebar-text-active"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!isCollapsed && <span className="truncate">{item.label}</span>}

              {isCollapsed && (
                <span className="pointer-events-none absolute left-full ml-2 z-tooltip whitespace-nowrap rounded-md bg-surface-inverse px-2 py-1 text-xs font-medium text-text-inverse opacity-0 shadow-md transition-opacity duration-fast group-hover:opacity-100">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className={cn("border-t border-cms-sidebar-border", isCollapsed ? "p-2" : "p-4")}>
        {!isCollapsed ? (
          <>
            <div className="text-sm">
              <p className="truncate font-medium text-cms-sidebar-text-active">{user?.name}</p>
              <p className="truncate text-xs text-cms-sidebar-text">{user?.email}</p>
              <span
                className={cn(
                  "mt-1 inline-block rounded-badge px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                  roleBadgeClass(role)
                )}
              >
                {role}
              </span>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="mt-3 flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-danger hover:bg-danger/10 transition-colors duration-fast"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </>
        ) : (
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            title={`Sign out (${user?.email ?? ""})`}
            className="group relative flex w-full items-center justify-center rounded-md px-2 py-2 text-sm font-medium text-danger hover:bg-danger/10 transition-colors duration-fast"
          >
            <LogOut className="h-4 w-4" />
            <span className="pointer-events-none absolute left-full ml-2 z-tooltip whitespace-nowrap rounded-md bg-surface-inverse px-2 py-1 text-xs font-medium text-text-inverse opacity-0 shadow-md transition-opacity duration-fast group-hover:opacity-100">
              Sign out
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
