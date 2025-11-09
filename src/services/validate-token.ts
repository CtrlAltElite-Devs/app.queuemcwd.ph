import { getBaseUrl } from "@/utils";
import { NextRequest, NextResponse } from "next/server";

export async function validateToken(
  token: string,
): Promise<{ valid: boolean; admin?: unknown }> {
  try {
    const response = await fetch(`${getBaseUrl()}/api/admin/validate`, {
      method: "GET",
      headers: {
        Cookie: `admin-auth-token=${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return { valid: false };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Token validation failed:", error);
    return { valid: false };
  }
}

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
  }

  return response;
}
