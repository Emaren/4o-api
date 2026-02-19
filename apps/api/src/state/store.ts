import { randomUUID } from "node:crypto";
import { EventEnvelope, EventEnvelopeSchema, ApprovalEventSchema, RunCreatedEventSchema } from "../../../../packages/contracts/src";
import { pool } from "../db/pool";

interface EventRow {
  event_id: string;
  event_type: string;
  created_at: Date | string;
  payload: unknown;
}

function fromRow(row: EventRow): EventEnvelope {
  return EventEnvelopeSchema.parse({
    eventId: row.event_id,
    eventType: row.event_type,
    createdAt: new Date(row.created_at).toISOString(),
    payload: row.payload
  });
}

export async function listEventsByType(eventType: "run.created" | "approval.requested"): Promise<EventEnvelope[]> {
  const result = await pool.query<EventRow>(
    `
      select event_id, event_type, created_at, payload
      from events
      where event_type = $1
      order by created_at desc
      limit 200
    `,
    [eventType]
  );

  return result.rows.map(fromRow);
}

export async function addRun(run: unknown): Promise<EventEnvelope> {
  const payload = RunCreatedEventSchema.parse(run);
  const eventId = randomUUID();
  const createdAt = new Date().toISOString();
  const client = await pool.connect();

  try {
    await client.query("begin");
    await client.query(
      `
        insert into runs (run_id, session_id, objective, project, status)
        values ($1, $2, $3, $4, $5)
      `,
      [payload.runId, payload.sessionId, payload.objective, payload.project, payload.status]
    );

    await client.query(
      `
        insert into events (event_id, event_type, run_id, payload, created_at)
        values ($1, $2, $3, $4::jsonb, $5)
      `,
      [eventId, "run.created", payload.runId, JSON.stringify(payload), createdAt]
    );
    await client.query("commit");
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }

  return EventEnvelopeSchema.parse({
    eventId,
    eventType: "run.created",
    createdAt,
    payload
  });
}

export async function addApproval(approval: unknown): Promise<EventEnvelope> {
  const payload = ApprovalEventSchema.parse(approval);
  const eventId = randomUUID();
  const createdAt = new Date().toISOString();
  const client = await pool.connect();

  try {
    await client.query("begin");
    await client.query(
      `
        insert into approvals (approval_id, run_id, action, scope, status)
        values ($1, $2, $3, $4, $5)
      `,
      [payload.approvalId, payload.runId, payload.action, payload.scope, payload.status]
    );

    await client.query(
      `
        insert into events (event_id, event_type, run_id, approval_id, payload, created_at)
        values ($1, $2, $3, $4, $5::jsonb, $6)
      `,
      [eventId, "approval.requested", payload.runId, payload.approvalId, JSON.stringify(payload), createdAt]
    );
    await client.query("commit");
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }

  return EventEnvelopeSchema.parse({
    eventId,
    eventType: "approval.requested",
    createdAt,
    payload
  });
}
