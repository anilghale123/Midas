import { revalidateTag } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import Notice from "@/models/Notice";
import { uniqueSlug } from "@/lib/slug";
import {
  noticeCreateSchema,
  noticeListQuerySchema,
} from "@/lib/validations/notice.schema";
import { handleApi, requireRole, jsonOk, jsonError, HttpError } from "@/lib/withAuth";
import { writeAudit, clientIpFromHeaders } from "@/lib/audit";

export const dynamic = "force-dynamic";

export const GET = handleApi(async (req) => {
  await requireRole(req, ["SUPER_ADMIN", "EDITOR"]);
  await connectDB();

  const rawQuery = Object.fromEntries(req.nextUrl.searchParams.entries());
  const parsed = noticeListQuerySchema.safeParse(rawQuery);
  if (!parsed.success) {
    return jsonError(400, "Invalid query", parsed.error.flatten());
  }
  const { page, limit, search, category, isActive, sort, order } = parsed.data;

  const filter = {};
  if (typeof isActive === "boolean") filter.isActive = isActive;
  if (category) filter.category = category;
  if (search) filter.$text = { $search: search };

  const sortSpec = { [sort]: order === "asc" ? 1 : -1, _id: -1 };
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Notice.find(filter)
      .sort(sortSpec)
      .skip(skip)
      .limit(limit)
      .populate({ path: "authorId", select: "name email" })
      .lean(),
    Notice.countDocuments(filter),
  ]);

  return jsonOk({
    items,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

export const POST = handleApi(async (req) => {
  const session = await requireRole(req, ["SUPER_ADMIN", "EDITOR"]);
  await connectDB();

  const body = await req.json().catch(() => null);
  const parsed = noticeCreateSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(400, "Validation failed", parsed.error.flatten());
  }
  const data = parsed.data;

  const slug = await uniqueSlug(Notice, data.title);
  const doc = await Notice.create({
    ...data,
    slug,
    authorId: session.user.id,
    publishedAt: data.publishedAt ?? new Date(),
  });

  await writeAudit({
    userId: session.user.id,
    userEmail: session.user.email,
    action: "CREATE",
    targetCollection: "notices",
    targetId: doc._id,
    after: doc.toObject(),
    ipAddress: clientIpFromHeaders(req.headers),
    userAgent: req.headers.get("user-agent") ?? "",
  });

  revalidateTag("notices");

  return jsonOk(doc.toObject(), { status: 201 });
});
