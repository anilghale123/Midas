#!/usr/bin/env node
// Seeds FAQs, Services, sample Notices, and Settings from src/data/cms-seed.js.
// Idempotent: re-running upserts by a deterministic natural key.
// Run with: npm run seed:content
//
// Requires a SUPER_ADMIN to exist (use `npm run seed:admin` first) so notices
// can be associated with an author.

import dns from "node:dns";
dns.setDefaultResultOrder("ipv4first");

import mongoose from "mongoose";
import slugify from "slugify";

import { faqContent } from "../src/data/faq.js";
import { servicesContent, downloadsContent } from "../src/data/services.js";
import {
  heroData,
  marketStatsData,
  accountTypesData,
  whyTradeSharesData,
  whyMidasData,
  tradingProcessData,
  newsletterData,
} from "../src/data/home.js";
import { aboutContent } from "../src/data/about.js";
import { navigationData, authLinks } from "../src/data/navigation.js";
import { footerData } from "../src/data/footer.js";
import { contactContent } from "../src/data/contact.js";
import { sanctionLinksContent } from "../src/data/sanctions.js";

const URI = process.env.MONGODB_URI;
const DB_NAME = process.env.MONGODB_DB_NAME ?? "midas";

if (!URI) {
  console.error("MONGODB_URI is required");
  process.exit(1);
}

const toSlug = (s) =>
  slugify(String(s ?? ""), { lower: true, strict: true, trim: true });

const FAQSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: String,
    order: Number,
    isActive: Boolean,
  },
  { timestamps: true }
);
const ServiceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    shortDescription: String,
    description: String,
    longContent: String,
    category: String,
    iconUrl: String,
    cloudinaryPublicId: String,
    ctaLabel: String,
    ctaHref: String,
    order: Number,
    isActive: Boolean,
  },
  { timestamps: true }
);
const NoticeSchema = new mongoose.Schema(
  {
    title: String,
    slug: { type: String, unique: true },
    content: String,
    category: String,
    authorId: mongoose.Schema.Types.ObjectId,
    isActive: Boolean,
    publishedAt: Date,
  },
  { timestamps: true }
);
const UserSchema = new mongoose.Schema(
  { email: String, role: String },
  { timestamps: true }
);
const SettingsSchema = new mongoose.Schema(
  {
    _id: { type: String, default: "global" },
    siteName: String,
    contactEmail: String,
    contactPhone: String,
    headOfficeAddress: String,
    branchAddresses: [String],
    sebonLicenseNumber: String,
    nepseMembershipNumber: String,
    tradingHours: String,
    supportEmail: String,
    maintenanceMode: Boolean,
    socialLinks: {
      facebook: String,
      twitter: String,
      linkedin: String,
      instagram: String,
      youtube: String,
    },
  },
  { timestamps: { createdAt: false, updatedAt: true }, _id: false }
);

const PageContentSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    data: { type: mongoose.Schema.Types.Mixed, default: {} },
    updatedBy: mongoose.Schema.Types.ObjectId,
  },
  { timestamps: true, minimize: false }
);

const FAQ = mongoose.model("FAQ", FAQSchema);
const Service = mongoose.model("Service", ServiceSchema);
const Notice = mongoose.model("Notice", NoticeSchema);
const User = mongoose.model("User", UserSchema);
const Settings = mongoose.model("Settings", SettingsSchema);
const PageContent = mongoose.model("PageContent", PageContentSchema);

await mongoose.connect(URI, { dbName: DB_NAME });
console.log(`Connected to ${DB_NAME}`);

const superAdmin = await User.findOne({ role: "SUPER_ADMIN" }).lean();
if (!superAdmin) {
  console.error(
    "No SUPER_ADMIN user found. Run `npm run seed:admin` first, then retry."
  );
  await mongoose.disconnect();
  process.exit(1);
}

