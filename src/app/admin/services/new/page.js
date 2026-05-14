import Link from "next/link";
import ServiceForm from "@/components/admin/service-form";

export const dynamic = "force-dynamic";

export default function NewServicePage() {
  return (
    <div className="p-8 max-w-3xl">
      <Link href="/admin/services" className="text-sm text-slate-500 hover:text-slate-700">
        &larr; Back to services
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-slate-900">New service</h1>
      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6">
        <ServiceForm />
      </div>
    </div>
  );
}
