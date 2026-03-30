import { ZustandCookieParser } from "@/lib/zustand-cookie-parser";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { redirectToLogin } from "./services/validate-token";

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
    if (!token) return redirectToLogin(request, pathname);

    try {
      const res = await fetch(
        `${process.env.API_BASE_URL}/api/v1/admin/me`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        },
      );

      if (!res.ok) return redirectToLogin(request, pathname, true);
    } catch {
      return redirectToLogin(request, pathname, true);
    }

    return NextResponse.next();
  }

  // --------------------------
  // 3. Login page
  // --------------------------
  if (pathname === "/login") {
    if (token) {
      try {
        const res = await fetch(
          `${process.env.API_BASE_URL}/api/v1/admin/me`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            cache: "no-store",
          },
        );

        if (res.ok) {
          return NextResponse.redirect(new URL("/admin", request.url));
        }
      } catch {
        // Validation failed, fall through
      }

      // Invalid token — clear it
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
  matcher: ["/((?!_next|favicon|api).*)", "/admin/:path*", "/login"],
};
