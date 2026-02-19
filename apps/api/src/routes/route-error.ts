import { Response } from "express";
import { ZodError } from "zod";

interface PgLikeError {
  code?: string;
  message?: string;
  detail?: string;
}

function getPgCode(error: unknown): string | undefined {
  if (!error || typeof error !== "object") {
    return undefined;
  }

  return (error as PgLikeError).code;
}

function getPgMessage(error: unknown): string {
  if (!error || typeof error !== "object") {
    return "Unknown database error";
  }

  const value = error as PgLikeError;
  return value.detail ?? value.message ?? "Unknown database error";
}

export function sendRouteError(res: Response, error: unknown): void {
  if (error instanceof ZodError) {
    res.status(400).json({
      code: "validation_error",
      message: "Invalid request payload",
      issues: error.issues
    });
    return;
  }

  const pgCode = getPgCode(error);
  if (pgCode === "23503") {
    res.status(404).json({
      code: "foreign_key_violation",
      message: getPgMessage(error)
    });
    return;
  }

  if (pgCode === "23505") {
    res.status(409).json({
      code: "conflict",
      message: getPgMessage(error)
    });
    return;
  }

  res.status(500).json({
    code: "internal_error",
    message: error instanceof Error ? error.message : "Unknown internal error"
  });
}
