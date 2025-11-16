import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(`${process.env.API_BASE_URL}/api/v1/status`);

    if (!response.ok) {
      // API is down
      return NextResponse.json({ status: false });
    }

    // API is up
    return NextResponse.json({ status: true });
  } catch (error) {
    console.error("Error checking API status:", error);
    return NextResponse.json({ status: false });
  }
}
