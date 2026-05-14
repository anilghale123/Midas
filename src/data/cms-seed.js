// CMS Seed Content — flattened to match the Mongo schemas in src/models/.
// Run `npm run seed:content` to load these into MongoDB, or copy individual
// objects into the admin UI manually (each row of `faqs` / `services` /
// `notices` mirrors the create-form payload).

import { faqContent } from "@/data/faq";
import { servicesContent, downloadsContent } from "@/data/services";

// ---------------------- FAQs ----------------------
export const seedFAQs = faqContent.items.map((item, idx) => ({
  question: item.question,
  answer: item.answer,
  category: "General",
  order: idx,
  isActive: true,
}));

// ---------------------- Services ----------------------
export const seedServices = servicesContent.servicesList.map((s, idx) => ({
  title: s.title,
  shortDescription: s.description,
  description: s.description,
  longContent: "",
  category:
    s.id === "nepse-online"
      ? "Trading"
      : s.id === "midas-account"
        ? "Advisory"
        : s.id === "depository-services"
          ? "DEMAT"
          : "Other",
  iconUrl: null,
  cloudinaryPublicId: null,
  ctaLabel: s.actionText,
  ctaHref: s.href,
  order: idx,
  isActive: true,
}));

// ---------------------- Sample Notices ----------------------
// Starter notices so the public /notices page is not empty after seeding.
// Replace freely from the admin UI.
export const seedNotices = [
  {
    title: "Welcome to the new MIDAS website",
    content:
      "We have launched a refreshed, mobile-friendly experience for our clients. " +
      "Browse our services, download forms, and reach our support team — all from one place.",
    category: "General",
    isActive: true,
  },
  {
    title: "T+2 Settlement Reminder",
    content:
      "All buy transactions must be settled within two business days (T+2). " +
      "Please ensure cleared funds reach your MIDAS account on time to avoid auto-sell.",
    category: "Regulatory",
    isActive: true,
  },
];

// ---------------------- Settings (singleton) ----------------------
export const seedSettings = {
  _id: "global",
  siteName: "MIDAS Stock Broking",
  contactEmail: "info@midasstock.com.np",
  contactPhone: "01-5970056",
  headOfficeAddress: "Kathmandu, Nepal",
  branchAddresses: [],
  sebonLicenseNumber: "",
  nepseMembershipNumber: "21",
  tradingHours: "Sun–Fri, 11:00–15:00 NST",
  supportEmail: "support@midasstock.com.np",
  maintenanceMode: false,
  socialLinks: {
    facebook: "",
    twitter: "",
    linkedin: "",
    instagram: "",
    youtube: "",
  },
};

// Useful for the static fallback on public pages until DB is seeded.
export const seedDownloads = downloadsContent;
