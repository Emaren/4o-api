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

## Local development database security

The compose file `infra/dev/docker-compose.dev.yml` **requires** a per-developer PostgreSQL password supplied privately as `FOUR_O_DEV_POSTGRES_PASSWORD`. It deliberately has no committed default and publishes port 5432 **only on 127.0.0.1**.

Generate a fresh local-only password with a credential generator and load it through your shell or private secret manager before running Compose. Do not commit the value, add it to CI logs, or reuse a production database credential. If the variable is absent, Compose must refuse to launch the service.

**Existing volumes:** Changing `POSTGRES_PASSWORD` in Compose does not rotate a password in an already initialized PostgreSQL volume. For an existing instance, perform a controlled PostgreSQL role-password rotation and update the protected connection secret separately. Do not delete volumes to rotate credentials.

This is a source-only correction for GitGuardian incident #19575130, not proof of credential rotation or production installation.

The API and migration command also require an explicit `DATABASE_URL` supplied through the private runtime environment. Use the matching local database credential for development; a missing or empty value fails startup. Production must use its separately managed database credential.
