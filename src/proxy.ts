import { ZustandCookieParser } from "@/lib/zustand-cookie-parser";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { redirectToLogin, validateToken } from "./services/validate-token";

export async function proxy(request: NextRequest) {
  const cookies = request.cookies.getAll();

  // Debug
  // ZustandCookieParser.debugCookies(cookies);

  const token = ZustandCookieParser.parseFromRequest(cookies);

  console.log("Parsed token from middleware:", token);

  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (!token) {
      console.log("No token found, redirecting to login");
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const validation = await validateToken(token);
    if (!validation.valid) {
      console.log("Invalid token, redirecting to login");
      return redirectToLogin(request, pathname, true);
    }

    console.log("Valid token, allowing admin access");
    return NextResponse.next();
  }

  if (pathname === "/login") {
    if (token) {
      const validation = await validateToken(token);
      if (validation.valid) {
        console.log(" Valid token, redirecting to admin");
        return NextResponse.redirect(new URL("/admin", request.url));
      } else {
        console.log("Token invalid, clearing and staying on login");
        const response = NextResponse.next();
        response.cookies.delete("admin-auth-token");
        return response;
      }
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/login"],
};
