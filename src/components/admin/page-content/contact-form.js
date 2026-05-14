"use client";

import PageContentSavebar from "@/components/admin/page-content-actions";
import ItemListEditor from "@/components/admin/item-list-editor";
import { Field, Section, inputClass } from "@/components/admin/form-primitives";

export default function ContactContentForm({ initial }) {
  return (
    <PageContentSavebar pageKey="contact" initial={initial}>
      {({ value, setValue }) => {
        const set = (patch) => setValue((v) => ({ ...v, ...patch }));
        const setGo = (patch) =>
          setValue((v) => ({ ...v, grievanceOfficer: { ...(v.grievanceOfficer ?? {}), ...patch } }));
        const setHours = (patch) =>
          setValue((v) => ({ ...v, hours: { ...(v.hours ?? {}), ...patch } }));
        return (
          <>
            <Section title="Header">
              <Field label="Eyebrow"><input className={inputClass} value={value.eyebrow ?? ""} onChange={(e) => set({ eyebrow: e.target.value })} /></Field>
              <Field label="Title"><input className={inputClass} value={value.title ?? ""} onChange={(e) => set({ title: e.target.value })} /></Field>
              <Field label="Subtitle"><textarea rows={2} className={inputClass} value={value.subtitle ?? ""} onChange={(e) => set({ subtitle: e.target.value })} /></Field>
            </Section>

            <Section title="Office locations">
              <ItemListEditor
                title="Locations"
                addLabel="Add location"
                items={value.locations ?? []}
                onChange={(next) => set({ locations: next })}
                columns={[
                  { key: "type", label: "Type" },
                  { key: "address", label: "Address" },
                ]}
                emptyDraft={{ type: "", address: "", emails: [], phones: [] }}
                renderForm={({ draft, setDraft }) => (
                  <>
                    <Field label="Type (e.g. Head Office)"><input className={inputClass} value={draft.type ?? ""} onChange={(e) => setDraft({ ...draft, type: e.target.value })} /></Field>
                    <Field label="Address"><input className={inputClass} value={draft.address ?? ""} onChange={(e) => setDraft({ ...draft, address: e.target.value })} /></Field>
                    <Field label="Emails (one per line)">
                      <textarea rows={2} className={inputClass} value={(draft.emails ?? []).join("\n")} onChange={(e) => setDraft({ ...draft, emails: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })} />
                    </Field>
                    <Field label="Phones (one per line)">
                      <textarea rows={2} className={inputClass} value={(draft.phones ?? []).join("\n")} onChange={(e) => setDraft({ ...draft, phones: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })} />
                    </Field>
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
              <Field label="Description"><textarea rows={2} className={inputClass} value={value.grievanceOfficer?.description ?? ""} onChange={(e) => setGo({ description: e.target.value })} /></Field>
            </Section>

            <Section title="Support hours">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Label"><input className={inputClass} value={value.hours?.label ?? ""} onChange={(e) => setHours({ label: e.target.value })} /></Field>
                <Field label="Value"><input className={inputClass} value={value.hours?.value ?? ""} onChange={(e) => setHours({ value: e.target.value })} /></Field>
              </div>
            </Section>
          </>
        );
      }}
    </PageContentSavebar>
  );
}
