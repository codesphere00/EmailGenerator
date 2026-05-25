import { NextRequest } from "next/server";
import { verifyToken, JWTPayload } from "./jwt";

// Helper to extract and verify the user from the JWT cookie
// Use this in any protected API route
export async function getUserFromRequest(
  req: NextRequest
): Promise<JWTPayload | null> {
  const token = req.cookies.get("token")?.value;

  if (!token) return null;

  return await verifyToken(token);
}
