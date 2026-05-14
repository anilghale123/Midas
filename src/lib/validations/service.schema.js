import { z } from "zod";
import { SERVICE_CATEGORIES } from "@/lib/enums";

export const serviceBaseSchema = z.object({
  title: z.string().min(3).max(200),
  shortDescription: z.string().max(300).optional().default(""),
  description: z.string().optional().default(""),
  longContent: z.string().optional().default(""),
  category: z.enum(SERVICE_CATEGORIES).default("Other"),
  iconUrl: z.string().url().nullable().optional(),
  cloudinaryPublicId: z.string().nullable().optional(),
  ctaLabel: z.string().max(100).optional().default(""),
  ctaHref: z.string().max(500).optional().default(""),
  order: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export const serviceCreateSchema = serviceBaseSchema;
export const serviceUpdateSchema = serviceBaseSchema.partial();
export const serviceFormSchema = serviceBaseSchema;
