import Link from "next/link";
import { Plus } from "lucide-react";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import UsersTable from "@/components/admin/users-table";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function UsersAdminPage() {
  const session = await auth();
  if (session?.user?.role !== "SUPER_ADMIN") redirect("/admin");

  await connectDB();
  const items = await User.find({}).sort({ createdAt: -1, _id: -1 }).lean();

  const serialized = items.map((u) => {
    const { passwordHash, ...rest } = u;
    return {
      ...rest,
      _id: String(rest._id),
      createdAt: rest.createdAt?.toISOString?.() ?? rest.createdAt,
      updatedAt: rest.updatedAt?.toISOString?.() ?? rest.updatedAt,
      lastLoginAt: rest.lastLoginAt?.toISOString?.() ?? rest.lastLoginAt ?? null,
    };
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Users</h1>
          <p className="mt-1 text-sm text-slate-500">Manage admin and editor accounts.</p>
        </div>
        <Link
          href="/admin/users/new"
          className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          <Plus className="h-4 w-4" /> New user
        </Link>
      </div>

      <div className="mt-6">
        <UsersTable initialItems={serialized} currentUserId={session.user.id} />
      </div>
    </div>
  );
}
