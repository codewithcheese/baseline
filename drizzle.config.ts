import "dotenv/config";
import type { Config } from "drizzle-kit";

export default {
  dialect: "sqlite",
  schema: "./src/database/schema.ts",
  out: "./src/database/migrations",
  verbose: true,
  strict: true,
} satisfies Config;