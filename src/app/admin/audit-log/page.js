import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import AuditLog from "@/models/AuditLog";
import { AUDIT_ACTIONS } from "@/lib/enums";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;

const ACTION_COLOR = {
  CREATE: "bg-emerald-100 text-emerald-700",
  UPDATE: "bg-blue-100 text-blue-700",
  DELETE: "bg-red-100 text-red-700",
  LOGIN: "bg-slate-100 text-slate-700",
  LOGIN_FAILED: "bg-amber-100 text-amber-700",
  SETTINGS_CHANGE: "bg-violet-100 text-violet-700",
};

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
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-900">Audit log</h1>
      <p className="mt-1 text-sm text-slate-500">
        Compliance trail of every mutating action.
      </p>

      <form className="mt-6 flex items-center gap-3 text-sm">
        <label className="text-slate-600">Filter by action:</label>
        <select
          name="action"
          defaultValue={action}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm"
        >
          <option value="">All</option>
          {AUDIT_ACTIONS.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Apply
        </button>
      </form>

      <div className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
            <tr>
              <th className="px-4 py-3">When</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Collection</th>
              <th className="px-4 py-3">Target</th>
              <th className="px-4 py-3">IP</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                  No audit log entries.
                </td>
              </tr>
            ) : (
              items.map((a) => (
                <tr key={String(a._id)} className="border-t border-slate-100 align-top">
                  <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                    {new Date(a.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-slate-700">{a.userEmail || "—"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        "inline-block rounded px-2 py-0.5 text-xs font-medium " +
                        (ACTION_COLOR[a.action] ?? "bg-slate-100 text-slate-700")
                      }
                    >
                      {a.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{a.targetCollection || "—"}</td>
                  <td className="px-4 py-3 text-slate-500 font-mono text-xs">
                    {a.targetId ? String(a.targetId) : "—"}
                  </td>
                  <td className="px-4 py-3 text-slate-500 font-mono text-xs">{a.ipAddress || "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
        <p>
          Page {page} of {pages} · {total} total
        </p>
        <div className="flex gap-2">
          {page > 1 && (
            <a
              href={`/admin/audit-log?page=${page - 1}${action ? `&action=${action}` : ""}`}
              className="rounded-md border border-slate-300 bg-white px-3 py-1.5 hover:bg-slate-50"
            >
              Previous
            </a>
          )}
          {page < pages && (
            <a
              href={`/admin/audit-log?page=${page + 1}${action ? `&action=${action}` : ""}`}
              className="rounded-md border border-slate-300 bg-white px-3 py-1.5 hover:bg-slate-50"
            >
              Next
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
