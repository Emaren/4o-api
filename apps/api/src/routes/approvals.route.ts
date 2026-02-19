import { Router } from "express";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { sendRouteError } from "./route-error";
import { addApproval, listEventsByType } from "../state/store";

const approvalInputSchema = z.object({
  approvalId: z.string().optional(),
  runId: z.string(),
  action: z.string().min(1),
  scope: z.string().default("repo")
});

export const approvalsRouter = Router();

approvalsRouter.get("/", async (_req, res) => {
  try {
    const approvals = await listEventsByType("approval.requested");
    res.json({ count: approvals.length, items: approvals });
  } catch (error) {
    sendRouteError(res, error);
  }
});

approvalsRouter.post("/", async (req, res) => {
  try {
    const input = approvalInputSchema.parse(req.body ?? {});

    const created = await addApproval({
      approvalId: input.approvalId ?? randomUUID(),
      runId: input.runId,
      action: input.action,
      scope: input.scope,
      status: "pending"
    });

    res.status(201).json(created);
  } catch (error) {
    sendRouteError(res, error);
  }
});
