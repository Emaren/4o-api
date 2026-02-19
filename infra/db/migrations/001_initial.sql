CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS schema_migrations (
  id text PRIMARY KEY,
  applied_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS runs (
  run_id uuid PRIMARY KEY,
  session_id text NOT NULL,
  objective text NOT NULL,
  project text NOT NULL,
  status text NOT NULL CHECK (status IN ('queued', 'running', 'completed', 'failed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS approvals (
  approval_id uuid PRIMARY KEY,
  run_id uuid NOT NULL REFERENCES runs(run_id) ON DELETE CASCADE,
  action text NOT NULL,
  scope text NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS events (
  event_id uuid PRIMARY KEY,
  event_type text NOT NULL,
  run_id uuid NULL REFERENCES runs(run_id) ON DELETE SET NULL,
  approval_id uuid NULL REFERENCES approvals(approval_id) ON DELETE SET NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS events_event_type_created_idx ON events(event_type, created_at DESC);
CREATE INDEX IF NOT EXISTS events_run_id_idx ON events(run_id);
CREATE INDEX IF NOT EXISTS events_approval_id_idx ON events(approval_id);

CREATE TABLE IF NOT EXISTS memory_items (
  memory_id uuid PRIMARY KEY,
  run_id uuid NULL REFERENCES runs(run_id) ON DELETE SET NULL,
  kind text NOT NULL CHECK (kind IN ('fact', 'decision', 'artifact', 'summary')),
  content text NOT NULL,
  tags text[] NOT NULL DEFAULT '{}',
  embedding vector(1536),
  created_at timestamptz NOT NULL DEFAULT now(),
  search_tsv tsvector GENERATED ALWAYS AS (to_tsvector('english', coalesce(content, ''))) STORED
);

CREATE INDEX IF NOT EXISTS memory_items_tags_idx ON memory_items USING GIN(tags);
CREATE INDEX IF NOT EXISTS memory_items_tsv_idx ON memory_items USING GIN(search_tsv);
CREATE INDEX IF NOT EXISTS memory_items_embedding_idx ON memory_items USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
