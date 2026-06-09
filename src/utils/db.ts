import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

// Bind the runtime adapter securely to local SQLite data target
const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL,
});

/**
 * Global Isolated Database Connection Pool Gateway for Prisma v7.
 */
export const db = new PrismaClient({ adapter });
