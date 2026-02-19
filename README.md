# 4o API (Brain)

Control plane for `api.4o.tokentap.ca`.

## Architecture (v1)
- `apps/api`: HTTP API (`/health`, `/runs`, `/approvals`)
- `apps/worker`: background worker entrypoint
- `packages/contracts`: schemas for events, memory, model registry
- `packages/skills`: tool policy + allowlist stubs
- `packages/connectors`: external connector interfaces
- `packages/evals`: behavior/safety evaluation placeholders
- `packages/cli`: local runner protocol placeholder
- `infra`: nginx/systemd/deploy templates

## Ports
- `3380`: 4o-api

## Database
- Postgres + pgvector
- Migrations: `npm run db:migrate`
- Migration files: `infra/db/migrations`

## Notes
This repo is scaffold-first. Most files are intentionally minimal stubs.
