import mongoose from "mongoose";
import { NOTICE_CATEGORIES } from "@/lib/enums";

export { NOTICE_CATEGORIES };

const NoticeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    content: { type: String, required: true },
    category: {
      type: String,
      enum: NOTICE_CATEGORIES,
      default: "General",
      index: true,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    attachmentUrl: { type: String, default: null },
    cloudinaryPublicId: { type: String, default: null },
    isActive: { type: Boolean, default: true, index: true },
    publishedAt: { type: Date, default: () => new Date() },
  },
  { timestamps: true }
);

NoticeSchema.index({ title: "text", content: "text" });
NoticeSchema.index({ createdAt: -1, _id: -1 });

export default mongoose.models.Notice || mongoose.model("Notice", NoticeSchema);
