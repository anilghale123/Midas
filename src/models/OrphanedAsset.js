import mongoose from "mongoose";

const OrphanedAssetSchema = new mongoose.Schema(
  {
    cloudinaryPublicId: { type: String, required: true, index: true },
    sourceCollection: { type: String, required: true },
    sourceId: { type: mongoose.Schema.Types.ObjectId, default: null },
    failedAt: { type: Date, default: () => new Date(), index: true },
    retryCount: { type: Number, default: 0 },
    lastError: { type: String, default: "" },
    resolvedAt: { type: Date, default: null, index: true },
  },
  { timestamps: false }
);

export default mongoose.models.OrphanedAsset ||
  mongoose.model("OrphanedAsset", OrphanedAssetSchema);
