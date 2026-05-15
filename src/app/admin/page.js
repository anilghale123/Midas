import { connectDB } from "@/lib/mongodb";
import Notice from "@/models/Notice";
import FAQ from "@/models/FAQ";
import Service from "@/models/Service";
import User from "@/models/User";
import OrphanedAsset from "@/models/OrphanedAsset";
import { Bell, HelpCircle, ListChecks, Users, Trash2 } from "lucide-react";
import PageTransition from "@/components/ui/page-transition";
import CountUp from "@/components/ui/count-up";

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

function StatCard({ label, value, Icon, delay = 0 }) {
  return (
    <div
      className="rounded-card border border-border bg-surface p-card shadow-card transition-shadow duration-slow hover:shadow-card-hover animate-fade-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-secondary">{label}</p>
        <Icon className="h-4 w-4 text-text-muted" />
      </div>
      <p className="mt-2 text-3xl font-bold text-text-primary">
        <CountUp end={value} />
      </p>
    </div>
  );
}

export default async function AdminHome() {
  const stats = await getStats();
  const cards = [
    { label: "Notices", value: stats.notices, Icon: Bell },
    { label: "FAQs", value: stats.faqs, Icon: HelpCircle },
    { label: "Services", value: stats.services, Icon: ListChecks },
    { label: "Users", value: stats.users, Icon: Users },
    { label: "Orphaned Assets", value: stats.orphaned, Icon: Trash2 },
  ];

  return (
    <PageTransition>
      <div className="space-y-6 p-4 lg:p-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Overview of MIDAS CMS content.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-5 lg:gap-4">
          {cards.map((c, i) => (
            <StatCard key={c.label} {...c} delay={i * 60} />
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
