import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import UserForm from "@/components/admin/user-form";
import PageTransition from "@/components/ui/page-transition";

export const dynamic = "force-dynamic";

export default async function NewUserPage() {
  const session = await auth();
  if (session?.user?.role !== "SUPER_ADMIN") redirect("/admin");

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
          <h1 className="text-2xl font-bold text-text-primary">New user</h1>
          <p className="mt-0.5 text-sm text-text-secondary">
            Create a new admin or editor account.
          </p>
        </div>
        <div className="rounded-card border border-border bg-surface p-6 shadow-card">
          <UserForm />
        </div>
      </div>
    </PageTransition>
  );
}
