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
      SELECT activity, COUNT(*)::int AS count
      FROM posts
      WHERE lake_slug = ${lake}
        AND activity IS NOT NULL
        AND created_at > now() - INTERVAL '2 hours'
      GROUP BY activity
      ORDER BY count DESC
    `;
    return NextResponse.json(rows);
  } catch (error) {
    console.error("GET /api/posts/activity error:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity" },
      { status: 500 }
    );
  }
}