// FAQs — upsert by question text
let fc = 0;
for (let i = 0; i < faqContent.items.length; i++) {
  const item = faqContent.items[i];
  await FAQ.updateOne(
    { question: item.question },
    {
      $set: {
        question: item.question,
        answer: item.answer,
        category: "General",
        order: i,
        isActive: true,
      },
    },
    { upsert: true }
  );
  fc++;
}
console.log(`Upserted ${fc} FAQs`);

// Services — upsert by title
const categoryOf = (id) =>
  id === "nepse-online"
    ? "Trading"
    : id === "midas-account"
      ? "Advisory"
      : id === "depository-services"
        ? "DEMAT"
        : "Other";

let sc = 0;
for (let i = 0; i < servicesContent.servicesList.length; i++) {
  const s = servicesContent.servicesList[i];
  await Service.updateOne(
    { title: s.title },
    {
      $set: {
        title: s.title,
        shortDescription: s.description,
        description: s.description,
        longContent: "",
        category: categoryOf(s.id),
        ctaLabel: s.actionText,
        ctaHref: s.href,
        order: i,
        isActive: true,
      },
    },
    { upsert: true }
  );
  sc++;
}
console.log(`Upserted ${sc} services`);

// Notices — upsert by slug
const starter = [
  {
    title: "Welcome to the new MIDAS website",
    content:
      "We have launched a refreshed, mobile-friendly experience for our clients. " +
      "Browse our services, download forms, and reach our support team — all from one place.",
    category: "General",
  },
  {
    title: "T+2 Settlement Reminder",
    content:
      "All buy transactions must be settled within two business days (T+2). " +
      "Please ensure cleared funds reach your MIDAS account on time to avoid auto-sell.",
    category: "Regulatory",
  },
];
let nc = 0;
for (const n of starter) {
  const slug = toSlug(n.title);
  await Notice.updateOne(
    { slug },
    {
      $set: {
        title: n.title,
        slug,
        content: n.content,
        category: n.category,
        authorId: superAdmin._id,
        isActive: true,
        publishedAt: new Date(),
      },
    },
    { upsert: true }
  );
  nc++;
}
console.log(`Upserted ${nc} notices`);

// Settings — singleton
await Settings.updateOne(
  { _id: "global" },
  {
    $set: {
      siteName: "MIDAS Stock Broking",
      contactEmail: "info@midasstock.com.np",
      contactPhone: "01-5970056",
      headOfficeAddress: "Kathmandu, Nepal",
      sebonLicenseNumber: "",
      nepseMembershipNumber: "21",
      tradingHours: "Sun–Fri, 11:00–15:00 NST",
      supportEmail: "support@midasstock.com.np",
      maintenanceMode: false,
    },
  },
  { upsert: true }
);
console.log("Upserted settings");

// Page content — flexible per-page document
const pageContentSeeds = {
  home: {
    hero: heroData,
    marketStats: marketStatsData,
    accountTypes: accountTypesData,
    whyTradeShares: whyTradeSharesData,
    whyMidas: whyMidasData,
    tradingProcess: tradingProcessData,
    newsletter: newsletterData,
  },
  about: aboutContent,
  header: {
    navigation: navigationData,
    authLinks,
  },
  footer: {
    companyBio: footerData.companyBio,
    columns: Object.entries(footerData.columns ?? {}).map(([title, links]) => ({
      title,
      links,
    })),
    regulatoryLinks: footerData.regulatoryLinks,
    socialLinks: footerData.socialLinks,
    grievanceOfficer: footerData.grievanceOfficer,
    brokerNumber: footerData.brokerNumber,
    regulator: footerData.regulator,
  },
  contact: contactContent,
  sanctions: sanctionLinksContent,
  downloads: downloadsContent,
};

let pcc = 0;
for (const [key, data] of Object.entries(pageContentSeeds)) {
  await PageContent.updateOne(
    { key },
    { $set: { key, data } },
    { upsert: true }
  );
  pcc++;
}
console.log(`Upserted ${pcc} page-content documents`);

await mongoose.disconnect();
console.log("Done.");
process.exit(0);
