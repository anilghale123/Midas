import { revalidateTag } from "next/cache";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Service from "@/models/Service";
import { serviceUpdateSchema } from "@/lib/validations/service.schema";
import { handleApi, requireRole, jsonOk, jsonError } from "@/lib/withAuth";
import { writeAudit, clientIpFromHeaders } from "@/lib/audit";
import { deleteAsset } from "@/lib/cloudinary";

function assertObjectId(id) {
  if (!mongoose.isValidObjectId(id)) return jsonError(400, "Invalid id");
  return null;
}

export const GET = handleApi(async (req, { params }) => {
  await requireRole(req, ["SUPER_ADMIN", "EDITOR"]);
  const { id } = await params;
  const bad = assertObjectId(id);
  if (bad) return bad;

  await connectDB();
  const doc = await Service.findById(id).lean();
  if (!doc) return jsonError(404, "Not found");
  return jsonOk(doc);
});

export const PUT = handleApi(async (req, { params }) => {
  const session = await requireRole(req, ["SUPER_ADMIN", "EDITOR"]);
  const { id } = await params;
  const bad = assertObjectId(id);
  if (bad) return bad;

  await connectDB();
  const body = await req.json().catch(() => null);
  const parsed = serviceUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(400, "Validation failed", parsed.error.flatten());
  }

  const before = await Service.findById(id).lean();
  if (!before) return jsonError(404, "Not found");

  const after = await Service.findByIdAndUpdate(id, parsed.data, {
    new: true,
    runValidators: true,
  }).lean();

  await writeAudit({
    userId: session.user.id,
    userEmail: session.user.email,
    action: "UPDATE",
    targetCollection: "services",
    targetId: after._id,
    before,
    after,
    ipAddress: clientIpFromHeaders(req.headers),
    userAgent: req.headers.get("user-agent") ?? "",
  });

  revalidateTag("services");
  return jsonOk(after);
});

export const DELETE = handleApi(async (req, { params }) => {
  const session = await requireRole(req, ["SUPER_ADMIN"]);
  const { id } = await params;
  const bad = assertObjectId(id);
  if (bad) return bad;

  await connectDB();
  const before = await Service.findById(id).lean();
  if (!before) return jsonError(404, "Not found");

  if (before.cloudinaryPublicId) {
    await deleteAsset({
      publicId: before.cloudinaryPublicId,
      sourceCollection: "services",
      sourceId: before._id,
    });
  }

  await Service.deleteOne({ _id: id });

  await writeAudit({
    userId: session.user.id,
    userEmail: session.user.email,
    action: "DELETE",
    targetCollection: "services",
    targetId: before._id,
    before,
    ipAddress: clientIpFromHeaders(req.headers),
    userAgent: req.headers.get("user-agent") ?? "",
  });

  revalidateTag("services");
  return jsonOk({ deleted: true });
});
