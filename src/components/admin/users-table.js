"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, UserX } from "lucide-react";

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

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Last login</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((u) => {
            const isSelf = String(u._id) === String(currentUserId);
            return (
              <tr key={u._id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium text-slate-900">
                  {u.name} {isSelf && <span className="ml-1 text-xs text-slate-500">(you)</span>}
                </td>
                <td className="px-4 py-3 text-slate-600">{u.email}</td>
                <td className="px-4 py-3">
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      "inline-block rounded px-2 py-0.5 text-xs font-medium " +
                      (u.isActive
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-200 text-slate-700")
                    }
                  >
                    {u.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500">
                  {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/users/${u._id}`}
                      className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1"
                    >
                      <Pencil className="h-3 w-3" /> Edit
                    </Link>
                    {!isSelf && u.isActive && (
                      <button
                        onClick={() => setConfirmId(u._id)}
                        className="rounded-md border border-red-200 bg-white px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 inline-flex items-center gap-1"
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

      {confirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
            <h2 className="text-base font-semibold text-slate-900">Deactivate this user?</h2>
            <p className="mt-1 text-sm text-slate-500">
              They will no longer be able to sign in. You can re-activate them later from the edit page.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setConfirmId(null)}
                className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                disabled={pending}
                onClick={() => onDeactivate(confirmId)}
                className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                Deactivate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
