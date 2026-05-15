import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import AuditLog from "@/models/AuditLog";
import { AUDIT_ACTIONS } from "@/lib/enums";
import PageTransition from "@/components/ui/page-transition";
import EmptyState from "@/components/ui/empty-state";
import { ShieldAlert } from "lucide-react";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;

const ACTION_COLOR = {
  CREATE: "bg-success-light text-success-text",
  UPDATE: "bg-info-light text-info-text",
  DELETE: "bg-danger-light text-danger-text",
  LOGIN: "bg-surface-tertiary text-text-secondary",
  LOGIN_FAILED: "bg-warning-light text-warning-text",
  SETTINGS_CHANGE: "bg-brand/15 text-brand-dark",
};

function ActionTag({ action }) {
  return (
    <span
      className={
        "inline-block rounded-badge px-2 py-0.5 text-xs font-medium " +
        (ACTION_COLOR[action] ?? "bg-surface-tertiary text-text-secondary")
      }
    >
      {action}
    </span>
  );
}

export default async function AuditLogPage({ searchParams }) {
  const session = await auth();
  if (session?.user?.role !== "SUPER_ADMIN") redirect("/admin");

  const params = (await searchParams) ?? {};
  const page = Math.max(1, Number(params.page ?? 1));
  const action = typeof params.action === "string" ? params.action : "";

  const filter = {};
  if (action && AUDIT_ACTIONS.includes(action)) filter.action = action;

  await connectDB();
  const [items, total] = await Promise.all([
    AuditLog.find(filter)
      .sort({ timestamp: -1, _id: -1 })
      .skip((page - 1) * PAGE_SIZE)
      .limit(PAGE_SIZE)
      .lean(),
    AuditLog.countDocuments(filter),
  ]);

  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <PageTransition>
      <div className="space-y-6 p-4 lg:p-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Audit log</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Compliance trail of every mutating action.
          </p>
        </div>

        <form className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="text-sm text-text-secondary sm:mr-2">Filter by action</label>
          <select
            name="action"
            defaultValue={action}
            className="w-full rounded-input border border-border bg-surface px-3 py-1.5 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 sm:w-auto"
          >
            <option value="">All</option>
            {AUDIT_ACTIONS.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-btn bg-brand px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand-dark transition-colors duration-fast"
          >
            Apply
          </button>
        </form>

        {items.length === 0 ? (
          <EmptyState
            icon={ShieldAlert}
            title="No audit log entries"
            description="Once users start making changes, the trail will appear here."
          />
        ) : (
          <>
            {/* Mobile card list (Action, User, Time only — diff hidden) */}
            <div className="space-y-3 sm:hidden">
              {items.map((a, i) => (
                <div
                  key={String(a._id)}
                  style={{ animationDelay: `${i * 25}ms` }}
                  className="rounded-card border border-border bg-surface p-card shadow-card animate-fade-up"
                >
                  <div className="flex items-start justify-between gap-2">
                    <ActionTag action={a.action} />
                    <span className="text-xs text-text-muted whitespace-nowrap">
                      {new Date(a.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-2 truncate text-sm text-text-primary">
                    {a.userEmail || "—"}
                  </p>
                  {a.targetCollection && (
                    <p className="mt-0.5 text-xs text-text-muted">
                      {a.targetCollection}
                      {a.targetId && <> · <span className="font-mono">{String(a.targetId)}</span></>}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop table */}
            <div className="hidden overflow-hidden rounded-card border border-border bg-surface shadow-card sm:block">
              <table className="w-full text-sm">
                <thead className="bg-surface-secondary text-left text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  <tr>
                    <th className="px-4 py-3">When</th>
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3">Action</th>
                    <th className="px-4 py-3">Collection</th>
                    <th className="px-4 py-3">Target</th>
                    <th className="px-4 py-3">IP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {items.map((a, i) => (
                    <tr
                      key={String(a._id)}
                      style={{ animationDelay: `${i * 20}ms` }}
                      className="align-top animate-fade-in transition-colors duration-fast hover:bg-surface-secondary"
                    >
                      <td className="px-4 py-3 text-text-muted whitespace-nowrap">
                        {new Date(a.timestamp).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-text-primary">{a.userEmail || "—"}</td>
                      <td className="px-4 py-3"><ActionTag action={a.action} /></td>
                      <td className="px-4 py-3 text-text-secondary">{a.targetCollection || "—"}</td>
                      <td className="px-4 py-3 text-text-muted font-mono text-xs">
                        {a.targetId ? String(a.targetId) : "—"}
                      </td>
                      <td className="px-4 py-3 text-text-muted font-mono text-xs">{a.ipAddress || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        <div className="flex flex-col items-start justify-between gap-2 text-sm text-text-secondary sm:flex-row sm:items-center">
          <p>Page {page} of {pages} · {total} total</p>
          <div className="flex gap-2">
            {page > 1 && (
              <a
                href={`/admin/audit-log?page=${page - 1}${action ? `&action=${action}` : ""}`}
                className="rounded-btn border border-border bg-surface px-3 py-1.5 hover:bg-surface-secondary transition-colors duration-fast"
              >
                Previous
              </a>
            )}
            {page < pages && (
              <a
                href={`/admin/audit-log?page=${page + 1}${action ? `&action=${action}` : ""}`}
                className="rounded-btn border border-border bg-surface px-3 py-1.5 hover:bg-surface-secondary transition-colors duration-fast"
              >
                Next
              </a>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
