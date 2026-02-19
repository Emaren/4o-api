import { Router } from "express";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { sendRouteError } from "./route-error";
import { addRun, listEventsByType } from "../state/store";

const runInputSchema = z.object({
  runId: z.string().optional(),
  sessionId: z.string().default("default"),
  objective: z.string().min(1),
  project: z.string().default("4o")
});

export const runsRouter = Router();

runsRouter.get("/", async (_req, res) => {
  try {
    const runs = await listEventsByType("run.created");
    res.json({ count: runs.length, items: runs });
  } catch (error) {
    sendRouteError(res, error);
  }
});

runsRouter.post("/", async (req, res) => {
  try {
    const input = runInputSchema.parse(req.body ?? {});

    const created = await addRun({
      runId: input.runId ?? randomUUID(),
      sessionId: input.sessionId,
      objective: input.objective,
      project: input.project,
      status: "queued"
    });

    res.status(201).json(created);
  } catch (error) {
    sendRouteError(res, error);
  }
});
