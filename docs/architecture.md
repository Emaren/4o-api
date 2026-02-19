# Architecture Skeleton

## Services
- `4o-api`: orchestrator, planner, executor, memory, event bus
- `4o-web`: command center UI for prompts, traces, and state

## Planned Infra
- Postgres for durable state
- Redis for queues/events
- Vector store for semantic retrieval

## High-Level Flow
1. User intent enters API
2. Planner creates task graph
3. Executor runs tools + model calls
4. Memory persists artifacts and summaries
5. Web displays trace and outputs
