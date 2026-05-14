import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { adminApiLimiter } from "@/lib/ratelimit";
import { clientIpFromHeaders } from "@/lib/audit";
import { logger } from "@/lib/logger";

export class HttpError extends Error {
  constructor(status, message, details = null) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export function jsonError(status, message, details = null) {
  return NextResponse.json({ success: false, error: message, details }, { status });
}

export function jsonOk(data, init = {}) {
  return NextResponse.json({ success: true, data }, init);
}

export async function requireRole(req, allowedRoles) {
  const session = await auth();
  if (!session?.user) {
    throw new HttpError(401, "Unauthorized");
  }
  if (!allowedRoles.includes(session.user.role)) {
    throw new HttpError(403, "Forbidden");
  }

  const ip = clientIpFromHeaders(req.headers) || "anon";
  const { success, limit, remaining, reset } = await adminApiLimiter.limit(ip);
  if (!success) {
    const retryAfter = Math.max(1, Math.ceil((reset - Date.now()) / 1000));
    throw new HttpError(429, "Too Many Requests", { retryAfter, limit, remaining });
  }

  return session;
}

export function handleApi(fn) {
  return async (req, ctx) => {
    try {
      return await fn(req, ctx);
    } catch (err) {
      if (err instanceof HttpError) {
        const res = jsonError(err.status, err.message, err.details);
        if (err.status === 429 && err.details?.retryAfter) {
          res.headers.set("Retry-After", String(err.details.retryAfter));
        }
        return res;
      }
      logger.error({ err }, "API route error");
      return jsonError(500, "Internal Server Error");
    }
  };
}
