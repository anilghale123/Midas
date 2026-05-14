"use client";

import PageContentSavebar from "@/components/admin/page-content-actions";
import ItemListEditor from "@/components/admin/item-list-editor";
import { Field, Section, inputClass } from "@/components/admin/form-primitives";

export default function FooterContentForm({ initial }) {
  return (
    <PageContentSavebar pageKey="footer" initial={initial}>
      {({ value, setValue }) => {
        const set = (patch) => setValue((v) => ({ ...v, ...patch }));
        const setGo = (patch) =>
          setValue((v) => ({ ...v, grievanceOfficer: { ...(v.grievanceOfficer ?? {}), ...patch } }));
        return (
          <>
            <Section title="Brand">
              <Field label="Company bio">
                <textarea rows={3} className={inputClass} value={value.companyBio ?? ""} onChange={(e) => set({ companyBio: e.target.value })} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Broker number"><input className={inputClass} value={value.brokerNumber ?? ""} onChange={(e) => set({ brokerNumber: e.target.value })} /></Field>
                <Field label="Regulator"><input className={inputClass} value={value.regulator ?? ""} onChange={(e) => set({ regulator: e.target.value })} /></Field>
              </div>
            </Section>

            <Section title="Link columns" description="Each column has a heading and a list of links.">
              <ItemListEditor
                title="Columns"
                addLabel="Add column"
                items={value.columns ?? []}
                onChange={(next) => set({ columns: next })}
                columns={[
                  { key: "title", label: "Heading" },
                  { key: "links", label: "Links", render: (it) => `${it.links?.length ?? 0}` },
                ]}
                emptyDraft={{ title: "", links: [] }}
                renderForm={({ draft, setDraft }) => (
                  <>
                    <Field label="Heading"><input className={inputClass} value={draft.title ?? ""} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></Field>
                    <LinkList items={draft.links ?? []} onChange={(next) => setDraft({ ...draft, links: next })} />
                  </>
                )}
              />
            </Section>

            <Section title="Regulatory pill links">
              <ItemListEditor
                title="Pills"
                addLabel="Add link"
                items={value.regulatoryLinks ?? []}
                onChange={(next) => set({ regulatoryLinks: next })}
                columns={[
                  { key: "label", label: "Label" },
                  { key: "href", label: "URL" },
                ]}
                emptyDraft={{ label: "", href: "" }}
                renderForm={({ draft, setDraft }) => (
                  <>
                    <Field label="Label"><input className={inputClass} value={draft.label ?? ""} onChange={(e) => setDraft({ ...draft, label: e.target.value })} /></Field>
                    <Field label="URL"><input className={inputClass} value={draft.href ?? ""} onChange={(e) => setDraft({ ...draft, href: e.target.value })} /></Field>
                  </>
                )}
              />
            </Section>

            <Section title="Social links">
              <ItemListEditor
                title="Socials"
                addLabel="Add social link"
                items={value.socialLinks ?? []}
                onChange={(next) => set({ socialLinks: next })}
                columns={[
                  { key: "platform", label: "Platform" },
                  { key: "url", label: "URL" },
                ]}
                emptyDraft={{ platform: "", url: "" }}
                renderForm={({ draft, setDraft }) => (
                  <>
                    <Field label="Platform"><input className={inputClass} value={draft.platform ?? ""} onChange={(e) => setDraft({ ...draft, platform: e.target.value })} /></Field>
                    <Field label="URL"><input className={inputClass} value={draft.url ?? ""} onChange={(e) => setDraft({ ...draft, url: e.target.value })} /></Field>
                  </>
                )}
              />
            </Section>

            <Section title="Grievance officer">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Name"><input className={inputClass} value={value.grievanceOfficer?.name ?? ""} onChange={(e) => setGo({ name: e.target.value })} /></Field>
                <Field label="Role"><input className={inputClass} value={value.grievanceOfficer?.role ?? ""} onChange={(e) => setGo({ role: e.target.value })} /></Field>
                <Field label="Phone"><input className={inputClass} value={value.grievanceOfficer?.phone ?? ""} onChange={(e) => setGo({ phone: e.target.value })} /></Field>
                <Field label="Email"><input className={inputClass} value={value.grievanceOfficer?.email ?? ""} onChange={(e) => setGo({ email: e.target.value })} /></Field>
              </div>
            </Section>
          </>
        );
      }}
    </PageContentSavebar>
  );
}

function LinkList({ items, onChange }) {
  return (
    <div className="space-y-2">
      {items.length === 0 && <p className="text-xs text-slate-500">No links.</p>}
      {items.map((c, idx) => (
        <div key={idx} className="grid grid-cols-12 gap-2">
          <input
            className={`${inputClass} mt-0 col-span-5`}
            placeholder="Label"
            value={c.name ?? ""}
            onChange={(e) => {
              const next = [...items];
              next[idx] = { ...c, name: e.target.value };
              onChange(next);
            }}
          />
          <input
            className={`${inputClass} mt-0 col-span-6`}
            placeholder="URL"
            value={c.href ?? ""}
            onChange={(e) => {
              const next = [...items];
              next[idx] = { ...c, href: e.target.value };
              onChange(next);
            }}
          />
          <button
            type="button"
            onClick={() => {
              const next = [...items];
              next.splice(idx, 1);
              onChange(next);
            }}
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
        + Add link
      </button>
    </div>
  );
}
