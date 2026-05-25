import { SignJWT, jwtVerify } from "jose";

// The secret key used to sign tokens
// Set JWT_SECRET in your .env.local file
const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback_secret_change_this"
);

export interface JWTPayload {
  userId: string;
  email: string;
  [key: string]: unknown;
}

// Sign a new JWT token — called when user logs in
export async function signToken(payload: JWTPayload): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d") // Token expires in 7 days
    .sign(secret);
}

// Verify a JWT token — called on protected routes
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as JWTPayload;
  } catch {
    // Token is invalid or expired
    return null;
  }
}
