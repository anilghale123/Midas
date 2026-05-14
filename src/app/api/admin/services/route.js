import { revalidateTag } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import Service from "@/models/Service";
import { serviceCreateSchema } from "@/lib/validations/service.schema";
import { handleApi, requireRole, jsonOk, jsonError } from "@/lib/withAuth";
import { writeAudit, clientIpFromHeaders } from "@/lib/audit";

export const dynamic = "force-dynamic";

export const GET = handleApi(async (req) => {
  await requireRole(req, ["SUPER_ADMIN", "EDITOR"]);
  await connectDB();
  const items = await Service.find({})
    .sort({ order: 1, createdAt: -1, _id: -1 })
    .lean();
  return jsonOk({ items });
});

export const POST = handleApi(async (req) => {
  const session = await requireRole(req, ["SUPER_ADMIN", "EDITOR"]);
  await connectDB();

  const body = await req.json().catch(() => null);
  const parsed = serviceCreateSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(400, "Validation failed", parsed.error.flatten());
  }

  const doc = await Service.create(parsed.data);

  await writeAudit({
    userId: session.user.id,
    userEmail: session.user.email,
    action: "CREATE",
    targetCollection: "services",
    targetId: doc._id,
    after: doc.toObject(),
    ipAddress: clientIpFromHeaders(req.headers),
    userAgent: req.headers.get("user-agent") ?? "",
  });

  revalidateTag("services");
  return jsonOk(doc.toObject(), { status: 201 });
});
