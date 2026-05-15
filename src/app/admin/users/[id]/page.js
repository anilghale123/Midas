import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import mongoose from "mongoose";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import UserForm from "@/components/admin/user-form";
import PageTransition from "@/components/ui/page-transition";

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
    <PageTransition>
      <div className="max-w-2xl space-y-4 p-4 lg:p-8">
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors duration-fast"
        >
          <ArrowLeft className="h-3 w-3" /> Back to users
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Edit user</h1>
          <p className="mt-0.5 text-sm text-text-secondary">{initial.email}</p>
        </div>
        <div className="rounded-card border border-border bg-surface p-6 shadow-card">
          <UserForm initial={initial} userId={initial._id} />
        </div>
      </div>
    </PageTransition>
  );
}
