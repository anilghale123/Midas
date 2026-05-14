import Link from "next/link";
import { notFound } from "next/navigation";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import FAQ from "@/models/FAQ";
import FaqForm from "@/components/admin/faq-form";

export const dynamic = "force-dynamic";

export default async function EditFaqPage({ params }) {
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) notFound();

  await connectDB();
  const doc = await FAQ.findById(id).lean();
  if (!doc) notFound();

  const initial = { ...doc, _id: String(doc._id) };

  return (
    <div className="p-8 max-w-3xl">
      <Link href="/admin/faqs" className="text-sm text-slate-500 hover:text-slate-700">
        &larr; Back to FAQs
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-slate-900">Edit FAQ</h1>
      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6">
        <FaqForm initial={initial} faqId={initial._id} />
      </div>
    </div>
  );
}
