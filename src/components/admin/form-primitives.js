"use client";

export function Field({ label, hint, error, children }) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-slate-700">{label}</label>
      )}
      {children}
      {hint && !error && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export const inputClass =
  "mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none";

export function Section({ title, description, children }) {
  return (
    <section className="space-y-4">
      <header className="space-y-1 border-b border-slate-200 pb-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          {title}
        </h2>
        {description && (
          <p className="text-xs text-slate-500">{description}</p>
        )}
      </header>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
