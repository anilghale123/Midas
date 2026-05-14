import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { userUpdateSchema } from "@/lib/validations/user.schema";
import { handleApi, requireRole, jsonOk, jsonError } from "@/lib/withAuth";
import { writeAudit, clientIpFromHeaders } from "@/lib/audit";

function assertObjectId(id) {
  if (!mongoose.isValidObjectId(id)) return jsonError(400, "Invalid id");
  return null;
}

export const GET = handleApi(async (req, { params }) => {
  await requireRole(req, ["SUPER_ADMIN"]);
  const { id } = await params;
  const bad = assertObjectId(id);
  if (bad) return bad;

  await connectDB();
  const doc = await User.findById(id).lean();
  if (!doc) return jsonError(404, "Not found");
  delete doc.passwordHash;
  return jsonOk(doc);
});

export const PUT = handleApi(async (req, { params }) => {
  const session = await requireRole(req, ["SUPER_ADMIN"]);
  const { id } = await params;
  const bad = assertObjectId(id);
  if (bad) return bad;

  await connectDB();
  const body = await req.json().catch(() => null);
  const parsed = userUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(400, "Validation failed", parsed.error.flatten());
  }

  const before = await User.findById(id).lean();
  if (!before) return jsonError(404, "Not found");

  const update = { ...parsed.data };
  if (update.password) {
    update.passwordHash = await bcrypt.hash(update.password, 12);
    delete update.password;
  }

  // Cannot demote/deactivate self
  if (String(session.user.id) === String(id)) {
    if (update.role && update.role !== before.role) {
      return jsonError(400, "Cannot change your own role");
    }
    if (update.isActive === false) {
      return jsonError(400, "Cannot deactivate your own account");
    }
  }

  const after = await User.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true,
  }).lean();

  await writeAudit({
    userId: session.user.id,
    userEmail: session.user.email,
    action: "UPDATE",
    targetCollection: "users",
    targetId: after._id,
    before,
    after,
    ipAddress: clientIpFromHeaders(req.headers),
    userAgent: req.headers.get("user-agent") ?? "",
  });

  delete after.passwordHash;
  return jsonOk(after);
});

export const DELETE = handleApi(async (req, { params }) => {
  const session = await requireRole(req, ["SUPER_ADMIN"]);
  const { id } = await params;
  const bad = assertObjectId(id);
  if (bad) return bad;

  if (String(session.user.id) === String(id)) {
    return jsonError(400, "Cannot delete your own account");
  }

  await connectDB();
  const before = await User.findById(id).lean();
  if (!before) return jsonError(404, "Not found");

  // Soft-delete: deactivate instead of hard-delete (preserve audit references)
  const after = await User.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  ).lean();

  await writeAudit({
    userId: session.user.id,
    userEmail: session.user.email,
    action: "DELETE",
    targetCollection: "users",
    targetId: before._id,
    before,
    after,
    ipAddress: clientIpFromHeaders(req.headers),
    userAgent: req.headers.get("user-agent") ?? "",
  });

  return jsonOk({ deactivated: true });
});
