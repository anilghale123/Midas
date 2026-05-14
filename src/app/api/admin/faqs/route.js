import { revalidateTag } from "next/cache";
import { connectDB } from "@/lib/mongodb";
import FAQ from "@/models/FAQ";
import { faqCreateSchema } from "@/lib/validations/faq.schema";
import { handleApi, requireRole, jsonOk, jsonError } from "@/lib/withAuth";
import { writeAudit, clientIpFromHeaders } from "@/lib/audit";

export const dynamic = "force-dynamic";

export const GET = handleApi(async (req) => {
  await requireRole(req, ["SUPER_ADMIN", "EDITOR"]);
  await connectDB();

  const url = req.nextUrl;
  const search = url.searchParams.get("search")?.trim();
  const filter = {};
  if (search) filter.$text = { $search: search };

  const items = await FAQ.find(filter)
    .sort({ order: 1, createdAt: -1, _id: -1 })
    .lean();

  return jsonOk({ items });
});

export const POST = handleApi(async (req) => {
  const session = await requireRole(req, ["SUPER_ADMIN", "EDITOR"]);
  await connectDB();

  const body = await req.json().catch(() => null);
  const parsed = faqCreateSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(400, "Validation failed", parsed.error.flatten());
  }

  const doc = await FAQ.create(parsed.data);

  await writeAudit({
    userId: session.user.id,
    userEmail: session.user.email,
    action: "CREATE",
    targetCollection: "faqs",
    targetId: doc._id,
    after: doc.toObject(),
    ipAddress: clientIpFromHeaders(req.headers),
    userAgent: req.headers.get("user-agent") ?? "",
  });

  revalidateTag("faqs");
  return jsonOk(doc.toObject(), { status: 201 });
});
