# Lake Space

Pick a lake, share photos & conditions, and chat — all in one place.

## Tech Stack

- **Next.js 14** (App Router) + TypeScript + Tailwind CSS
- **Neon Postgres** for data (raw SQL via `@neondatabase/serverless`)
- **Vercel Blob** for image uploads
- **Vercel** for deployment

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Create a `.env.local` file in the project root:

```env
DATABASE_URL=postgresql://user:pass@your-neon-host.neon.tech/dbname?sslmode=require
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxx
```

- **DATABASE_URL**: Get this from your [Neon dashboard](https://console.neon.tech/) — use the connection string for your project.
- **BLOB_READ_WRITE_TOKEN**: Get this from your [Vercel project settings](https://vercel.com/docs/storage/vercel-blob) after adding a Blob store.

### 3. Set up Neon database

Run this SQL in the Neon SQL Editor (or via `psql`):

```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lake_slug TEXT NOT NULL,
  image_url TEXT NOT NULL,
  caption TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lake_slug TEXT NOT NULL,
  name TEXT,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_posts_lake_created ON posts (lake_slug, created_at DESC);
CREATE INDEX idx_messages_lake_created ON messages (lake_slug, created_at ASC);
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to `/lakes`.

## Deploy to Vercel

1. Push your code to a GitHub repo.
2. Import the repo in [Vercel](https://vercel.com/new).
3. In **Project Settings > Environment Variables**, add:
   - `DATABASE_URL` — your Neon connection string
   - `BLOB_READ_WRITE_TOKEN` — your Vercel Blob token
4. Deploy. That's it.

## Project Structure

```
src/
  app/
    layout.tsx            # Root layout with header
    page.tsx              # Redirects to /lakes
    lakes/
      page.tsx            # Lake grid
      [lakeSlug]/
        page.tsx          # Lake detail with Posts + Chat tabs
    api/
      posts/route.ts      # GET/POST posts
      messages/route.ts   # GET/POST messages
      upload/route.ts     # POST image upload (Vercel Blob)
  components/
    LakeGrid.tsx          # Grid of hardcoded lakes
    Tabs.tsx              # Posts / Chat tab switcher
    PostCard.tsx          # Single post display
    PostsFeed.tsx         # Posts list + new post form
    MessageList.tsx       # Chat message list
    ChatTab.tsx           # Chat wrapper with polling + refresh
    NewPostForm.tsx       # Image upload + caption + tags form
    NewMessageForm.tsx    # Name + message form
  lib/
    db.ts                 # Neon SQL helper
    lakes.ts              # Hardcoded lake data
```

## Troubleshooting

### "relation does not exist" or "function gen_random_uuid() does not exist"
Make sure you ran the SQL setup above, including `CREATE EXTENSION IF NOT EXISTS pgcrypto;`.

### Posts/messages not loading
Check that `DATABASE_URL` is set correctly in `.env.local` (local) or Vercel environment variables (production). The Neon connection string must include `?sslmode=require`.

### Image uploads failing
- Ensure `BLOB_READ_WRITE_TOKEN` is set.
- The token must come from a Vercel Blob store linked to your project.
- Check that the file is an image and under 10 MB.

### 404 on lake pages
Make sure the URL slug matches one of the 10 hardcoded lakes in `src/lib/lakes.ts`.
