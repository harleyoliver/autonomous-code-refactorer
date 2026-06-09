import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
// Corrected import targeting the official Prisma v7 server entry point file
import { PrismaClient } from "../generated/prisma/client.js";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL,
});

/**
 * Global Isolated Database Connection Pool Gateway for Prisma v7.
 */
export const db = new PrismaClient({ adapter });
