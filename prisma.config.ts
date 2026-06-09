import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // Explicitly loading environment context via v7 configuration utilities
    url: env("DATABASE_URL") || "file:./dev.db",
  },
  migrations: {
    path: "prisma/migrations",
  },
});
