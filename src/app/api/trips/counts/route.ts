import { NextResponse } from "next/server";
import { getSQL } from "@/lib/db";

export async function GET() {
  try {
    const sql = getSQL();
    const rows = await sql`
      SELECT lake_slug, COUNT(*)::int AS trip_count
      FROM trips
      WHERE expires_at > now()
      GROUP BY lake_slug
    `;
    const counts: Record<string, number> = {};
    for (const row of rows) {
      counts[row.lake_slug] = row.trip_count;
    }
    return NextResponse.json(counts);
  } catch (error) {
    console.error("GET /api/trips/counts error:", error);
    return NextResponse.json({});
  }
}
