import { auth } from "@/lib/auth";
import AdminProviders from "@/components/admin/providers";
import AdminShell from "@/components/admin/admin-shell";
import { headers } from "next/headers";

export const metadata = {
  title: "MIDAS Admin CMS",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }) {
  const session = await auth();
  const hdrs = await headers();
  const pathname = hdrs.get("x-invoke-path") ?? hdrs.get("x-pathname") ?? "";

  const isLoginRoute = pathname.endsWith("/admin/login");

  if (isLoginRoute || !session?.user) {
    return (
      <AdminProviders>
        <div className="min-h-screen bg-surface-secondary">{children}</div>
      </AdminProviders>
    );
  }

  return (
    <AdminProviders>
      <AdminShell user={session.user}>{children}</AdminShell>
    </AdminProviders>
  );
}
