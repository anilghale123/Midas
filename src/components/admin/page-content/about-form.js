"use client";

import PageContentSavebar from "@/components/admin/page-content-actions";
import ItemListEditor from "@/components/admin/item-list-editor";
import { Field, Section, inputClass } from "@/components/admin/form-primitives";

export default function AboutContentForm({ initial }) {
  return (
    <PageContentSavebar pageKey="about" initial={initial}>
      {({ value, setValue }) => {
        const set = (patch) => setValue((v) => ({ ...v, ...patch }));
        return (
          <>
            <Section title="Header">
              <Field label="Eyebrow">
                <input className={inputClass} value={value.eyebrow ?? ""} onChange={(e) => set({ eyebrow: e.target.value })} />
              </Field>
              <Field label="Title">
                <input className={inputClass} value={value.title ?? ""} onChange={(e) => set({ title: e.target.value })} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Broker number">
                  <input className={inputClass} value={value.brokerNumber ?? ""} onChange={(e) => set({ brokerNumber: e.target.value })} />
                </Field>
                <Field label="Regulatory body">
                  <input className={inputClass} value={value.regulatoryBody ?? ""} onChange={(e) => set({ regulatoryBody: e.target.value })} />
                </Field>
              </div>
            </Section>

            <Section title="Body copy">
              <Field label="Introduction"><textarea rows={4} className={inputClass} value={value.introduction ?? ""} onChange={(e) => set({ introduction: e.target.value })} /></Field>
              <Field label="Mission"><textarea rows={3} className={inputClass} value={value.mission ?? ""} onChange={(e) => set({ mission: e.target.value })} /></Field>
              <Field label="Accessibility"><textarea rows={3} className={inputClass} value={value.accessibility ?? ""} onChange={(e) => set({ accessibility: e.target.value })} /></Field>
            </Section>

            <Section title="Core values">
              <ItemListEditor
                title="Values"
                addLabel="Add value"
                items={value.coreValues ?? []}
                onChange={(next) => set({ coreValues: next })}
                columns={[
                  { key: "title", label: "Title" },
                  { key: "iconName", label: "Icon" },
                ]}
                emptyDraft={{ title: "", description: "", iconName: "" }}
                renderForm={({ draft, setDraft }) => (
                  <>
                    <Field label="Title"><input className={inputClass} value={draft.title ?? ""} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></Field>
                    <Field label="Description"><textarea rows={3} className={inputClass} value={draft.description ?? ""} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /></Field>
                    <Field label="Icon name (lucide-react)" hint="e.g. ShieldCheck, Headphones, Cpu">
                      <input className={inputClass} value={draft.iconName ?? ""} onChange={(e) => setDraft({ ...draft, iconName: e.target.value })} />
                    </Field>
                  </>
                )}
              />
            </Section>
          </>
        );
      }}
    </PageContentSavebar>
  );
}
