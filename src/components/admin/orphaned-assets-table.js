"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, RefreshCcw } from "lucide-react";

export default function OrphanedAssetsTable({ initialItems }) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [retryingId, setRetryingId] = useState(null);
  const [pending, startTransition] = useTransition();

  async function onRetry(id) {
    setRetryingId(id);
    try {
      const res = await fetch(`/api/admin/orphaned-assets/${id}/retry`, {
        method: "POST",
      });
      const json = await res.json();
      if (res.ok && json.success) {
        toast.success("Asset cleaned up");
        setItems((curr) => curr.filter((it) => String(it._id) !== String(id)));
        startTransition(() => router.refresh());
      } else {
        toast.error(json.error ?? "Retry failed");
      }
    } catch (err) {
      toast.error(err.message ?? "Retry failed");
    } finally {
      setRetryingId(null);
    }
  }

  if (!items.length) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
        <p className="text-sm text-slate-500">No orphaned assets. Cloudinary is in sync.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
          <tr>
            <th className="px-4 py-3">Public ID</th>
            <th className="px-4 py-3">Source</th>
            <th className="px-4 py-3">Failed at</th>
            <th className="px-4 py-3">Retries</th>
            <th className="px-4 py-3">Last error</th>
            <th className="px-4 py-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((a) => (
            <tr key={a._id} className="border-t border-slate-100 align-top">
              <td className="px-4 py-3 font-mono text-xs text-slate-700">{a.cloudinaryPublicId}</td>
              <td className="px-4 py-3 text-slate-600">
                {a.sourceCollection}
                {a.sourceId && (
                  <span className="block font-mono text-[10px] text-slate-400">{String(a.sourceId)}</span>
                )}
              </td>
              <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                {new Date(a.failedAt).toLocaleString()}
              </td>
              <td className="px-4 py-3 text-slate-600">{a.retryCount ?? 0}</td>
              <td className="px-4 py-3 text-xs text-slate-500 max-w-xs truncate">{a.lastError}</td>
              <td className="px-4 py-3 text-right">
                <button
                  disabled={retryingId === a._id || pending}
                  onClick={() => onRetry(a._id)}
                  className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  {retryingId === a._id ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <RefreshCcw className="h-3 w-3" />
                  )}
                  Retry
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
