-- Trip group chats: one chat per trip, created automatically on first join
CREATE TABLE IF NOT EXISTS trip_chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id INTEGER NOT NULL UNIQUE REFERENCES trips(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trip participants: tracks individual joins
CREATE TABLE IF NOT EXISTS trip_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id INTEGER NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  name TEXT,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add chat_id column to trips for quick lookup
ALTER TABLE trips ADD COLUMN IF NOT EXISTS chat_id UUID REFERENCES trip_chats(id);
