import Link from "next/link";
import { Plus } from "lucide-react";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Service from "@/models/Service";
import ServicesTable from "@/components/admin/services-table";

export const dynamic = "force-dynamic";

export default async function ServicesAdminPage() {
  const session = await auth();
  const canDelete = session?.user?.role === "SUPER_ADMIN";

  await connectDB();
  const items = await Service.find({})
    .sort({ order: 1, createdAt: -1, _id: -1 })
    .lean();

  const serialized = items.map((s) => ({
    ...s,
    _id: String(s._id),
    createdAt: s.createdAt?.toISOString?.() ?? s.createdAt,
    updatedAt: s.updatedAt?.toISOString?.() ?? s.updatedAt,
  }));

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Services</h1>
          <p className="mt-1 text-sm text-slate-500">
            Cards shown on the public /services page.
          </p>
        </div>
        <Link
          href="/admin/services/new"
          className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          <Plus className="h-4 w-4" />
          New service
        </Link>
      </div>

      <div className="mt-6">
        <ServicesTable initialItems={serialized} canDelete={canDelete} />
      </div>
    </div>
  );
}
