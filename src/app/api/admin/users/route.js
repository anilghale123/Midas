import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { userCreateSchema } from "@/lib/validations/user.schema";
import { handleApi, requireRole, jsonOk, jsonError } from "@/lib/withAuth";
import { writeAudit, clientIpFromHeaders } from "@/lib/audit";

export const dynamic = "force-dynamic";

export const GET = handleApi(async (req) => {
  await requireRole(req, ["SUPER_ADMIN"]);
  await connectDB();
  const items = await User.find({}).sort({ createdAt: -1, _id: -1 }).lean();
  const serialized = items.map((u) => {
    const { passwordHash, ...rest } = u;
    return rest;
  });
  return jsonOk({ items: serialized });
});

export const POST = handleApi(async (req) => {
  const session = await requireRole(req, ["SUPER_ADMIN"]);
  await connectDB();

  const body = await req.json().catch(() => null);
  const parsed = userCreateSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(400, "Validation failed", parsed.error.flatten());
  }
  const { name, email, password, role } = parsed.data;

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) return jsonError(409, "Email already in use");

  const passwordHash = await bcrypt.hash(password, 12);
  const doc = await User.create({
    name,
    email: email.toLowerCase(),
    passwordHash,
    role,
    isActive: true,
  });

  await writeAudit({
    userId: session.user.id,
    userEmail: session.user.email,
    action: "CREATE",
    targetCollection: "users",
    targetId: doc._id,
    after: doc.toObject(),
    ipAddress: clientIpFromHeaders(req.headers),
    userAgent: req.headers.get("user-agent") ?? "",
  });

  const obj = doc.toObject();
  delete obj.passwordHash;
  return jsonOk(obj, { status: 201 });
});
