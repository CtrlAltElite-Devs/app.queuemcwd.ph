import { ZustandCookieParser } from "@/lib/zustand-cookie-parser";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { redirectToLogin } from "./services/validate-token";

async function tryRefresh(
  request: NextRequest,
  cookies: { name: string; value: string }[],
): Promise<NextResponse | null> {
  const refreshToken =
    ZustandCookieParser.parseRefreshTokenFromRequest(cookies);
  if (!refreshToken) return null;

  try {
    const refreshRes = await fetch(
      `${process.env.API_BASE_URL}/api/v1/admin/refresh`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
        cache: "no-store",
      },
    );

    if (!refreshRes.ok) return null;

    const newTokens = await refreshRes.json();
    const response = NextResponse.next();
    // Use URL-encoded names to match zustand-cookie-storage format
    response.cookies.set(
      encodeURIComponent("admin-auth-token|state|accessToken"),
      encodeURIComponent(newTokens.accessToken),
      { path: "/", sameSite: "lax" },
    );
    response.cookies.set(
      encodeURIComponent("admin-auth-token|state|refreshToken"),
      encodeURIComponent(newTokens.refreshToken),
      { path: "/", sameSite: "lax" },
    );
    return response;
  } catch {
    return null;
  }
}

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
    if (!token) {
      // No access token — try refresh before redirecting
      const refreshed = await tryRefresh(request, cookies);
      if (refreshed) return refreshed;
      return redirectToLogin(request, pathname);
    }

    try {
      const res = await fetch(`${process.env.API_BASE_URL}/api/v1/admin/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (res.ok) return NextResponse.next();

      // Access token expired — try refresh
      const refreshed = await tryRefresh(request, cookies);
      if (refreshed) return refreshed;

      return redirectToLogin(request, pathname, true);
    } catch {
      return redirectToLogin(request, pathname, true);
    }
  }

  // --------------------------
  // 3. Login page
  // --------------------------
  if (pathname === "/login") {
    if (token) {
      try {
        const res = await fetch(`${process.env.API_BASE_URL}/api/v1/admin/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });

        if (res.ok) {
          return NextResponse.redirect(new URL("/admin", request.url));
        }
      } catch {
        // Validation failed, fall through
      }

      // Access token invalid — try refresh before clearing
      const refreshed = await tryRefresh(request, cookies);
      if (refreshed) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }

      // Both tokens invalid — clear and show login
      const response = NextResponse.next();
      response.cookies.delete("admin-auth-token");
      response.cookies.delete(
        encodeURIComponent("admin-auth-token|state|accessToken"),
      );
      response.cookies.delete(
        encodeURIComponent("admin-auth-token|state|refreshToken"),
      );
      response.cookies.delete(encodeURIComponent("admin-auth-token|version"));
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
