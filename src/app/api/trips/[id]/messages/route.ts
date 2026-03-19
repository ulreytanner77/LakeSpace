import { NextRequest, NextResponse } from "next/server";
import { getSQL } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const sql = getSQL();
    const rows = await sql`
      SELECT id, trip_id, name, text, created_at
      FROM trip_messages
      WHERE trip_id = ${id}
      ORDER BY created_at ASC
      LIMIT 200
    `;
    return NextResponse.json(rows);
  } catch (error) {
    console.error("GET /api/trips/[id]/messages error:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const body = await request.json();
    const { name, text } = body;

    if (!text) {
      return NextResponse.json(
        { error: "text is required" },
        { status: 400 }
      );
    }

    const sql = getSQL();

    // Verify trip exists
    const trip = await sql`SELECT id FROM trips WHERE id = ${id}`;
    if (trip.length === 0) {
      return NextResponse.json(
        { error: "Trip not found" },
        { status: 404 }
      );
    }

    const rows = await sql`
      INSERT INTO trip_messages (trip_id, name, text)
      VALUES (${id}, ${name || null}, ${text})
      RETURNING id, trip_id, name, text, created_at
    `;

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    console.error("POST /api/trips/[id]/messages error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
