import { connectDB } from "@/lib/mongodb";
import AuditLog from "@/models/AuditLog";
import { handleApi, requireRole, jsonOk } from "@/lib/withAuth";

export const dynamic = "force-dynamic";

export const GET = handleApi(async (req) => {
  await requireRole(req, ["SUPER_ADMIN"]);
  await connectDB();

  const url = req.nextUrl;
  const page = Math.max(1, Number(url.searchParams.get("page") ?? 1));
  const limit = Math.min(100, Math.max(1, Number(url.searchParams.get("limit") ?? 50)));
  const action = url.searchParams.get("action") || undefined;
  const userEmail = url.searchParams.get("userEmail") || undefined;

  const filter = {};
  if (action) filter.action = action;
  if (userEmail) filter.userEmail = userEmail;

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    AuditLog.find(filter).sort({ timestamp: -1, _id: -1 }).skip(skip).limit(limit).lean(),
    AuditLog.countDocuments(filter),
  ]);

  return jsonOk({
    items,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});
