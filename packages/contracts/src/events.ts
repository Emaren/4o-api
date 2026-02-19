import { z } from "zod";

export const EventTypeSchema = z.enum([
  "run.created",
  "tool.called",
  "approval.requested",
  "approval.resolved",
  "incident.reported",
  "memory.upserted"
]);

export const RunStatusSchema = z.enum(["queued", "running", "completed", "failed"]);

export const RunCreatedEventSchema = z.object({
  runId: z.string(),
  sessionId: z.string(),
  objective: z.string(),
  project: z.string(),
  status: RunStatusSchema
});

export const ToolCallEventSchema = z.object({
  runId: z.string(),
  toolName: z.string(),
  input: z.record(z.unknown()).default({}),
  outcome: z.enum(["success", "failure"])
});

export const ApprovalEventSchema = z.object({
  approvalId: z.string(),
  runId: z.string(),
  action: z.string(),
  scope: z.string(),
  status: z.enum(["pending", "approved", "rejected"])
});

export const IncidentEventSchema = z.object({
  incidentId: z.string(),
  severity: z.enum(["low", "medium", "high", "critical"]),
  summary: z.string(),
  source: z.string()
});

export const MemoryItemSchema = z.object({
  memoryId: z.string(),
  runId: z.string().optional(),
  kind: z.enum(["fact", "decision", "artifact", "summary"]),
  content: z.string(),
  tags: z.array(z.string()).default([])
});

export const EventPayloadSchema = z.union([
  RunCreatedEventSchema,
  ToolCallEventSchema,
  ApprovalEventSchema,
  IncidentEventSchema,
  MemoryItemSchema
]);

export const EventEnvelopeSchema = z.object({
  eventId: z.string(),
  eventType: EventTypeSchema,
  createdAt: z.string(),
  payload: EventPayloadSchema
});

export type EventEnvelope = z.infer<typeof EventEnvelopeSchema>;
