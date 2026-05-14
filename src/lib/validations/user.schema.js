import { z } from "zod";
import { ROLES } from "@/lib/enums";

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export const userCreateSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(12, "Password must be at least 12 characters"),
  role: z.enum(ROLES).default("EDITOR"),
});

export const userUpdateSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  role: z.enum(ROLES).optional(),
  isActive: z.boolean().optional(),
  password: z.string().min(12).optional(),
});
