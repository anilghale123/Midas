"use client";

import PageContentSavebar from "@/components/admin/page-content-actions";
import ItemListEditor from "@/components/admin/item-list-editor";
import { Field, Section, inputClass } from "@/components/admin/form-primitives";

export default function HomeContentForm({ initial }) {
  return (
    <PageContentSavebar pageKey="home" initial={initial}>
      {({ value, setValue }) => {
        const setHero = (patch) =>
          setValue((v) => ({ ...v, hero: { ...(v.hero ?? {}), ...patch } }));
        const setDashboard = (patch) =>
          setValue((v) => ({
            ...v,
            hero: {
              ...(v.hero ?? {}),
              dashboard: { ...(v.hero?.dashboard ?? {}), ...patch },
            },
          }));
        const setNewsletter = (patch) =>
          setValue((v) => ({ ...v, newsletter: { ...(v.newsletter ?? {}), ...patch } }));

        const hero = value.hero ?? {};
        const dash = hero.dashboard ?? {};

        return (
          <>
            <Section title="Hero" description="Top of the home page.">
              <Field label="Eyebrow">
                <input className={inputClass} value={hero.eyebrow ?? ""} onChange={(e) => setHero({ eyebrow: e.target.value })} />
              </Field>
              <Field label="Title">
                <input className={inputClass} value={hero.title ?? ""} onChange={(e) => setHero({ title: e.target.value })} />
              </Field>
              <Field label="Subtitle">
                <textarea rows={3} className={inputClass} value={hero.subtitle ?? ""} onChange={(e) => setHero({ subtitle: e.target.value })} />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Primary button text">
                  <input className={inputClass} value={hero.primaryButton?.text ?? ""} onChange={(e) => setHero({ primaryButton: { ...(hero.primaryButton ?? {}), text: e.target.value } })} />
                </Field>
                <Field label="Primary button URL">
                  <input className={inputClass} value={hero.primaryButton?.href ?? ""} onChange={(e) => setHero({ primaryButton: { ...(hero.primaryButton ?? {}), href: e.target.value } })} />
                </Field>
                <Field label="Secondary button text">
                  <input className={inputClass} value={hero.secondaryButton?.text ?? ""} onChange={(e) => setHero({ secondaryButton: { ...(hero.secondaryButton ?? {}), text: e.target.value } })} />
                </Field>
                <Field label="Secondary button URL">
                  <input className={inputClass} value={hero.secondaryButton?.href ?? ""} onChange={(e) => setHero({ secondaryButton: { ...(hero.secondaryButton ?? {}), href: e.target.value } })} />
                </Field>
              </div>

              <ItemListEditor
                title="Trust badges"
                addLabel="Add badge"
                items={hero.trustBadges ?? []}
                onChange={(next) => setHero({ trustBadges: next })}
                columns={[
                  { key: "label", label: "Label" },
                  { key: "tone", label: "Tone" },
                ]}
                emptyDraft={{ label: "", tone: "primary" }}
                renderForm={({ draft, setDraft }) => (
                  <>
                    <Field label="Label">
                      <input className={inputClass} value={draft.label ?? ""} onChange={(e) => setDraft({ ...draft, label: e.target.value })} />
                    </Field>
                    <Field label="Tone">
                      <select className={inputClass} value={draft.tone ?? "primary"} onChange={(e) => setDraft({ ...draft, tone: e.target.value })}>
                        <option value="primary">primary (navy)</option>
                        <option value="gold">gold</option>
                        <option value="success">success (green)</option>
                        <option value="info">info (blue)</option>
                      </select>
                    </Field>
                  </>
                )}
              />

              <ItemListEditor
                title="Hero stats"
                addLabel="Add stat"
                items={hero.stats ?? []}
                onChange={(next) => setHero({ stats: next })}
                columns={[
                  { key: "value", label: "Value" },
                  { key: "label", label: "Label" },
                ]}
                emptyDraft={{ value: "", label: "" }}
                renderForm={({ draft, setDraft }) => (
                  <>
                    <Field label="Value">
                      <input className={inputClass} value={draft.value ?? ""} onChange={(e) => setDraft({ ...draft, value: e.target.value })} />
                    </Field>
                    <Field label="Label">
                      <input className={inputClass} value={draft.label ?? ""} onChange={(e) => setDraft({ ...draft, label: e.target.value })} />
                    </Field>
                  </>
                )}
              />
            </Section>

            <Section title="Hero dashboard widget" description="The ticker card shown next to the hero copy.">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Index label">
                  <input className={inputClass} value={dash.indexLabel ?? ""} onChange={(e) => setDashboard({ indexLabel: e.target.value })} />
                </Field>
                <Field label="Index value">
                  <input className={inputClass} value={dash.indexValue ?? ""} onChange={(e) => setDashboard({ indexValue: e.target.value })} />
                </Field>
                <Field label="Index change">
                  <input className={inputClass} value={dash.indexChange ?? ""} onChange={(e) => setDashboard({ indexChange: e.target.value })} />
                </Field>
                <Field label="Index percent">
                  <input className={inputClass} value={dash.indexPercent ?? ""} onChange={(e) => setDashboard({ indexPercent: e.target.value })} />
                </Field>
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" className="h-4 w-4" checked={!!dash.isPositive} onChange={(e) => setDashboard({ isPositive: e.target.checked })} />
                Index is positive (green)
              </label>

              <ItemListEditor
                title="Tickers"
                addLabel="Add ticker"
                items={dash.tickers ?? []}
                onChange={(next) => setDashboard({ tickers: next })}
                columns={[
                  { key: "symbol", label: "Symbol" },
                  { key: "name", label: "Name" },
                  { key: "price", label: "Price" },
                  { key: "change", label: "Change" },
                ]}
                emptyDraft={{ symbol: "", name: "", price: "", change: "", up: true }}
                renderForm={({ draft, setDraft }) => (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Symbol"><input className={inputClass} value={draft.symbol ?? ""} onChange={(e) => setDraft({ ...draft, symbol: e.target.value })} /></Field>
                      <Field label="Name"><input className={inputClass} value={draft.name ?? ""} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></Field>
                      <Field label="Price"><input className={inputClass} value={draft.price ?? ""} onChange={(e) => setDraft({ ...draft, price: e.target.value })} /></Field>
                      <Field label="Change"><input className={inputClass} value={draft.change ?? ""} onChange={(e) => setDraft({ ...draft, change: e.target.value })} /></Field>
                    </div>
                    <label className="flex items-center gap-2 text-sm text-slate-700">
                      <input type="checkbox" className="h-4 w-4" checked={!!draft.up} onChange={(e) => setDraft({ ...draft, up: e.target.checked })} />
                      Up (green)
                    </label>
                  </>
                )}
              />
            </Section>

            <Section title="Market stats section">
              <ItemListEditor
                title="Stats"
                addLabel="Add stat"
                items={value.marketStats ?? []}
                onChange={(next) => setValue((v) => ({ ...v, marketStats: next }))}
                columns={[
                  { key: "value", label: "Value" },
                  { key: "label", label: "Label" },
                  { key: "description", label: "Description" },
                ]}
                emptyDraft={{ value: "", label: "", description: "" }}
                renderForm={({ draft, setDraft }) => (
                  <>
                    <Field label="Value"><input className={inputClass} value={draft.value ?? ""} onChange={(e) => setDraft({ ...draft, value: e.target.value })} /></Field>
                    <Field label="Label"><input className={inputClass} value={draft.label ?? ""} onChange={(e) => setDraft({ ...draft, label: e.target.value })} /></Field>
                    <Field label="Description"><textarea rows={2} className={inputClass} value={draft.description ?? ""} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /></Field>
                  </>
                )}
              />
            </Section>

            <Section title="Account types">
              <ItemListEditor
                title="Account cards"
                addLabel="Add account type"
                items={value.accountTypes ?? []}
                onChange={(next) => setValue((v) => ({ ...v, accountTypes: next }))}
                columns={[
                  { key: "title", label: "Title" },
                  { key: "badge", label: "Badge" },
                  { key: "accent", label: "Accent" },
                ]}
                emptyDraft={{ title: "", badge: "", accent: "nepse", description: "", features: [], buttonText: "", highlighted: false }}
                renderForm={({ draft, setDraft }) => (
                  <>
                    <Field label="Title"><input className={inputClass} value={draft.title ?? ""} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></Field>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Badge"><input className={inputClass} value={draft.badge ?? ""} onChange={(e) => setDraft({ ...draft, badge: e.target.value })} /></Field>
                      <Field label="Accent">
                        <select className={inputClass} value={draft.accent ?? "nepse"} onChange={(e) => setDraft({ ...draft, accent: e.target.value })}>
                          <option value="nepse">nepse</option>
                          <option value="midas">midas</option>
                          <option value="demat">demat</option>
                        </select>
                      </Field>
                    </div>
                    <Field label="Description"><textarea rows={3} className={inputClass} value={draft.description ?? ""} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /></Field>
                    <Field label="Features (one per line)">
                      <textarea rows={3} className={inputClass} value={(draft.features ?? []).join("\n")} onChange={(e) => setDraft({ ...draft, features: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })} />
                    </Field>
                    <Field label="Button text"><input className={inputClass} value={draft.buttonText ?? ""} onChange={(e) => setDraft({ ...draft, buttonText: e.target.value })} /></Field>
                    <label className="flex items-center gap-2 text-sm text-slate-700">
                      <input type="checkbox" className="h-4 w-4" checked={!!draft.highlighted} onChange={(e) => setDraft({ ...draft, highlighted: e.target.checked })} />
                      Highlight this card
                    </label>
                  </>
                )}
              />
            </Section>

            <IconCardListSection
              title="Why trade shares"
              items={value.whyTradeShares ?? []}
              onChange={(next) => setValue((v) => ({ ...v, whyTradeShares: next }))}
            />

            <IconCardListSection
              title="Why MIDAS"
              items={value.whyMidas ?? []}
              onChange={(next) => setValue((v) => ({ ...v, whyMidas: next }))}
            />

            <Section title="Trading process">
              <ItemListEditor
                title="Steps"
                addLabel="Add step"
                items={value.tradingProcess ?? []}
                onChange={(next) => setValue((v) => ({ ...v, tradingProcess: next }))}
                columns={[
                  { key: "step", label: "Step" },
                  { key: "title", label: "Title" },
                ]}
                emptyDraft={{ step: "", title: "", description: "" }}
                renderForm={({ draft, setDraft }) => (
                  <>
                    <Field label="Step number (e.g. 01)"><input className={inputClass} value={draft.step ?? ""} onChange={(e) => setDraft({ ...draft, step: e.target.value })} /></Field>
                    <Field label="Title"><input className={inputClass} value={draft.title ?? ""} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></Field>
                    <Field label="Description"><textarea rows={3} className={inputClass} value={draft.description ?? ""} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /></Field>
                  </>
                )}
              />
            </Section>

            <Section title="Newsletter section">
              <Field label="Title"><input className={inputClass} value={value.newsletter?.title ?? ""} onChange={(e) => setNewsletter({ title: e.target.value })} /></Field>
              <Field label="Description"><textarea rows={2} className={inputClass} value={value.newsletter?.description ?? ""} onChange={(e) => setNewsletter({ description: e.target.value })} /></Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Input placeholder"><input className={inputClass} value={value.newsletter?.placeholder ?? ""} onChange={(e) => setNewsletter({ placeholder: e.target.value })} /></Field>
                <Field label="Button text"><input className={inputClass} value={value.newsletter?.buttonText ?? ""} onChange={(e) => setNewsletter({ buttonText: e.target.value })} /></Field>
              </div>
              <Field label="Microcopy"><input className={inputClass} value={value.newsletter?.microcopy ?? ""} onChange={(e) => setNewsletter({ microcopy: e.target.value })} /></Field>
            </Section>
          </>
        );
      }}
    </PageContentSavebar>
  );
}

function IconCardListSection({ title, items, onChange }) {
  return (
    <Section title={title}>
      <ItemListEditor
        title="Cards"
        addLabel="Add card"
        items={items}
        onChange={onChange}
        columns={[
          { key: "title", label: "Title" },
          { key: "iconName", label: "Icon" },
        ]}
        emptyDraft={{ title: "", description: "", iconName: "" }}
        renderForm={({ draft, setDraft }) => (
          <>
            <Field label="Title"><input className={inputClass} value={draft.title ?? ""} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></Field>
            <Field label="Description"><textarea rows={3} className={inputClass} value={draft.description ?? ""} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /></Field>
            <Field label="Icon name (lucide-react, e.g. ShieldCheck, TrendingUp)" hint="Leave blank to use a default icon.">
              <input className={inputClass} value={draft.iconName ?? ""} onChange={(e) => setDraft({ ...draft, iconName: e.target.value })} />
            </Field>
          </>
        )}
      />
    </Section>
  );
}
