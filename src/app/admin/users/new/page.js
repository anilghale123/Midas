import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import UserForm from "@/components/admin/user-form";

export const dynamic = "force-dynamic";

export default async function NewUserPage() {
  const session = await auth();
  if (session?.user?.role !== "SUPER_ADMIN") redirect("/admin");

  return (
    <div className="p-8 max-w-3xl">
      <Link href="/admin/users" className="text-sm text-slate-500 hover:text-slate-700">
        &larr; Back to users
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-slate-900">New user</h1>
      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6">
        <UserForm />
      </div>
    </div>
  );
}
