import Link from "next/link";
import { Plus } from "lucide-react";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Notice from "@/models/Notice";
import NoticesTable from "@/components/admin/notices-table";

export const dynamic = "force-dynamic";

async function getNotices() {
  await connectDB();
  return Notice.find({})
    .sort({ createdAt: -1, _id: -1 })
    .limit(50)
    .populate({ path: "authorId", select: "name email" })
    .lean();
}

export default async function NoticesPage() {
  const session = await auth();
  const canDelete = session?.user?.role === "SUPER_ADMIN";
  const items = await getNotices();

  const serialized = items.map((n) => ({
    ...n,
    _id: String(n._id),
    authorId: n.authorId
      ? { ...n.authorId, _id: String(n.authorId._id) }
      : null,
    createdAt: n.createdAt?.toISOString?.() ?? n.createdAt,
    updatedAt: n.updatedAt?.toISOString?.() ?? n.updatedAt,
  }));

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notices</h1>
          <p className="mt-1 text-sm text-slate-500">
            Publish and manage notices shown on the public site.
          </p>
        </div>
        <Link
          href="/admin/notices/new"
          className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          <Plus className="h-4 w-4" />
          New notice
        </Link>
      </div>

      <div className="mt-6">
        <NoticesTable initialItems={serialized} canDelete={canDelete} />
      </div>
    </div>
  );
}
