import mongoose from "mongoose";

// Flexible content store. Each page (home, about, header, footer, contact,
// sanctions, downloads) is a single document keyed by `key`. The shape of
// `data` is validated per-key with Zod in src/lib/validations/page-content.schema.js
// — Mongoose stores it as Mixed so we keep schema evolution easy.
const PageContentSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, index: true },
    data: { type: mongoose.Schema.Types.Mixed, default: {} },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: { createdAt: true, updatedAt: true }, minimize: false }
);

export const PAGE_CONTENT_KEYS = [
  "home",
  "about",
  "header",
  "footer",
  "contact",
  "sanctions",
  "downloads",
];

export default mongoose.models.PageContent ||
  mongoose.model("PageContent", PageContentSchema);
