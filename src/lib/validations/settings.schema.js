import { z } from "zod";

export const settingsUpdateSchema = z.object({
  siteName: z.string().trim().max(100).optional(),
  contactEmail: z.string().trim().email().or(z.literal("")).optional(),
  contactPhone: z.string().trim().max(50).optional(),
  headOfficeAddress: z.string().trim().max(500).optional(),
  branchAddresses: z.array(z.string().trim().max(500)).optional(),
  sebonLicenseNumber: z.string().trim().max(100).optional(),
  nepseMembershipNumber: z.string().trim().max(100).optional(),
  tradingHours: z.string().trim().max(200).optional(),
  supportEmail: z.string().trim().email().or(z.literal("")).optional(),
  maintenanceMode: z.boolean().optional(),
  socialLinks: z
    .object({
      facebook: z.string().trim().max(500).optional().default(""),
      twitter: z.string().trim().max(500).optional().default(""),
      linkedin: z.string().trim().max(500).optional().default(""),
      instagram: z.string().trim().max(500).optional().default(""),
      youtube: z.string().trim().max(500).optional().default(""),
    })
    .optional(),
});
