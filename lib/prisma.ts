import { PrismaClient } from "@prisma/client";

// Prevent multiple PrismaClient instances in development
// (Next.js hot-reloading creates new module instances on each reload)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query"], // logs DB queries in development (remove in production)
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
