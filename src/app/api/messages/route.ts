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
      SELECT id, lake_slug, name, text, created_at
      FROM messages
      WHERE lake_slug = ${lake}
      ORDER BY created_at ASC
      LIMIT 200
    `;
    return NextResponse.json(rows);
  } catch (error) {
    console.error("GET /api/messages error:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lake_slug, name, text } = body;

    if (!lake_slug || !text) {
      return NextResponse.json(
        { error: "lake_slug and text are required" },
        { status: 400 }
      );
    }

    const sql = getSQL();
    const rows = await sql`
      INSERT INTO messages (lake_slug, name, text)
      VALUES (${lake_slug}, ${name || null}, ${text})
      RETURNING id, lake_slug, name, text, created_at
    `;

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    console.error("POST /api/messages error:", error);
    return NextResponse.json(
      { error: "Failed to create message" },
      { status: 500 }
    );
  }
}
