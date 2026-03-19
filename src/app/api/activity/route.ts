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

  try {
    const sql = getSQL();
    const rows = await sql`
      (
        SELECT 'post' AS type, id::text, activity, caption AS detail, created_at AS occurred_at
        FROM posts
        WHERE lake_slug = ${lake}
          AND created_at > now() - INTERVAL '24 hours'
      )
      UNION ALL
      (
        SELECT 'trip' AS type, id::text, activity, description AS detail, created_at AS occurred_at
        FROM trips
        WHERE lake_slug = ${lake}
          AND created_at > now() - INTERVAL '24 hours'
      )
      UNION ALL
      (
        SELECT 'join' AS type, tp.trip_id::text AS id, t.activity, tp.name AS detail, tp.joined_at AS occurred_at
        FROM trip_participants tp
        JOIN trips t ON t.id = tp.trip_id
        WHERE t.lake_slug = ${lake}
          AND tp.joined_at > now() - INTERVAL '24 hours'
      )
      ORDER BY occurred_at DESC
      LIMIT 20
    `;
    return NextResponse.json(rows);
  } catch (error) {
    console.error("GET /api/activity error:", error);
    return NextResponse.json([], { status: 200 });
  }
}
