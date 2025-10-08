import { PrismaClient } from "@prisma/client";
import { env } from "../env";

/**
 * Creates a new instance of the PrismaClient with appropriate logging.
 * In development, logs queries, errors, and warnings.
 * In production, only logs errors.
 *
 * @returns {PrismaClient} A new PrismaClient instance
 */
const createPrismaClient = () =>
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

/**
 * Global reference for Prisma client to prevent creating multiple instances
 * during development when using hot-reloading (e.g., Next.js).
 */
const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

/**
 * Singleton Prisma client instance.
 * Reuses the same instance in development to avoid exhausting database connections.
 */
export const db = globalForPrisma.prisma ?? createPrismaClient();

// Assign to global object in development for hot-reload safety
if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;
