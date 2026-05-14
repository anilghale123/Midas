import { z } from "zod";

// Every key in PAGE_CONTENT_KEYS has a corresponding Zod schema below.
// All fields default permissively so partial saves don't reject.

const linkSchema = z.object({
  name: z.string().min(1).max(120),
  href: z.string().min(1).max(500),
});

const buttonSchema = z.object({
  text: z.string().max(120).optional().default(""),
  href: z.string().max(500).optional().default(""),
});

const trustBadgeSchema = z.object({
  label: z.string().max(120),
  tone: z.enum(["success", "gold", "primary", "info"]).default("primary"),
});

const statSchema = z.object({
  value: z.string().max(60),
  label: z.string().max(120),
  description: z.string().max(300).optional().default(""),
});

const tickerSchema = z.object({
  symbol: z.string().max(20),
  name: z.string().max(120),
  price: z.string().max(40),
  change: z.string().max(20),
  up: z.boolean().default(true),
});

const accountTypeSchema = z.object({
  title: z.string().max(120),
  badge: z.string().max(60).default(""),
  accent: z.enum(["nepse", "midas", "demat"]).default("nepse"),
  highlighted: z.boolean().default(false),
  description: z.string().max(500).default(""),
  features: z.array(z.string().max(200)).default([]),
  buttonText: z.string().max(120).default(""),
});

const iconCardSchema = z.object({
  title: z.string().max(160),
  description: z.string().max(500),
  iconName: z.string().max(60).optional().default(""),
});

const stepSchema = z.object({
  step: z.string().max(8),
  title: z.string().max(160),
  description: z.string().max(500),
});

// --------------------- home ---------------------
export const homeSchema = z.object({
  hero: z.object({
    eyebrow: z.string().max(200).default(""),
    title: z.string().max(200).default(""),
    subtitle: z.string().max(600).default(""),
    primaryButton: buttonSchema.default({ text: "", href: "" }),
    secondaryButton: buttonSchema.default({ text: "", href: "" }),
    trustBadges: z.array(trustBadgeSchema).default([]),
    stats: z.array(statSchema).default([]),
    dashboard: z.object({
      indexLabel: z.string().max(60).default("NEPSE Index"),
      indexValue: z.string().max(40).default(""),
      indexChange: z.string().max(40).default(""),
      indexPercent: z.string().max(20).default(""),
      isPositive: z.boolean().default(true),
      tickers: z.array(tickerSchema).default([]),
    }).default({}),
  }).default({}),
  marketStats: z.array(statSchema).default([]),
  accountTypes: z.array(accountTypeSchema).default([]),
  whyTradeShares: z.array(iconCardSchema).default([]),
  whyMidas: z.array(iconCardSchema).default([]),
  tradingProcess: z.array(stepSchema).default([]),
  newsletter: z.object({
    title: z.string().max(200).default(""),
    description: z.string().max(500).default(""),
    placeholder: z.string().max(120).default(""),
    buttonText: z.string().max(60).default(""),
    microcopy: z.string().max(200).default(""),
  }).default({}),
});

// --------------------- about ---------------------
export const aboutSchema = z.object({
  eyebrow: z.string().max(200).default(""),
  title: z.string().max(200).default(""),
  brokerNumber: z.string().max(20).default(""),
  regulatoryBody: z.string().max(200).default(""),
  introduction: z.string().max(2000).default(""),
  mission: z.string().max(2000).default(""),
  accessibility: z.string().max(2000).default(""),
  coreValues: z.array(iconCardSchema).default([]),
});

// --------------------- header ---------------------
const navItemSchema = z.object({
  name: z.string().max(60),
  href: z.string().max(500),
  children: z.array(linkSchema).optional().default([]),
});

export const headerSchema = z.object({
  navigation: z.array(navItemSchema).default([]),
  authLinks: z.array(linkSchema).default([]),
});

// --------------------- footer ---------------------
const footerColumnSchema = z.object({
  title: z.string().max(60),
  links: z.array(linkSchema).default([]),
});

export const footerSchema = z.object({
  companyBio: z.string().max(1000).default(""),
  columns: z.array(footerColumnSchema).default([]),
  regulatoryLinks: z
    .array(z.object({ label: z.string().max(60), href: z.string().max(500) }))
    .default([]),
  socialLinks: z
    .array(z.object({ platform: z.string().max(40), url: z.string().max(500) }))
    .default([]),
  grievanceOfficer: z.object({
    name: z.string().max(120).default(""),
    role: z.string().max(120).default(""),
    phone: z.string().max(40).default(""),
    email: z.string().max(120).default(""),
  }).default({}),
  brokerNumber: z.string().max(20).default(""),
  regulator: z.string().max(200).default(""),
});

// --------------------- contact ---------------------
const locationSchema = z.object({
  type: z.string().max(80),
  address: z.string().max(500).default(""),
  emails: z.array(z.string().max(120)).default([]),
  phones: z.array(z.string().max(40)).default([]),
});

export const contactSchema = z.object({
  eyebrow: z.string().max(200).default(""),
  title: z.string().max(200).default(""),
  subtitle: z.string().max(500).default(""),
  locations: z.array(locationSchema).default([]),
  grievanceOfficer: z.object({
    name: z.string().max(120).default(""),
    role: z.string().max(120).default(""),
    phone: z.string().max(40).default(""),
    email: z.string().max(120).default(""),
    description: z.string().max(500).default(""),
  }).default({}),
  hours: z.object({
    label: z.string().max(120).default(""),
    value: z.string().max(200).default(""),
  }).default({}),
});

// --------------------- sanctions ---------------------
const sanctionListSchema = z.object({
  title: z.string().max(200),
  issuer: z.string().max(200).default(""),
  description: z.string().max(500).default(""),
  url: z.string().max(500).default(""),
});

export const sanctionsSchema = z.object({
  eyebrow: z.string().max(200).default(""),
  title: z.string().max(200).default(""),
  description: z.string().max(2000).default(""),
  lists: z.array(sanctionListSchema).default([]),
  disclaimer: z.string().max(1000).default(""),
});

// --------------------- downloads ---------------------
const downloadFileSchema = z.object({
  title: z.string().max(200),
  description: z.string().max(500).default(""),
  href: z.string().max(500).default("#"),
  type: z.string().max(20).default("PDF"),
});

export const downloadsSchema = z.object({
  eyebrow: z.string().max(200).default(""),
  title: z.string().max(200).default(""),
  subtitle: z.string().max(500).default(""),
  files: z.array(downloadFileSchema).default([]),
});

// --------------------- registry ---------------------
export const PAGE_CONTENT_SCHEMAS = {
  home: homeSchema,
  about: aboutSchema,
  header: headerSchema,
  footer: footerSchema,
  contact: contactSchema,
  sanctions: sanctionsSchema,
  downloads: downloadsSchema,
};

export const PAGE_CONTENT_LABELS = {
  home: "Home page",
  about: "About page",
  header: "Header & navigation",
  footer: "Footer",
  contact: "Contact page",
  sanctions: "Sanction lists page",
  downloads: "Downloads page",
};
