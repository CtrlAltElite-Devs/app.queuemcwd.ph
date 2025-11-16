// middleware.ts
import { ZustandCookieParser } from "@/lib/zustand-cookie-parser";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { redirectToLogin, validateToken } from "./services/validate-token";

export async function proxy(request: NextRequest) {
  const cookies = request.cookies.getAll();
  const token = ZustandCookieParser.parseFromRequest(cookies);
  const { pathname } = request.nextUrl;

  // Skip middleware for static assets or maintenance page itself
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname === "/site-maintenance"
  ) {
    return NextResponse.next();
  }

  // --------------------------
  // 1. Site status check
  // --------------------------
  try {
    const res = await fetch(`${process.env.API_BASE_URL}/api/v1/status`, {
      cache: "no-store",
    });
    if (!res.ok) {
      return NextResponse.redirect(new URL("/site-maintenance", request.url));
    }
  } catch {
    return NextResponse.redirect(new URL("/site-maintenance", request.url));
  }

  // --------------------------
  // 2. Admin auth check
  // --------------------------
  if (pathname.startsWith("/admin")) {
    if (!token) return NextResponse.redirect(new URL("/login", request.url));

    const validation = await validateToken(token);
    if (!validation.valid) return redirectToLogin(request, pathname, true);

    return NextResponse.next();
  }

  // --------------------------
  // 3. Login page
  // --------------------------
  if (pathname === "/login") {
    if (token) {
      const validation = await validateToken(token);
      if (validation.valid)
        return NextResponse.redirect(new URL("/admin", request.url));

      // Invalid token → clear
      const response = NextResponse.next();
      response.cookies.delete("admin-auth-token");
      return response;
    }
    return NextResponse.next();
  }

  // --------------------------
  // 4. All other routes
  // --------------------------
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/login", "/:path*"],
};
