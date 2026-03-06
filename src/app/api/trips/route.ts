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
      SELECT id, lake_slug, activity, description, planned_date, planned_time, group_size, join_count, created_at, expires_at
      FROM trips
      WHERE lake_slug = ${lake}
        AND expires_at > now()
      ORDER BY planned_date ASC
      LIMIT 50
    `;
    return NextResponse.json(rows);
  } catch (error) {
    console.error("GET /api/trips error:", error);
    return NextResponse.json(
      { error: "Failed to fetch trips" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lake_slug, activity, description, planned_date, planned_time, group_size } = body;

    if (!lake_slug || !activity || !planned_date) {
      return NextResponse.json(
        { error: "lake_slug, activity, and planned_date are required" },
        { status: 400 }
      );
    }

    const safeGroupSize = typeof group_size === "number" && group_size >= 1 ? group_size : 1;
    const safePlannedTime = typeof planned_time === "string" && planned_time ? planned_time : null;

    const sql = getSQL();
    const rows = await sql`
      INSERT INTO trips (lake_slug, activity, description, planned_date, planned_time, group_size, expires_at)
      VALUES (${lake_slug}, ${activity}, ${description || null}, ${planned_date}, ${safePlannedTime}, ${safeGroupSize}, ${planned_date}::date + INTERVAL '1 day')
      RETURNING id, lake_slug, activity, description, planned_date, planned_time, group_size, join_count, created_at, expires_at
    `;

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    console.error("POST /api/trips error:", error);
    return NextResponse.json(
      { error: "Failed to create trip" },
      { status: 500 }
    );
  }
}
