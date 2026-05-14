import { connectDB } from "@/lib/mongodb";
import Notice from "@/models/Notice";
import FAQ from "@/models/FAQ";
import Service from "@/models/Service";
import User from "@/models/User";
import OrphanedAsset from "@/models/OrphanedAsset";
import { Bell, HelpCircle, ListChecks, Users, Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";

async function getStats() {
  await connectDB();
  const [notices, faqs, services, users, orphaned] = await Promise.all([
    Notice.countDocuments({}),
    FAQ.countDocuments({}),
    Service.countDocuments({}),
    User.countDocuments({}),
    OrphanedAsset.countDocuments({ resolvedAt: null }),
  ]);
  return { notices, faqs, services, users, orphaned };
}

function StatCard({ label, value, Icon }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{label}</p>
        <Icon className="h-4 w-4 text-slate-400" />
      </div>
      <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

export default async function AdminHome() {
  const stats = await getStats();
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-500">
        Overview of MIDAS CMS content.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Notices" value={stats.notices} Icon={Bell} />
        <StatCard label="FAQs" value={stats.faqs} Icon={HelpCircle} />
        <StatCard label="Services" value={stats.services} Icon={ListChecks} />
        <StatCard label="Users" value={stats.users} Icon={Users} />
        <StatCard label="Orphaned Assets" value={stats.orphaned} Icon={Trash2} />
      </div>
    </div>
  );
}
