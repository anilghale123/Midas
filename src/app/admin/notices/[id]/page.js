import Link from "next/link";
import { notFound } from "next/navigation";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Notice from "@/models/Notice";
import NoticeForm from "@/components/admin/notice-form";

export const dynamic = "force-dynamic";

export default async function EditNoticePage({ params }) {
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) notFound();

  await connectDB();
  const doc = await Notice.findById(id).lean();
  if (!doc) notFound();

  const initial = {
    ...doc,
    _id: String(doc._id),
    authorId: doc.authorId ? String(doc.authorId) : null,
  };

  return (
    <div className="p-8 max-w-3xl">
      <Link
        href="/admin/notices"
        className="text-sm text-slate-500 hover:text-slate-700"
      >
        &larr; Back to notices
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-slate-900">Edit notice</h1>

      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6">
        <NoticeForm initial={initial} noticeId={initial._id} />
      </div>
    </div>
  );
}
