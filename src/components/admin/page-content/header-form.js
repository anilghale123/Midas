"use client";

import PageContentSavebar from "@/components/admin/page-content-actions";
import ItemListEditor from "@/components/admin/item-list-editor";
import { Field, Section, inputClass } from "@/components/admin/form-primitives";

export default function HeaderContentForm({ initial }) {
  return (
    <PageContentSavebar pageKey="header" initial={initial}>
      {({ value, setValue }) => (
        <>
          <Section title="Main navigation" description="Top-bar links. Use children to create a dropdown.">
            <ItemListEditor
              title="Navigation items"
              addLabel="Add nav item"
              items={value.navigation ?? []}
              onChange={(next) => setValue((v) => ({ ...v, navigation: next }))}
              columns={[
                { key: "name", label: "Label" },
                { key: "href", label: "URL" },
                {
                  key: "children",
                  label: "Children",
                  render: (it) => (it.children?.length ? `${it.children.length} item(s)` : "—"),
                },
              ]}
              emptyDraft={{ name: "", href: "/", children: [] }}
              renderForm={({ draft, setDraft }) => (
                <>
                  <Field label="Label"><input className={inputClass} value={draft.name ?? ""} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></Field>
                  <Field label="URL"><input className={inputClass} value={draft.href ?? ""} onChange={(e) => setDraft({ ...draft, href: e.target.value })} /></Field>
                  <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                    <p className="text-xs font-semibold text-slate-600 mb-2">
                      Dropdown children (optional)
                    </p>
                    <ChildList
                      items={draft.children ?? []}
                      onChange={(next) => setDraft({ ...draft, children: next })}
                    />
                  </div>
                </>
              )}
            />
          </Section>

          <Section title="Portal auth links" description="Top-right links — NEPSE Login / MIDAS Login / Demat Login.">
            <ItemListEditor
              title="Auth links"
              addLabel="Add auth link"
              items={value.authLinks ?? []}
              onChange={(next) => setValue((v) => ({ ...v, authLinks: next }))}
              columns={[
                { key: "name", label: "Label" },
                { key: "href", label: "URL" },
              ]}
              emptyDraft={{ name: "", href: "" }}
              renderForm={({ draft, setDraft }) => (
                <>
                  <Field label="Label"><input className={inputClass} value={draft.name ?? ""} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></Field>
                  <Field label="URL"><input className={inputClass} value={draft.href ?? ""} onChange={(e) => setDraft({ ...draft, href: e.target.value })} /></Field>
                </>
              )}
            />
          </Section>
        </>
      )}
    </PageContentSavebar>
  );
}

function ChildList({ items, onChange }) {
  function update(idx, patch) {
    const next = [...items];
    next[idx] = { ...next[idx], ...patch };
    onChange(next);
  }
  function remove(idx) {
    const next = [...items];
    next.splice(idx, 1);
    onChange(next);
  }
  return (
    <div className="space-y-2">
      {items.length === 0 && <p className="text-xs text-slate-500">No children.</p>}
      {items.map((c, idx) => (
        <div key={idx} className="grid grid-cols-12 gap-2 items-center">
          <input
            className={`${inputClass} mt-0 col-span-5`}
            placeholder="Label"
            value={c.name ?? ""}
            onChange={(e) => update(idx, { name: e.target.value })}
          />
          <input
            className={`${inputClass} mt-0 col-span-6`}
            placeholder="URL"
            value={c.href ?? ""}
            onChange={(e) => update(idx, { href: e.target.value })}
          />
          <button
            type="button"
            onClick={() => remove(idx)}
            className="col-span-1 text-xs text-red-600 hover:underline"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, { name: "", href: "" }])}
        className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
      >
        + Add child
      </button>
    </div>
  );
}
