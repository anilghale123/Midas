"use client";

import { useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";

// Generic editor for a list of objects. Each row is shown in a table; clicking
// "Add" or "Edit" opens a modal where the parent supplies the field controls.
//
// Props:
//  - items: array of objects (controlled)
//  - onChange: (newItems) => void
//  - columns: [{ key, label, render? }] for the table
//  - emptyDraft: object — used when adding a new item
//  - renderForm: ({ draft, setDraft }) => JSX for the modal body
//  - title: section title shown above the table
//  - addLabel: e.g. "Add link"
//  - canEdit (default true) / canDelete (default true)
export default function ItemListEditor({
  items,
  onChange,
  columns,
  emptyDraft,
  renderForm,
  title,
  addLabel = "Add item",
  canEdit = true,
  canDelete = true,
}) {
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [draft, setDraft] = useState(null);

  function startAdd() {
    setEditIndex(null);
    setDraft(structuredClone(emptyDraft));
    setOpen(true);
  }

  function startEdit(idx) {
    setEditIndex(idx);
    setDraft(structuredClone(items[idx]));
    setOpen(true);
  }

  function close() {
    setOpen(false);
    setEditIndex(null);
    setDraft(null);
  }

  function save() {
    if (!draft) return;
    if (editIndex === null) {
      onChange([...(items ?? []), draft]);
    } else {
      const next = [...(items ?? [])];
      next[editIndex] = draft;
      onChange(next);
    }
    close();
  }

  function remove(idx) {
    const next = [...(items ?? [])];
    next.splice(idx, 1);
    onChange(next);
  }

  function move(idx, dir) {
    const next = [...(items ?? [])];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    onChange(next);
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          <p className="text-xs text-slate-500">
            {items?.length ?? 0} item{(items?.length ?? 0) === 1 ? "" : "s"}
          </p>
        </div>
        <button
          type="button"
          onClick={startAdd}
          className="inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
        >
          <Plus className="h-3.5 w-3.5" />
          {addLabel}
        </button>
      </div>

      {(items?.length ?? 0) === 0 ? (
        <div className="px-4 py-8 text-center text-sm text-slate-500">
          No items yet. Click "{addLabel}" to add one.
        </div>
      ) : (
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
            <tr>
              <th className="px-4 py-2 w-12">#</th>
              {columns.map((c) => (
                <th key={c.key} className="px-4 py-2">{c.label}</th>
              ))}
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, idx) => (
              <tr key={idx} className="border-t border-slate-100">
                <td className="px-4 py-2 text-slate-500">
                  <div className="flex flex-col gap-0.5">
                    <button
                      type="button"
                      onClick={() => move(idx, -1)}
                      disabled={idx === 0}
                      className="text-xs text-slate-400 hover:text-slate-700 disabled:opacity-30"
                      title="Move up"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      onClick={() => move(idx, 1)}
                      disabled={idx === items.length - 1}
                      className="text-xs text-slate-400 hover:text-slate-700 disabled:opacity-30"
                      title="Move down"
                    >
                      ▼
                    </button>
                  </div>
                </td>
                {columns.map((c) => (
                  <td key={c.key} className="px-4 py-2 text-slate-700 align-top">
                    {c.render ? c.render(it) : truncate(it[c.key])}
                  </td>
                ))}
                <td className="px-4 py-2">
                  <div className="flex items-center justify-end gap-1.5">
                    {canEdit && (
                      <button
                        type="button"
                        onClick={() => startEdit(idx)}
                        className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 inline-flex items-center gap-1"
                      >
                        <Pencil className="h-3 w-3" />
                        Edit
                      </button>
                    )}
                    {canDelete && (
                      <button
                        type="button"
                        onClick={() => remove(idx)}
                        className="rounded-md border border-red-200 bg-white px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 inline-flex items-center gap-1"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {open && draft && (
        <Modal onClose={close} title={editIndex === null ? `Add ${title.toLowerCase()}` : `Edit ${title.toLowerCase()}`}>
          <div className="space-y-4">{renderForm({ draft, setDraft })}</div>
          <div className="mt-6 flex justify-end gap-2 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={close}
              className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={save}
              className="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white hover:bg-slate-800"
            >
              {editIndex === null ? "Add" : "Save"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function truncate(v) {
  if (v == null) return "—";
  const s = String(v);
  return s.length > 80 ? s.slice(0, 77) + "…" : s;
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <h2 className="text-base font-semibold text-slate-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="pt-4">{children}</div>
      </div>
    </div>
  );
}
