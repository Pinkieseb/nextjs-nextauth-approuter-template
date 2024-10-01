import { PrismaClient } from "@prisma/client";
import logger from "./logger";

declare global {
  var prisma: PrismaClient | undefined;
}

function getDatabaseUrl() {
  if (process.env.NODE_ENV === "production") {
    return "file:./prod.db";
  }
  return "file:./dev.db";
}

export const prisma = global.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

function createPrismaClient() {
  const databaseUrl = getDatabaseUrl();

  const client = new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
    log: [
      { emit: "event", level: "query" },
      { emit: "event", level: "error" },
      { emit: "event", level: "info" },
      { emit: "event", level: "warn" },
    ],
  });

  // Only add event listeners and middleware on the server side
  if (typeof window === "undefined") {
    client.$on("error", (e) => {
      logger.error(`Prisma Error: ${e.message}`);
    });

    client.$on("warn", (e) => {
      logger.warn(`Prisma Warning: ${e.message}`);
    });

    client.$on("info", (e) => {
      logger.info(`Prisma Info: ${e.message}`);
    });

    client.$use(async (params, next) => {
      const before = Date.now();
      const result = await next(params);
      const after = Date.now();
      logger.debug(`Query ${params.model}.${params.action} took ${after - before}ms`);
      return result;
    });
  }

  return client;
}

export default prisma;
