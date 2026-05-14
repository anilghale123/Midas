import { auth } from "@/lib/auth";
import AdminProviders from "@/components/admin/providers";
import Sidebar from "@/components/admin/sidebar";
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
        <div className="min-h-screen bg-slate-50">{children}</div>
      </AdminProviders>
    );
  }

  return (
    <AdminProviders>
      <div className="flex h-screen overflow-hidden bg-slate-50">
        <Sidebar user={session.user} />
        <div className="flex-1 min-w-0 overflow-y-auto">{children}</div>
      </div>
    </AdminProviders>
  );
}
