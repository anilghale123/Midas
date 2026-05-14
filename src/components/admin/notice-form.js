"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CldUploadWidget } from "next-cloudinary";
import { Loader2, Upload, X } from "lucide-react";
import { NOTICE_CATEGORIES } from "@/lib/enums";
import { noticeFormSchema } from "@/lib/validations/notice.schema";
import { toSlug } from "@/lib/slug";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export default function NoticeForm({ initial = null, noticeId = null }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(noticeFormSchema),
    defaultValues: {
      title: initial?.title ?? "",
      content: initial?.content ?? "",
      category: initial?.category ?? "General",
      attachmentUrl: initial?.attachmentUrl ?? null,
      cloudinaryPublicId: initial?.cloudinaryPublicId ?? null,
      isActive: initial?.isActive ?? true,
    },
  });

  const title = watch("title");
  const content = watch("content");
  const attachmentUrl = watch("attachmentUrl");
  const slugPreview = useMemo(() => toSlug(title || ""), [title]);

  useEffect(() => {
    register("content");
    register("attachmentUrl");
    register("cloudinaryPublicId");
  }, [register]);

  async function onSubmit(values) {
    setSubmitting(true);
    try {
      const url = noticeId
        ? `/api/admin/notices/${noticeId}`
        : "/api/admin/notices";
      const method = noticeId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        toast.error(json.error ?? "Save failed");
        return;
      }
      toast.success(noticeId ? "Notice updated" : "Notice created");
      router.push("/admin/notices");
      router.refresh();
    } catch (err) {
      toast.error(err.message ?? "Save failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-700">Title</label>
        <input
          {...register("title")}
          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        />
        {errors.title && (
          <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>
        )}
        <p className="mt-1 text-xs text-slate-500">
          Slug preview: <code className="rounded bg-slate-100 px-1">{slugPreview || "(empty)"}</code>
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Category</label>
        <select
          {...register("category")}
          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
        >
          {NOTICE_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Content (Markdown)</label>
        <div className="mt-1" data-color-mode="light">
          <MDEditor
            value={content}
            onChange={(v) => setValue("content", v ?? "", { shouldValidate: true })}
            height={360}
            preview="edit"
          />
        </div>
        {errors.content && (
          <p className="mt-1 text-xs text-red-600">{errors.content.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Attachment (optional)</label>
        {attachmentUrl ? (
          <div className="mt-2 flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
            <a href={attachmentUrl} target="_blank" rel="noreferrer" className="truncate text-blue-600 underline">
              {attachmentUrl}
            </a>
            <button
              type="button"
              onClick={() => {
                setValue("attachmentUrl", null);
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
              maxFileSize: 10_000_000,
              clientAllowedFormats: ["jpg", "jpeg", "png", "pdf", "webp"],
              sources: ["local"],
              multiple: false,
            }}
            onSuccess={(result) => {
              const info = result?.info;
              if (info?.secure_url && info?.public_id) {
                setValue("attachmentUrl", info.secure_url);
                setValue("cloudinaryPublicId", info.public_id);
                toast.success("File uploaded");
              }
            }}
          >
            {({ open }) => (
              <button
                type="button"
                onClick={() => open?.()}
                className="mt-2 inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <Upload className="h-4 w-4" />
                Upload file
              </button>
            )}
          </CldUploadWidget>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          id="isActive"
          type="checkbox"
          {...register("isActive")}
          className="h-4 w-4 rounded border-slate-300"
        />
        <label htmlFor="isActive" className="text-sm text-slate-700">
          Active (visible on public site)
        </label>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {noticeId ? "Save changes" : "Create notice"}
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
