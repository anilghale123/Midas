"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { ROLES } from "@/lib/enums";
import { userCreateSchema, userUpdateSchema } from "@/lib/validations/user.schema";

export default function UserForm({ initial = null, userId = null }) {
  const router = useRouter();
  const isEdit = Boolean(userId);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(isEdit ? userUpdateSchema : userCreateSchema),
    defaultValues: isEdit
      ? {
          name: initial?.name ?? "",
          role: initial?.role ?? "EDITOR",
          isActive: initial?.isActive ?? true,
        }
      : { name: "", email: "", password: "", role: "EDITOR" },
  });

  async function onSubmit(values) {
    setSubmitting(true);
    try {
      const url = isEdit ? `/api/admin/users/${userId}` : "/api/admin/users";
      const method = isEdit ? "PUT" : "POST";
      const payload = { ...values };
      if (isEdit && !payload.password) delete payload.password;

      const res = await fetch(url, {
        method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        toast.error(json.error ?? "Save failed");
        return;
      }
      toast.success(isEdit ? "User updated" : "User created");
      router.push("/admin/users");
      router.refresh();
    } catch (err) {
      toast.error(err.message ?? "Save failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Field label="Name" error={errors.name?.message}>
        <input
          {...register("name")}
          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </Field>

      {!isEdit && (
        <Field label="Email" error={errors.email?.message}>
          <input
            type="email"
            {...register("email")}
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </Field>
      )}

      <Field
        label={isEdit ? "New password (leave blank to keep current)" : "Password (min 12 chars)"}
        error={errors.password?.message}
      >
        <input
          type="password"
          autoComplete="new-password"
          {...register("password")}
          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </Field>

      <Field label="Role">
        <select
          {...register("role")}
          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </Field>

      {isEdit && (
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            {...register("isActive")}
            className="h-4 w-4 rounded border-slate-300"
          />
          Active
        </label>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {isEdit ? "Save changes" : "Create user"}
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
