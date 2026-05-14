import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import OrphanedAsset from "@/models/OrphanedAsset";
import { cloudinary } from "@/lib/cloudinary";
import { handleApi, requireRole, jsonOk, jsonError } from "@/lib/withAuth";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

export const POST = handleApi(async (req, { params }) => {
  await requireRole(req, ["SUPER_ADMIN"]);
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) return jsonError(400, "Invalid id");

  await connectDB();
  const entry = await OrphanedAsset.findById(id);
  if (!entry) return jsonError(404, "Not found");
  if (entry.resolvedAt) return jsonOk({ alreadyResolved: true });

  try {
    const result = await cloudinary.uploader.destroy(entry.cloudinaryPublicId, {
      invalidate: true,
      resource_type: "auto",
    });
    if (result.result !== "ok" && result.result !== "not found") {
      throw new Error(`Cloudinary delete returned: ${result.result}`);
    }
    entry.resolvedAt = new Date();
    await entry.save();
    return jsonOk({ resolved: true });
  } catch (err) {
    entry.retryCount = (entry.retryCount ?? 0) + 1;
    entry.lastError = err.message ?? String(err);
    await entry.save();
    logger.error({ err, publicId: entry.cloudinaryPublicId }, "Orphan retry failed");
    return jsonError(502, "Cloudinary delete failed", { error: entry.lastError });
  }
});
