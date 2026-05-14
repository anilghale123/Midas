import Link from "next/link";
import { Plus } from "lucide-react";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import FAQ from "@/models/FAQ";
import FaqsTable from "@/components/admin/faqs-table";

export const dynamic = "force-dynamic";

export default async function FaqsPage() {
  const session = await auth();
  const canDelete = session?.user?.role === "SUPER_ADMIN";

  await connectDB();
  const items = await FAQ.find({})
    .sort({ order: 1, createdAt: -1, _id: -1 })
    .lean();

  const serialized = items.map((f) => ({
    ...f,
    _id: String(f._id),
    createdAt: f.createdAt?.toISOString?.() ?? f.createdAt,
    updatedAt: f.updatedAt?.toISOString?.() ?? f.updatedAt,
  }));

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">FAQs</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage questions shown on the public /faq page.
          </p>
        </div>
        <Link
          href="/admin/faqs/new"
          className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          <Plus className="h-4 w-4" />
          New FAQ
        </Link>
      </div>

      <div className="mt-6">
        <FaqsTable initialItems={serialized} canDelete={canDelete} />
      </div>
    </div>
  );
}
