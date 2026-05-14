import Link from "next/link";
import NoticeForm from "@/components/admin/notice-form";

export const dynamic = "force-dynamic";

export default function NewNoticePage() {
  return (
    <div className="p-8 max-w-3xl">
      <Link
        href="/admin/notices"
        className="text-sm text-slate-500 hover:text-slate-700"
      >
        &larr; Back to notices
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-slate-900">New notice</h1>

      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6">
        <NoticeForm />
      </div>
    </div>
  );
}
