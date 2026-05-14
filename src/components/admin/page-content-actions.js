"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

// Wraps the save logic shared by every page-content form. Children receive
// `{ value, setValue, save, saving }` and render the actual fields.
export default function PageContentSavebar({
  pageKey,
  initial,
  emptyState,
  children,
}) {
  const router = useRouter();
  const [value, setValue] = useState(() => initial ?? emptyState ?? {});
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/page-content/${pageKey}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(value),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        toast.error(
          json.error
            ? `${json.error}${json.details?.formErrors?.length ? ` — ${json.details.formErrors.join(", ")}` : ""}`
            : "Save failed"
        );
        return;
      }
      toast.success("Saved — public site will refresh.");
      router.refresh();
    } catch (err) {
      toast.error(err.message ?? "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      {children({ value, setValue, save, saving })}

      <div className="sticky bottom-0 -mx-8 border-t border-slate-200 bg-white/95 backdrop-blur px-8 py-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            Changes are revalidated on the public site immediately after save.
          </p>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}
