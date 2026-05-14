import { revalidateTag } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import PageContent, { PAGE_CONTENT_KEYS } from "@/models/PageContent";
import { PAGE_CONTENT_SCHEMAS } from "@/lib/validations/page-content.schema";
import { handleApi, requireRole, jsonOk, jsonError } from "@/lib/withAuth";
import { writeAudit, clientIpFromHeaders } from "@/lib/audit";

export const dynamic = "force-dynamic";

export const GET = handleApi(async (req, { params }) => {
  await requireRole(req, ["SUPER_ADMIN", "EDITOR"]);
  const { key } = await params;
  if (!PAGE_CONTENT_KEYS.includes(key)) return jsonError(400, "Unknown page key");

  await connectDB();
  const doc = await PageContent.findOne({ key }).lean();
  return jsonOk(doc ?? { key, data: {} });
});

export const PUT = handleApi(async (req, { params }) => {
  const session = await requireRole(req, ["SUPER_ADMIN", "EDITOR"]);
  const { key } = await params;
  if (!PAGE_CONTENT_KEYS.includes(key)) return jsonError(400, "Unknown page key");

  const schema = PAGE_CONTENT_SCHEMAS[key];
  if (!schema) return jsonError(400, "No schema for key");

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return jsonError(400, "Validation failed", parsed.error.flatten());
  }

  await connectDB();
  const before = await PageContent.findOne({ key }).lean();

  const after = await PageContent.findOneAndUpdate(
    { key },
    { data: parsed.data, updatedBy: session.user.id },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  ).lean();

  await writeAudit({
    userId: session.user.id,
    userEmail: session.user.email,
    action: before ? "UPDATE" : "CREATE",
    targetCollection: "pagecontents",
    targetId: after._id,
    before,
    after,
    ipAddress: clientIpFromHeaders(req.headers),
    userAgent: req.headers.get("user-agent") ?? "",
  });

  revalidateTag("page-content");
  revalidateTag(`page-content:${key}`);

  return jsonOk(after);
});
