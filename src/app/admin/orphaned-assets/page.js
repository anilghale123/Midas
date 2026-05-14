import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import OrphanedAsset from "@/models/OrphanedAsset";
import OrphanedAssetsTable from "@/components/admin/orphaned-assets-table";

export const dynamic = "force-dynamic";

export default async function OrphanedAssetsPage() {
  const session = await auth();
  if (session?.user?.role !== "SUPER_ADMIN") redirect("/admin");

  await connectDB();
  const items = await OrphanedAsset.find({ resolvedAt: null })
    .sort({ failedAt: -1, _id: -1 })
    .lean();

  const serialized = items.map((a) => ({
    ...a,
    _id: String(a._id),
    sourceId: a.sourceId ? String(a.sourceId) : null,
    failedAt: a.failedAt?.toISOString?.() ?? a.failedAt,
  }));

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-900">Orphaned assets</h1>
      <p className="mt-1 text-sm text-slate-500">
        Cloudinary uploads whose source record was deleted but the file remained behind.
        Retry to attempt cleanup.
      </p>

      <div className="mt-6">
        <OrphanedAssetsTable initialItems={serialized} />
      </div>
    </div>
  );
}
