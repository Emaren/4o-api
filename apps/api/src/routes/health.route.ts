import { Router } from "express";
import { env } from "../config/env";
import { pingDatabase } from "../db/pool";

export const healthRouter = Router();

healthRouter.get("/", async (_req, res) => {
  const dbReachable = await pingDatabase();

  res.json({
    status: dbReachable ? "ok" : "degraded",
    service: "4o-api",
    port: env.PORT,
    postgres: {
      configured: dbReachable,
      pgvectorExpected: env.PGVECTOR_ENABLED
    }
  });
});
