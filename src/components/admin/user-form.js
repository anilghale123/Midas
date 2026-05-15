"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { ROLES } from "@/lib/enums";
import { userCreateSchema, userUpdateSchema } from "@/lib/validations/user.schema";

const INPUT_CLASS =
  "mt-1 block w-full rounded-input border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 transition-shadow duration-fast";

export default function UserForm({
  initial = null,
  userId = null,
  onSuccess,
  onCancel,
}) {
  const router = useRouter();
  const isEdit = Boolean(userId);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      if (onSuccess) {
        onSuccess(json.data ?? json);
      } else {
        router.push("/admin/users");
        router.refresh();
      }
    } catch (err) {
      toast.error(err.message ?? "Save failed");
    } finally {
      setSubmitting(false);
    }
  }

  function handleCancel() {
    if (onCancel) onCancel();
    else router.back();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Field label="Name" error={errors.name?.message}>
        <input {...register("name")} className={INPUT_CLASS} />
      </Field>

      {!isEdit && (
        <Field label="Email" error={errors.email?.message}>
          <input type="email" {...register("email")} className={INPUT_CLASS} />
        </Field>
      )}

      <Field
        label={isEdit ? "New password (leave blank to keep current)" : "Password (min 12 chars)"}
        error={errors.password?.message}
      >
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            {...register("password")}
            className={INPUT_CLASS + " pr-10"}
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-text-muted hover:text-text-primary"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </Field>

      <Field label="Role">
        <select {...register("role")} className={INPUT_CLASS}>
          {ROLES.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </Field>

      {isEdit && (
        <label className="flex items-center gap-2 text-sm text-text-primary">
          <input
            type="checkbox"
            {...register("isActive")}
            className="h-4 w-4 rounded border-border accent-brand"
          />
          Active
        </label>
      )}

      <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={handleCancel}
          className="rounded-btn border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary hover:bg-surface-secondary transition-colors duration-fast"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 rounded-btn bg-brand px-4 py-2 text-sm font-semibold text-white shadow-brand hover:bg-brand-dark transition-colors duration-fast disabled:opacity-60"
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {isEdit ? "Save changes" : "Create user"}
        </button>
      </div>
    </form>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-text-primary">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
}
