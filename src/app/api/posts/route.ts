import { NextRequest, NextResponse } from "next/server";
import { getSQL } from "@/lib/db";

export async function GET(request: NextRequest) {
  const lake = request.nextUrl.searchParams.get("lake");
  if (!lake) {
    return NextResponse.json(
      { error: "Missing 'lake' query parameter" },
      { status: 400 }
    );
  }

  const activity = request.nextUrl.searchParams.get("activity");
  const tag = request.nextUrl.searchParams.get("tag");

  try {
    const sql = getSQL();
    const rows = await sql`
      SELECT
        p.id, p.lake_slug, p.image_url, p.caption, p.tags, p.activity, p.created_at, p.expires_at, p.trip_id,
        t.activity AS trip_activity, t.planned_date AS trip_planned_date, t.planned_time AS trip_planned_time,
        t.group_size AS trip_group_size, t.join_count AS trip_join_count
      FROM posts p
      LEFT JOIN trips t ON p.trip_id = t.id
      WHERE p.lake_slug = ${lake}
        AND p.expires_at > now()
        ${activity ? sql`AND p.activity = ${activity}` : sql``}
        ${tag ? sql`AND ${tag} = ANY(p.tags)` : sql``}
      ORDER BY p.created_at DESC
      LIMIT 50
    `;
    return NextResponse.json(rows);
  } catch (error) {
    console.error("GET /api/posts error:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lake_slug, image_url, caption, tags, activity, trip_id } = body;

    if (!lake_slug || !image_url) {
      return NextResponse.json(
        { error: "lake_slug and image_url are required" },
        { status: 400 }
      );
    }

    const safeTags = Array.isArray(tags) ? tags : [];
    const safeActivity = typeof activity === "string" ? activity : null;
    const safeTripId = typeof trip_id === "number" ? trip_id : null;

    const sql = getSQL();
    const rows = await sql`
      INSERT INTO posts (lake_slug, image_url, caption, tags, activity, trip_id, expires_at)
      VALUES (${lake_slug}, ${image_url}, ${caption || null}, ${safeTags}, ${safeActivity}, ${safeTripId}, now() + INTERVAL '7 days')
      RETURNING id, lake_slug, image_url, caption, tags, activity, trip_id, created_at, expires_at
    `;

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    console.error("POST /api/posts error:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
