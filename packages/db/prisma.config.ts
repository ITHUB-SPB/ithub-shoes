import path from "node:path";
import type { PrismaConfig } from "prisma";
import { defineConfig, env } from "prisma/config";

import dotenv from "dotenv";

dotenv.config({
  path: ["../../apps/server/.env", ".env"],
});

export default defineConfig({
  schema: path.join("prisma", "schema"),
  migrations: {
    path: path.join("prisma", "migrations"),
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
