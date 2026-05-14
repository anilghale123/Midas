import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { headers } from "next/headers";
import { authConfig } from "@/lib/auth.config";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { loginSchema } from "@/lib/validations/user.schema";
import { writeAudit, clientIpFromHeaders } from "@/lib/audit";
import { loginLimiter } from "@/lib/ratelimit";
import { logger } from "@/lib/logger";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        const reqHeaders = await headers().catch(() => null);
        const ip = reqHeaders ? clientIpFromHeaders(reqHeaders) : "";
        const ua = reqHeaders?.get("user-agent") ?? "";

        const { success: rlOk } = await loginLimiter.limit(ip || "anon");
        if (!rlOk) {
          await writeAudit({
            action: "LOGIN_FAILED",
            userEmail: credentials?.email ?? "",
            ipAddress: ip,
            userAgent: ua,
          });
          logger.warn({ ip }, "login rate limit exceeded");
          return null;
        }

        if (!parsed.success) {
          await writeAudit({
            action: "LOGIN_FAILED",
            userEmail: credentials?.email ?? "",
            ipAddress: ip,
            userAgent: ua,
          });
          return null;
        }

        const { email, password } = parsed.data;

        try {
          await connectDB();
          const user = await User.findOne({ email: email.toLowerCase() })
            .select("+passwordHash")
            .lean();

          if (!user || !user.isActive) {
            await writeAudit({
              action: "LOGIN_FAILED",
              userEmail: email,
              ipAddress: ip,
              userAgent: ua,
            });
            return null;
          }

          const ok = await bcrypt.compare(password, user.passwordHash);
          if (!ok) {
            await writeAudit({
              action: "LOGIN_FAILED",
              userId: user._id,
              userEmail: email,
              ipAddress: ip,
              userAgent: ua,
            });
            return null;
          }

          await User.updateOne({ _id: user._id }, { $set: { lastLoginAt: new Date() } });
          await writeAudit({
            action: "LOGIN",
            userId: user._id,
            userEmail: user.email,
            ipAddress: ip,
            userAgent: ua,
          });

          return {
            id: String(user._id),
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (err) {
          logger.error({ err }, "authorize() failed");
          return null;
        }
      },
    }),
  ],
});
