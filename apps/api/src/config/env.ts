import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(3380),
  WEB_ORIGIN: z.string().default("http://localhost:3080"),
  DATABASE_URL: z.string().default("postgres://postgres:postgres@localhost:5432/4o"),
  DATABASE_SSL: z.coerce.boolean().default(false),
  PGVECTOR_ENABLED: z.coerce.boolean().default(true),
  MODEL_REGISTRY_FILE: z.string().default("./packages/contracts/model-registry.example.json")
});

export const env = EnvSchema.parse(process.env);
