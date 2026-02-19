import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pool } from "../db/pool";

async function ensureMigrationTable(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id text PRIMARY KEY,
      applied_at timestamptz NOT NULL DEFAULT now()
    );
  `);
}

async function getAppliedMigrations(): Promise<Set<string>> {
  const result = await pool.query<{ id: string }>("select id from schema_migrations");
  return new Set(result.rows.map((row) => row.id));
}

async function applyMigration(id: string, sql: string): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query("begin");
    await client.query(sql);
    await client.query("insert into schema_migrations(id) values ($1)", [id]);
    await client.query("commit");
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }
}

async function run(): Promise<void> {
  const migrationsDir = resolve(process.cwd(), "infra/db/migrations");
  const files = readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort((a, b) => a.localeCompare(b));

  await ensureMigrationTable();
  const applied = await getAppliedMigrations();

  for (const file of files) {
    if (applied.has(file)) {
      console.log(`skip ${file}`);
      continue;
    }

    const fullPath = resolve(migrationsDir, file);
    const sql = readFileSync(fullPath, "utf8");

    console.log(`apply ${file}`);
    await applyMigration(file, sql);
  }

  console.log("migrations complete");
}

run()
  .catch((error) => {
    console.error("migration failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
