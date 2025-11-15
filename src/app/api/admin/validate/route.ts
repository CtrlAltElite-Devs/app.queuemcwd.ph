import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin-auth-token")?.value;

    if (!token) {
      return NextResponse.json(
        { valid: false, error: "No token provided" },
        { status: 401 },
      );
    }

    const backendResponse = await fetch(
      `${process.env.API_BASE_URL}/api/v1/admin/me`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!backendResponse.ok) {
      return NextResponse.json(
        { valid: false, error: "Invalid token" },
        { status: 401 },
      );
    }

    const adminData = await backendResponse.json();

    return NextResponse.json({
      valid: true,
      admin: adminData,
    });
  } catch (error) {
    console.error("Token validation error:", error);
    return NextResponse.json(
      { valid: false, error: "Validation failed" },
      { status: 500 },
    );
  }
}
