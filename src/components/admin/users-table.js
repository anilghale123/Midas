"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, UserX } from "lucide-react";
import StatusBadge from "@/components/ui/status-badge";
import RoleBadge from "@/components/ui/role-badge";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import EmptyState from "@/components/ui/empty-state";

export default function UsersTable({ initialItems, currentUserId }) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [pending, startTransition] = useTransition();
  const [confirmId, setConfirmId] = useState(null);

  async function onDeactivate(id) {
    const prev = items;
    setItems((curr) =>
      curr.map((u) => (String(u._id) === String(id) ? { ...u, isActive: false } : u))
    );
    setConfirmId(null);
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setItems(prev);
        toast.error(json.error ?? "Deactivate failed");
        return;
      }
      toast.success("User deactivated");
      startTransition(() => router.refresh());
    } catch (err) {
      setItems(prev);
      toast.error(err.message ?? "Deactivate failed");
    }
  }

  if (!items.length) {
    return (
      <EmptyState
        icon={UserX}
        title="No users yet"
        description="Invite your first teammate to get started."
        action={
          <Link
            href="/admin/users/new"
            className="inline-flex items-center gap-2 rounded-btn bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark transition-colors duration-fast"
          >
            New user
          </Link>
        }
      />
    );
  }

  return (
    <>
      {/* Mobile card list */}
      <div className="space-y-3 sm:hidden">
        {items.map((u, i) => {
          const isSelf = String(u._id) === String(currentUserId);
          return (
            <div
              key={u._id}
              style={{ animationDelay: `${i * 40}ms` }}
              className="rounded-card border border-border bg-surface p-card shadow-card animate-fade-up"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-base font-medium text-text-primary">
                    {u.name}
                    {isSelf && <span className="ml-1 text-xs text-text-muted">(you)</span>}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-text-secondary">{u.email}</p>
                </div>
                <StatusBadge active={u.isActive} />
              </div>
              <div className="mt-3 flex items-center justify-between gap-2">
                <RoleBadge role={u.role} />
                <span className="text-xs text-text-muted">
                  {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString() : "Never"}
                </span>
              </div>
              <div className="mt-3 flex gap-2">
                <Link
                  href={`/admin/users/${u._id}`}
                  className="inline-flex flex-1 items-center justify-center gap-1 rounded-btn border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-primary hover:bg-surface-secondary transition-colors duration-fast"
                >
                  <Pencil className="h-3 w-3" /> Edit
                </Link>
                {!isSelf && u.isActive && (
                  <button
                    type="button"
                    onClick={() => setConfirmId(u._id)}
                    className="inline-flex flex-1 items-center justify-center gap-1 rounded-btn border border-danger/30 bg-surface px-3 py-1.5 text-xs font-medium text-danger hover:bg-danger/10 transition-colors duration-fast"
                  >
                    <UserX className="h-3 w-3" /> Deactivate
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-card border border-border bg-surface shadow-card sm:block">
        <table className="w-full text-sm">
          <thead className="bg-surface-secondary text-left text-xs font-semibold uppercase tracking-wide text-text-secondary">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Last login</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items.map((u, i) => {
              const isSelf = String(u._id) === String(currentUserId);
              return (
                <tr
                  key={u._id}
                  style={{ animationDelay: `${i * 30}ms` }}
                  className="animate-fade-in transition-colors duration-fast hover:bg-surface-secondary"
                >
                  <td className="px-4 py-3 font-medium text-text-primary">
                    {u.name}
                    {isSelf && (
                      <span className="ml-1 text-xs text-text-muted">(you)</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{u.email}</td>
                  <td className="px-4 py-3">
                    <RoleBadge role={u.role} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge active={u.isActive} />
                  </td>
                  <td className="px-4 py-3 text-text-muted">
                    {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/users/${u._id}`}
                        className="inline-flex items-center gap-1 rounded-btn border border-border bg-surface px-2.5 py-1 text-xs font-medium text-text-primary hover:bg-surface-secondary transition-colors duration-fast"
                      >
                        <Pencil className="h-3 w-3" /> Edit
                      </Link>
                      {!isSelf && u.isActive && (
                        <button
                          type="button"
                          onClick={() => setConfirmId(u._id)}
                          className="inline-flex items-center gap-1 rounded-btn border border-danger/30 bg-surface px-2.5 py-1 text-xs font-medium text-danger hover:bg-danger/10 transition-colors duration-fast"
                        >
                          <UserX className="h-3 w-3" /> Deactivate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={Boolean(confirmId)}
        title="Deactivate this user?"
        description="They will no longer be able to sign in. You can re-activate them later from the edit page."
        confirmLabel="Deactivate"
        pending={pending}
        onConfirm={() => onDeactivate(confirmId)}
        onCancel={() => setConfirmId(null)}
      />
    </>
  );
}
