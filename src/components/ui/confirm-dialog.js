"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "danger",
  pending = false,
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === "Escape" && !pending) onCancel?.();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, pending, onCancel]);

  if (!open) return null;

  const confirmClass =
    tone === "danger"
      ? "bg-danger text-white hover:bg-danger/90 focus-visible:ring-danger/30"
      : "bg-brand text-white hover:bg-brand-dark focus-visible:ring-brand/30";

  return (
    <div
      className="fixed inset-0 z-modal flex items-center justify-center bg-black/50 p-4 animate-fade-in"
      onClick={() => !pending && onCancel?.()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      <div
        className="w-full max-w-sm rounded-card border border-border bg-surface p-6 shadow-lg animate-modal-in"
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <h2 id="confirm-title" className="text-base font-semibold text-text-primary">
            {title}
          </h2>
        )}
        {description && (
          <p className="mt-1 text-sm text-text-secondary">{description}</p>
        )}
        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={pending}
            className="rounded-btn border border-border bg-surface px-3 py-1.5 text-sm font-medium text-text-primary hover:bg-surface-secondary disabled:opacity-60"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={pending}
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-btn px-3 py-1.5 text-sm font-semibold transition-colors duration-fast disabled:opacity-60",
              confirmClass
            )}
          >
            {pending && <Loader2 className="h-4 w-4 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
