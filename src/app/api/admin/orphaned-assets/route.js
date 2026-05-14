import { connectDB } from "@/lib/mongodb";
import OrphanedAsset from "@/models/OrphanedAsset";
import { handleApi, requireRole, jsonOk } from "@/lib/withAuth";

export const dynamic = "force-dynamic";

export const GET = handleApi(async (req) => {
  await requireRole(req, ["SUPER_ADMIN"]);
  await connectDB();
  const items = await OrphanedAsset.find({ resolvedAt: null })
    .sort({ failedAt: -1, _id: -1 })
    .lean();
  return jsonOk({ items });
});
