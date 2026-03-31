import { NextRequest, NextResponse } from "next/server";

export function redirectToLogin(
  request: NextRequest,
  fromPath: string,
  clearToken = false,
) {
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("from", fromPath);

  const response = NextResponse.redirect(loginUrl);

  if (clearToken) {
    response.cookies.delete("admin-auth-token");
    response.cookies.delete(
      encodeURIComponent("admin-auth-token|state|accessToken"),
    );
    response.cookies.delete(
      encodeURIComponent("admin-auth-token|state|refreshToken"),
    );
    response.cookies.delete(encodeURIComponent("admin-auth-token|version"));
  }

  return response;
}
