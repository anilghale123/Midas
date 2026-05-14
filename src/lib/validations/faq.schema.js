import { z } from "zod";

export const faqBaseSchema = z.object({
  question: z.string().min(3).max(500),
  answer: z.string().min(3),
  category: z.string().trim().default("General"),
  order: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export const faqCreateSchema = faqBaseSchema;
export const faqUpdateSchema = faqBaseSchema.partial();
export const faqFormSchema = faqBaseSchema;

export const faqReorderSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string().min(1),
        order: z.number().int().min(0),
      })
    )
    .min(1),
});
