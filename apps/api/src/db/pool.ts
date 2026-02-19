import { Pool } from "pg";
import { env } from "../config/env";

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: env.DATABASE_SSL ? { rejectUnauthorized: false } : undefined
});

pool.on("error", (error) => {
  console.error("Unexpected database pool error", error);
});

export async function pingDatabase(): Promise<boolean> {
  try {
    await pool.query("select 1");
    return true;
  } catch {
    return false;
  }
}
