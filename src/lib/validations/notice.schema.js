import { z } from "zod";
import { NOTICE_CATEGORIES } from "@/lib/enums";

export const noticeBaseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  content: z.string().min(10, "Content must be at least 10 characters"),
  category: z.enum(NOTICE_CATEGORIES),
  attachmentUrl: z.string().url().nullable().optional(),
  cloudinaryPublicId: z.string().nullable().optional(),
  isActive: z.boolean().optional().default(true),
  publishedAt: z.coerce.date().optional(),
});

export const noticeCreateSchema = noticeBaseSchema;

export const noticeUpdateSchema = noticeBaseSchema.partial();

export const noticeFormSchema = noticeBaseSchema;

export const noticeListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().optional(),
  category: z.enum(NOTICE_CATEGORIES).optional(),
  isActive: z
    .union([z.literal("true"), z.literal("false")])
    .transform((v) => v === "true")
    .optional(),
  sort: z.enum(["createdAt", "updatedAt", "title", "publishedAt"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
});
