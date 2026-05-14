"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Bell,
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
  { href: "/admin/notices", label: "Notices", icon: Bell, roles: ["SUPER_ADMIN", "EDITOR"] },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle, roles: ["SUPER_ADMIN", "EDITOR"] },
  { href: "/admin/services", label: "Services", icon: ListChecks, roles: ["SUPER_ADMIN", "EDITOR"] },
  { href: "/admin/users", label: "Users", icon: Users, roles: ["SUPER_ADMIN"] },
  { href: "/admin/settings", label: "Settings", icon: Settings, roles: ["SUPER_ADMIN"] },
  { href: "/admin/audit-log", label: "Audit Log", icon: ShieldAlert, roles: ["SUPER_ADMIN"] },
  { href: "/admin/orphaned-assets", label: "Orphaned Assets", icon: Trash2, roles: ["SUPER_ADMIN"] },
];

export default function Sidebar({ user }) {
  const pathname = usePathname();
  const role = user?.role ?? "EDITOR";
  const items = ALL_ITEMS.filter((i) => i.roles.includes(role));

  return (
    <aside className="w-64 shrink-0 border-r border-slate-200 bg-white flex flex-col h-screen sticky top-0">
      <div className="px-5 py-4 border-b border-slate-200">
        <Link href="/admin" className="font-bold text-lg text-slate-900">
          MIDAS CMS
        </Link>
        <p className="text-xs text-slate-500 mt-0.5">Admin Console</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
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
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition",
                active
                  ? "bg-slate-900 text-white"
                  : "text-slate-700 hover:bg-slate-100"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 p-4">
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
      </div>
    </aside>
  );
}
