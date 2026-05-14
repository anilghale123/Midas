"use client";

import PageContentSavebar from "@/components/admin/page-content-actions";
import ItemListEditor from "@/components/admin/item-list-editor";
import { Field, Section, inputClass } from "@/components/admin/form-primitives";

export default function SanctionsContentForm({ initial }) {
  return (
    <PageContentSavebar pageKey="sanctions" initial={initial}>
      {({ value, setValue }) => {
        const set = (patch) => setValue((v) => ({ ...v, ...patch }));
        return (
          <>
            <Section title="Header">
              <Field label="Eyebrow"><input className={inputClass} value={value.eyebrow ?? ""} onChange={(e) => set({ eyebrow: e.target.value })} /></Field>
              <Field label="Title"><input className={inputClass} value={value.title ?? ""} onChange={(e) => set({ title: e.target.value })} /></Field>
              <Field label="Description"><textarea rows={4} className={inputClass} value={value.description ?? ""} onChange={(e) => set({ description: e.target.value })} /></Field>
            </Section>

            <Section title="Sanction lists" description="Each entry links out to the source list.">
              <ItemListEditor
                title="Lists"
                addLabel="Add sanction list"
                items={value.lists ?? []}
                onChange={(next) => set({ lists: next })}
                columns={[
                  { key: "title", label: "Title" },
                  { key: "issuer", label: "Issuer" },
                ]}
                emptyDraft={{ title: "", issuer: "", description: "", url: "" }}
                renderForm={({ draft, setDraft }) => (
                  <>
                    <Field label="Title"><input className={inputClass} value={draft.title ?? ""} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></Field>
                    <Field label="Issuer"><input className={inputClass} value={draft.issuer ?? ""} onChange={(e) => setDraft({ ...draft, issuer: e.target.value })} /></Field>
                    <Field label="Description"><textarea rows={3} className={inputClass} value={draft.description ?? ""} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /></Field>
                    <Field label="URL"><input className={inputClass} value={draft.url ?? ""} onChange={(e) => setDraft({ ...draft, url: e.target.value })} /></Field>
                  </>
                )}
              />
            </Section>

            <Section title="Disclaimer">
              <Field label="Disclaimer text"><textarea rows={3} className={inputClass} value={value.disclaimer ?? ""} onChange={(e) => set({ disclaimer: e.target.value })} /></Field>
            </Section>
          </>
        );
      }}
    </PageContentSavebar>
  );
}
