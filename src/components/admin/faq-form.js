"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { faqFormSchema } from "@/lib/validations/faq.schema";

export default function FaqForm({ initial = null, faqId = null }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(faqFormSchema),
    defaultValues: {
      question: initial?.question ?? "",
      answer: initial?.answer ?? "",
      category: initial?.category ?? "General",
      order: initial?.order ?? 0,
      isActive: initial?.isActive ?? true,
    },
  });

  async function onSubmit(values) {
    setSubmitting(true);
    try {
      const url = faqId ? `/api/admin/faqs/${faqId}` : "/api/admin/faqs";
      const method = faqId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...values, order: Number(values.order) }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        toast.error(json.error ?? "Save failed");
        return;
      }
      toast.success(faqId ? "FAQ updated" : "FAQ created");
      router.push("/admin/faqs");
      router.refresh();
    } catch (err) {
      toast.error(err.message ?? "Save failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Field label="Question" error={errors.question?.message}>
        <input
          {...register("question")}
          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        />
      </Field>

      <Field label="Answer" error={errors.answer?.message}>
        <textarea
          {...register("answer")}
          rows={6}
          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Category">
          <input
            {...register("category")}
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </Field>
        <Field label="Order (lower = first)">
          <input
            type="number"
            {...register("order", { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </Field>
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          {...register("isActive")}
          className="h-4 w-4 rounded border-slate-300"
        />
        Active (visible on public site)
      </label>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {faqId ? "Save changes" : "Create FAQ"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
