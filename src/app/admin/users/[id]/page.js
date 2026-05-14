import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import mongoose from "mongoose";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import UserForm from "@/components/admin/user-form";

export const dynamic = "force-dynamic";

export default async function EditUserPage({ params }) {
  const session = await auth();
  if (session?.user?.role !== "SUPER_ADMIN") redirect("/admin");

  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) notFound();

  await connectDB();
  const doc = await User.findById(id).lean();
  if (!doc) notFound();
  delete doc.passwordHash;

  const initial = { ...doc, _id: String(doc._id) };

  return (
    <div className="p-8 max-w-3xl">
      <Link href="/admin/users" className="text-sm text-slate-500 hover:text-slate-700">
        &larr; Back to users
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-slate-900">Edit user</h1>
      <p className="mt-1 text-sm text-slate-500">{initial.email}</p>
      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6">
        <UserForm initial={initial} userId={initial._id} />
      </div>
    </div>
  );
}
