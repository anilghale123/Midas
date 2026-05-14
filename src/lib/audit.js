import AuditLog from "@/models/AuditLog";
import { logger } from "@/lib/logger";

function stripSensitive(obj) {
  if (!obj || typeof obj !== "object") return obj;
  const clone = JSON.parse(JSON.stringify(obj));
  const SENSITIVE = ["passwordHash", "password"];
  const walk = (o) => {
    if (!o || typeof o !== "object") return;
    for (const k of Object.keys(o)) {
      if (SENSITIVE.includes(k)) {
        delete o[k];
      } else if (typeof o[k] === "object") {
        walk(o[k]);
      }
    }
  };
  walk(clone);
  return clone;
}

export async function writeAudit({
  userId = null,
  userEmail = "",
  action,
  targetCollection = "",
  targetId = null,
  before = null,
  after = null,
  ipAddress = "",
  userAgent = "",
}) {
  try {
    await AuditLog.create({
      userId,
      userEmail,
      action,
      targetCollection,
      targetId,
      before: stripSensitive(before),
      after: stripSensitive(after),
      ipAddress,
      userAgent,
    });
  } catch (err) {
    logger.error({ err, action, targetCollection }, "audit write failed");
  }
}

export function clientIpFromHeaders(headers) {
  const xff = headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return headers.get("x-real-ip") ?? "";
}
