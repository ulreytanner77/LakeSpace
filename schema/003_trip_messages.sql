-- Trip-scoped chat messages
CREATE TABLE IF NOT EXISTS trip_messages (
  id SERIAL PRIMARY KEY,
  trip_id INTEGER NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  name TEXT,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_trip_messages_trip_id ON trip_messages (trip_id, created_at);
