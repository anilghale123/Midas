import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

const LOGIN_PATH = "/admin/login";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = Boolean(req.auth);
  const path = nextUrl.pathname;

  if (path === LOGIN_PATH) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/admin", nextUrl));
    }
    return NextResponse.next();
  }

  if (path.startsWith("/admin")) {
    if (!isLoggedIn) {
      const callbackUrl = encodeURIComponent(path + (nextUrl.search ?? ""));
      return NextResponse.redirect(
        new URL(`${LOGIN_PATH}?callbackUrl=${callbackUrl}`, nextUrl)
      );
    }
    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
