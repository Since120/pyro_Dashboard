import { PrismaClient } from "@prisma/client";

// A little global trick to prevent double-initialization in dev
const globalForPrisma = global as unknown as { prisma?: PrismaClient };

// Reuse `prisma` if it's already on the global object,
// otherwise create a new PrismaClient instance.
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // log: ["query"], // optional
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
