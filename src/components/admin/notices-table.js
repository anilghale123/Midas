"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";

export default function NoticesTable({ initialItems, canDelete }) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [pending, startTransition] = useTransition();
  const [confirmId, setConfirmId] = useState(null);

  async function onDelete(id) {
    const prev = items;
    setItems((curr) => curr.filter((n) => String(n._id) !== String(id)));
    setConfirmId(null);

    try {
      const res = await fetch(`/api/admin/notices/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) {
        setItems(prev);
        toast.error(json.error ?? "Delete failed");
        return;
      }
      toast.success("Notice deleted");
      startTransition(() => router.refresh());
    } catch (err) {
      setItems(prev);
      toast.error(err.message ?? "Delete failed");
    }
  }

  if (!items.length) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
        <p className="text-sm text-slate-500">No notices yet.</p>
        <Link
          href="/admin/notices/new"
          className="mt-3 inline-block rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Create your first notice
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
          <tr>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Author</th>
            <th className="px-4 py-3">Created</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((n) => (
            <tr key={n._id} className="border-t border-slate-100">
              <td className="px-4 py-3 font-medium text-slate-900">{n.title}</td>
              <td className="px-4 py-3 text-slate-600">{n.category}</td>
              <td className="px-4 py-3">
                <span
                  className={
                    "inline-block rounded px-2 py-0.5 text-xs font-medium " +
                    (n.isActive
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-200 text-slate-700")
                  }
                >
                  {n.isActive ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="px-4 py-3 text-slate-600">{n.authorId?.name ?? "—"}</td>
              <td className="px-4 py-3 text-slate-500">
                {new Date(n.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/admin/notices/${n._id}`}
                    className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1"
                  >
                    <Pencil className="h-3 w-3" /> Edit
                  </Link>
                  {canDelete && (
                    <button
                      onClick={() => setConfirmId(n._id)}
                      className="rounded-md border border-red-200 bg-white px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 inline-flex items-center gap-1"
                    >
                      <Trash2 className="h-3 w-3" /> Delete
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {confirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
            <h2 className="text-base font-semibold text-slate-900">Delete this notice?</h2>
            <p className="mt-1 text-sm text-slate-500">
              This permanently removes the notice and its attachment.
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
                onClick={() => onDelete(confirmId)}
                className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
