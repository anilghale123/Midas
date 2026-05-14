"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CldUploadWidget } from "next-cloudinary";
import { Loader2, Upload, X } from "lucide-react";
import { SERVICE_CATEGORIES } from "@/lib/enums";
import { serviceFormSchema } from "@/lib/validations/service.schema";

export default function ServiceForm({ initial = null, serviceId = null }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      title: initial?.title ?? "",
      shortDescription: initial?.shortDescription ?? "",
      description: initial?.description ?? "",
      longContent: initial?.longContent ?? "",
      category: initial?.category ?? "Other",
      iconUrl: initial?.iconUrl ?? null,
      cloudinaryPublicId: initial?.cloudinaryPublicId ?? null,
      ctaLabel: initial?.ctaLabel ?? "",
      ctaHref: initial?.ctaHref ?? "",
      order: initial?.order ?? 0,
      isActive: initial?.isActive ?? true,
    },
  });

  const iconUrl = watch("iconUrl");

  useEffect(() => {
    register("iconUrl");
    register("cloudinaryPublicId");
  }, [register]);

  async function onSubmit(values) {
    setSubmitting(true);
    try {
      const url = serviceId
        ? `/api/admin/services/${serviceId}`
        : "/api/admin/services";
      const method = serviceId ? "PUT" : "POST";
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
      toast.success(serviceId ? "Service updated" : "Service created");
      router.push("/admin/services");
      router.refresh();
    } catch (err) {
      toast.error(err.message ?? "Save failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Field label="Title" error={errors.title?.message}>
        <input
          {...register("title")}
          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </Field>

      <Field label="Short description (shown on /services card)">
        <textarea
          {...register("shortDescription")}
          rows={3}
          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </Field>

      <Field label="Description (detail page)">
        <textarea
          {...register("description")}
          rows={5}
          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Category">
          <select
            {...register("category")}
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            {SERVICE_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </Field>
        <Field label="Order">
          <input
            type="number"
            {...register("order", { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="CTA label (button text)">
          <input
            {...register("ctaLabel")}
            placeholder="e.g. NEPSE Login"
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </Field>
        <Field label="CTA URL">
          <input
            {...register("ctaHref")}
            placeholder="https://..."
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </Field>
      </div>

      <Field label="Icon image (optional)">
        {iconUrl ? (
          <div className="mt-2 flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
            <a href={iconUrl} target="_blank" rel="noreferrer" className="truncate text-blue-600 underline">
              {iconUrl}
            </a>
            <button
              type="button"
              onClick={() => {
                setValue("iconUrl", null);
                setValue("cloudinaryPublicId", null);
              }}
              className="ml-3 text-slate-500 hover:text-red-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <CldUploadWidget
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
            options={{
              maxFileSize: 5_000_000,
              clientAllowedFormats: ["jpg", "jpeg", "png", "webp", "svg"],
              sources: ["local"],
              multiple: false,
            }}
            onSuccess={(result) => {
              const info = result?.info;
              if (info?.secure_url && info?.public_id) {
                setValue("iconUrl", info.secure_url);
                setValue("cloudinaryPublicId", info.public_id);
                toast.success("Icon uploaded");
              }
            }}
          >
            {({ open }) => (
              <button
                type="button"
                onClick={() => open?.()}
                className="mt-2 inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <Upload className="h-4 w-4" /> Upload icon
              </button>
            )}
          </CldUploadWidget>
        )}
      </Field>

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          {...register("isActive")}
          className="h-4 w-4 rounded border-slate-300"
        />
        Active
      </label>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {serviceId ? "Save changes" : "Create service"}
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
