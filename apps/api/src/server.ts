import cors from "cors";
import express from "express";
import { env } from "./config/env";
import { healthRouter } from "./routes/health.route";
import { runsRouter } from "./routes/runs.route";
import { approvalsRouter } from "./routes/approvals.route";

export const app = express();

app.use(cors({ origin: env.WEB_ORIGIN }));
app.use(express.json({ limit: "1mb" }));

app.use("/health", healthRouter);
app.use("/runs", runsRouter);
app.use("/approvals", approvalsRouter);
