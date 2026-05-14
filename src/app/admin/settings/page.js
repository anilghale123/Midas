import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Settings from "@/models/Settings";
import SettingsForm from "@/components/admin/settings-form";

export const dynamic = "force-dynamic";

export default async function SettingsAdminPage() {
  const session = await auth();
  if (session?.user?.role !== "SUPER_ADMIN") redirect("/admin");

  await connectDB();
  const doc = await Settings.findById("global").lean();
  const initial = doc ?? { _id: "global" };

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
      <p className="mt-1 text-sm text-slate-500">Global site configuration.</p>

      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6">
        <SettingsForm initial={JSON.parse(JSON.stringify(initial))} />
      </div>
    </div>
  );
}
