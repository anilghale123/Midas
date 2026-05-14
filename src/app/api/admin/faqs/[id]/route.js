import { revalidateTag } from "next/cache";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import FAQ from "@/models/FAQ";
import { faqUpdateSchema } from "@/lib/validations/faq.schema";
import { handleApi, requireRole, jsonOk, jsonError } from "@/lib/withAuth";
import { writeAudit, clientIpFromHeaders } from "@/lib/audit";

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
  const doc = await FAQ.findById(id).lean();
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
  const parsed = faqUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(400, "Validation failed", parsed.error.flatten());
  }

  const before = await FAQ.findById(id).lean();
  if (!before) return jsonError(404, "Not found");

  const after = await FAQ.findByIdAndUpdate(id, parsed.data, {
    new: true,
    runValidators: true,
  }).lean();

  await writeAudit({
    userId: session.user.id,
    userEmail: session.user.email,
    action: "UPDATE",
    targetCollection: "faqs",
    targetId: after._id,
    before,
    after,
    ipAddress: clientIpFromHeaders(req.headers),
    userAgent: req.headers.get("user-agent") ?? "",
  });

  revalidateTag("faqs");
  return jsonOk(after);
});

export const DELETE = handleApi(async (req, { params }) => {
  const session = await requireRole(req, ["SUPER_ADMIN"]);
  const { id } = await params;
  const bad = assertObjectId(id);
  if (bad) return bad;

  await connectDB();
  const before = await FAQ.findById(id).lean();
  if (!before) return jsonError(404, "Not found");

  await FAQ.deleteOne({ _id: id });

  await writeAudit({
    userId: session.user.id,
    userEmail: session.user.email,
    action: "DELETE",
    targetCollection: "faqs",
    targetId: before._id,
    before,
    ipAddress: clientIpFromHeaders(req.headers),
    userAgent: req.headers.get("user-agent") ?? "",
  });

  revalidateTag("faqs");
  return jsonOk({ deleted: true });
});
