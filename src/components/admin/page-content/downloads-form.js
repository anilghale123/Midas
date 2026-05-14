"use client";

import PageContentSavebar from "@/components/admin/page-content-actions";
import ItemListEditor from "@/components/admin/item-list-editor";
import { Field, Section, inputClass } from "@/components/admin/form-primitives";

export default function DownloadsContentForm({ initial }) {
  return (
    <PageContentSavebar pageKey="downloads" initial={initial}>
      {({ value, setValue }) => {
        const set = (patch) => setValue((v) => ({ ...v, ...patch }));
        return (
          <>
            <Section title="Header">
              <Field label="Eyebrow"><input className={inputClass} value={value.eyebrow ?? ""} onChange={(e) => set({ eyebrow: e.target.value })} /></Field>
              <Field label="Title"><input className={inputClass} value={value.title ?? ""} onChange={(e) => set({ title: e.target.value })} /></Field>
              <Field label="Subtitle"><textarea rows={2} className={inputClass} value={value.subtitle ?? ""} onChange={(e) => set({ subtitle: e.target.value })} /></Field>
            </Section>

            <Section title="Files">
              <ItemListEditor
                title="Downloadable files"
                addLabel="Add file"
                items={value.files ?? []}
                onChange={(next) => set({ files: next })}
                columns={[
                  { key: "title", label: "Title" },
                  { key: "type", label: "Type" },
                  { key: "href", label: "URL" },
                ]}
                emptyDraft={{ title: "", description: "", href: "#", type: "PDF" }}
                renderForm={({ draft, setDraft }) => (
                  <>
                    <Field label="Title"><input className={inputClass} value={draft.title ?? ""} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></Field>
                    <Field label="Description"><textarea rows={2} className={inputClass} value={draft.description ?? ""} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /></Field>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="File URL"><input className={inputClass} value={draft.href ?? "#"} onChange={(e) => setDraft({ ...draft, href: e.target.value })} /></Field>
                      <Field label="Type label"><input className={inputClass} value={draft.type ?? "PDF"} onChange={(e) => setDraft({ ...draft, type: e.target.value })} /></Field>
                    </div>
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
