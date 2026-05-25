import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Suppress the Prisma binary size warning in Next.js output
  serverExternalPackages: ["@prisma/client", "bcryptjs"],
};

export default nextConfig;
