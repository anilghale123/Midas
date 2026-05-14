import mongoose from "mongoose";
import { SERVICE_CATEGORIES } from "@/lib/enums";

export { SERVICE_CATEGORIES };

const ServiceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    shortDescription: { type: String, default: "" },
    description: { type: String, default: "" },
    longContent: { type: String, default: "" },
    category: {
      type: String,
      enum: SERVICE_CATEGORIES,
      default: "Other",
      index: true,
    },
    iconUrl: { type: String, default: null },
    cloudinaryPublicId: { type: String, default: null },
    ctaLabel: { type: String, default: "" },
    ctaHref: { type: String, default: "" },
    order: { type: Number, default: 0, index: true },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export default mongoose.models.Service || mongoose.model("Service", ServiceSchema);
