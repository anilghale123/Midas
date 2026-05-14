"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { settingsUpdateSchema } from "@/lib/validations/settings.schema";

export default function SettingsForm({ initial }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(settingsUpdateSchema),
    defaultValues: {
      siteName: initial?.siteName ?? "MIDAS Stock Broking",
      contactEmail: initial?.contactEmail ?? "",
      contactPhone: initial?.contactPhone ?? "",
      headOfficeAddress: initial?.headOfficeAddress ?? "",
      sebonLicenseNumber: initial?.sebonLicenseNumber ?? "",
      nepseMembershipNumber: initial?.nepseMembershipNumber ?? "",
      tradingHours: initial?.tradingHours ?? "",
      supportEmail: initial?.supportEmail ?? "",
      maintenanceMode: initial?.maintenanceMode ?? false,
      socialLinks: {
        facebook: initial?.socialLinks?.facebook ?? "",
        twitter: initial?.socialLinks?.twitter ?? "",
        linkedin: initial?.socialLinks?.linkedin ?? "",
        instagram: initial?.socialLinks?.instagram ?? "",
        youtube: initial?.socialLinks?.youtube ?? "",
      },
    },
  });

  async function onSubmit(values) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        toast.error(json.error ?? "Save failed");
        return;
      }
      toast.success("Settings saved");
      router.refresh();
    } catch (err) {
      toast.error(err.message ?? "Save failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Brand & Contact
        </h2>
        <Field label="Site name" error={errors.siteName?.message}>
          <input {...register("siteName")} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Contact email" error={errors.contactEmail?.message}>
            <input type="email" {...register("contactEmail")} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </Field>
          <Field label="Support email" error={errors.supportEmail?.message}>
            <input type="email" {...register("supportEmail")} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </Field>
        </div>
        <Field label="Contact phone">
          <input {...register("contactPhone")} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
        </Field>
        <Field label="Head office address">
          <input {...register("headOfficeAddress")} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
        </Field>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Regulatory
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <Field label="SEBON license number">
            <input {...register("sebonLicenseNumber")} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </Field>
          <Field label="NEPSE membership number">
            <input {...register("nepseMembershipNumber")} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </Field>
        </div>
        <Field label="Trading hours">
          <input {...register("tradingHours")} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm" placeholder="Sun–Fri, 11:00–15:00 NST" />
        </Field>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Social links
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Facebook">
            <input {...register("socialLinks.facebook")} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </Field>
          <Field label="Twitter / X">
            <input {...register("socialLinks.twitter")} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </Field>
          <Field label="LinkedIn">
            <input {...register("socialLinks.linkedin")} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </Field>
          <Field label="Instagram">
            <input {...register("socialLinks.instagram")} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </Field>
          <Field label="YouTube">
            <input {...register("socialLinks.youtube")} className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
          </Field>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Site mode
        </h2>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            {...register("maintenanceMode")}
            className="h-4 w-4 rounded border-slate-300"
          />
          Maintenance mode (display a banner on the public site)
        </label>
      </section>

      <div className="flex items-center gap-3 border-t border-slate-200 pt-6">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          Save settings
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
