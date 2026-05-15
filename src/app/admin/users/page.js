import Link from "next/link";
import { Plus } from "lucide-react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import UsersTable from "@/components/admin/users-table";
import PageTransition from "@/components/ui/page-transition";

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
    <PageTransition>
      <div className="space-y-6 p-4 lg:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Users</h1>
            <p className="mt-0.5 text-sm text-text-secondary">
              Manage admin and editor accounts.
            </p>
          </div>
          <Link
            href="/admin/users/new"
            className="inline-flex w-full items-center justify-center gap-2 rounded-btn bg-brand px-4 py-2 text-sm font-semibold text-white shadow-brand hover:bg-brand-dark transition-colors duration-fast sm:w-auto"
          >
            <Plus className="h-4 w-4" /> New user
          </Link>
        </div>

        <UsersTable initialItems={serialized} currentUserId={session.user.id} />
      </div>
    </PageTransition>
  );
}
