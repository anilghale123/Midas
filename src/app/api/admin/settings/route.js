import { revalidateTag } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import Settings from "@/models/Settings";
import { settingsUpdateSchema } from "@/lib/validations/settings.schema";
import { handleApi, requireRole, jsonOk, jsonError } from "@/lib/withAuth";
import { writeAudit, clientIpFromHeaders } from "@/lib/audit";

export const dynamic = "force-dynamic";

export const GET = handleApi(async (req) => {
  await requireRole(req, ["SUPER_ADMIN"]);
  await connectDB();
  const doc = await Settings.findById("global").lean();
  return jsonOk(doc ?? { _id: "global" });
});

export const PUT = handleApi(async (req) => {
  const session = await requireRole(req, ["SUPER_ADMIN"]);
  await connectDB();

  const body = await req.json().catch(() => null);
  const parsed = settingsUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(400, "Validation failed", parsed.error.flatten());
  }

  const before = await Settings.findById("global").lean();
  const after = await Settings.findByIdAndUpdate(
    "global",
    { ...parsed.data, updatedBy: session.user.id },
    { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
  ).lean();

  await writeAudit({
    userId: session.user.id,
    userEmail: session.user.email,
    action: "SETTINGS_CHANGE",
    targetCollection: "settings",
    targetId: null,
    before,
    after,
    ipAddress: clientIpFromHeaders(req.headers),
    userAgent: req.headers.get("user-agent") ?? "",
  });

  revalidateTag("settings");
  return jsonOk(after);
});
