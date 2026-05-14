import Link from "next/link";
import { notFound } from "next/navigation";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Service from "@/models/Service";
import ServiceForm from "@/components/admin/service-form";

export const dynamic = "force-dynamic";

export default async function EditServicePage({ params }) {
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) notFound();

  await connectDB();
  const doc = await Service.findById(id).lean();
  if (!doc) notFound();

  const initial = { ...doc, _id: String(doc._id) };

  return (
    <div className="p-8 max-w-3xl">
      <Link href="/admin/services" className="text-sm text-slate-500 hover:text-slate-700">
        &larr; Back to services
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-slate-900">Edit service</h1>
      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6">
        <ServiceForm initial={initial} serviceId={initial._id} />
      </div>
    </div>
  );
}
