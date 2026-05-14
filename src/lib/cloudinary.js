import { v2 as cloudinary } from "cloudinary";
import { env } from "@/env";
import { logger } from "@/lib/logger";
import OrphanedAsset from "@/models/OrphanedAsset";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function deleteAsset({ publicId, sourceCollection, sourceId }) {
  if (!publicId) return { ok: true, skipped: true };

  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      invalidate: true,
      resource_type: "auto",
    });

    if (result.result !== "ok" && result.result !== "not found") {
      throw new Error(`Cloudinary delete returned: ${result.result}`);
    }

    logger.info({ publicId, sourceCollection }, "Cloudinary asset deleted");
    return { ok: true, result };
  } catch (err) {
    logger.error({ err, publicId, sourceCollection }, "Cloudinary delete failed");
    try {
      await OrphanedAsset.create({
        cloudinaryPublicId: publicId,
        sourceCollection,
        sourceId: sourceId ?? null,
        lastError: err.message ?? String(err),
      });
    } catch (e2) {
      logger.error({ err: e2 }, "Failed to record orphaned asset");
    }
    return { ok: false, error: err };
  }
}

export { cloudinary };
