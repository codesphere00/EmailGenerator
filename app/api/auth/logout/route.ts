import { NextResponse } from "next/server";

export async function POST() {
  // Clear the JWT cookie by setting it to expire immediately
  const response = NextResponse.json(
    { message: "Logged out successfully" },
    { status: 200 }
  );

  response.cookies.set("token", "", {
    httpOnly: true,
    maxAge: 0, // Expire immediately
    path: "/",
  });

  return response;
}
