import { z } from "zod";

export const ModelRoleSchema = z.enum([
  "router",
  "commander",
  "deep",
  "code",
  "embeddings",
  "shadow",
  "failover"
]);

export const ModelEntrySchema = z.object({
  key: z.string(),
  provider: z.string(),
  model: z.string(),
  role: ModelRoleSchema,
  active: z.boolean().default(true),
  costTier: z.enum(["free", "cheap", "standard", "premium"])
});

export const ModelRegistrySchema = z.object({
  defaultCommander: z.string(),
  entries: z.array(ModelEntrySchema),
  budgets: z.object({
    maxToolCallsPerRun: z.number().int().positive().default(25),
    monthlyUsdCap: z.number().nonnegative().default(250)
  })
});
