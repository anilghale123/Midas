import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { connectDB } from "@/lib/mongodb";
import PageContent, { PAGE_CONTENT_KEYS } from "@/models/PageContent";
import { PAGE_CONTENT_LABELS } from "@/lib/validations/page-content.schema";

export const dynamic = "force-dynamic";

const DESCRIPTIONS = {
  home: "Hero, market stats, account types, why-MIDAS, trading process, newsletter.",
  about: "About page intro, mission, accessibility, core values.",
  header: "Top navigation links, dropdowns, and portal auth links.",
  footer: "Company bio, link columns, regulatory links, grievance officer.",
  contact: "Office locations, support hours, grievance contact.",
  sanctions: "Compliance page — AML/CFT sanction list references.",
  downloads: "PDF forms shown on /services/downloads.",
};

export default async function PageContentIndex() {
  await connectDB();
  const docs = await PageContent.find({}).select("key updatedAt").lean();
  const byKey = new Map(docs.map((d) => [d.key, d]));

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-900">Site content</h1>
      <p className="mt-1 text-sm text-slate-500">
        Edit the static content shown on each public page. Changes are revalidated immediately.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {PAGE_CONTENT_KEYS.map((key) => {
          const existing = byKey.get(key);
          return (
            <Link
              key={key}
              href={`/admin/page-content/${key}`}
              className="group rounded-lg border border-slate-200 bg-white p-5 transition hover:border-slate-400 hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    {PAGE_CONTENT_LABELS[key]}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">{DESCRIPTIONS[key]}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5" />
              </div>
              <p className="mt-3 text-[11px] text-slate-400">
                {existing?.updatedAt
                  ? `Last edited ${new Date(existing.updatedAt).toLocaleString()}`
                  : "Not yet customised — using fallback content"}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
