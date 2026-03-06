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
      SELECT activity, SUM(group_size + join_count)::int AS people
      FROM trips
      WHERE lake_slug = ${lake}
        AND planned_date >= CURRENT_DATE
        AND planned_date < CURRENT_DATE + INTERVAL '7 days'
      GROUP BY activity
      ORDER BY people DESC
    `;
    return NextResponse.json(rows);
  } catch (error) {
    console.error("GET /api/trips/activity error:", error);
    return NextResponse.json(
      { error: "Failed to fetch trip activity" },
      { status: 500 }
    );
  }
}
