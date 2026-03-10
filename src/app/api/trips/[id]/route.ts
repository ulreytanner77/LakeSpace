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
      SELECT *
      FROM trips
      WHERE id = ${id}
    `;

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Trip not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("GET /api/trips/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch trip" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  let name: string | null = null;
  try {
    const body = await request.json();
    name = typeof body.name === "string" ? body.name : null;
  } catch {
    // body is optional — name defaults to null
  }

  try {
    const sql = getSQL();

    // Increment join count
    const rows = await sql`
      UPDATE trips
      SET join_count = join_count + 1
      WHERE id = ${id}
      RETURNING *
    `;

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Trip not found" },
        { status: 404 }
      );
    }

    // Record participant and auto-create chat (no-op if tables don't exist yet)
    try {
      await sql`
        INSERT INTO trip_participants (trip_id, name)
        VALUES (${id}, ${name})
      `;

      let chatId = rows[0].chat_id;
      if (!chatId) {
        const chatRows = await sql`
          INSERT INTO trip_chats (trip_id)
          VALUES (${id})
          ON CONFLICT (trip_id) DO UPDATE SET trip_id = trip_chats.trip_id
          RETURNING id
        `;
        chatId = chatRows[0].id;

        await sql`
          UPDATE trips SET chat_id = ${chatId} WHERE id = ${id}
        `;
        rows[0].chat_id = chatId;
      }
    } catch {
      // Tables may not exist yet — join still succeeds
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("PATCH /api/trips/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to join trip" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const sql = getSQL();
    const rows = await sql`
      DELETE FROM trips
      WHERE id = ${id}
      RETURNING id
    `;

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Trip not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/trips/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete trip" },
      { status: 500 }
    );
  }
}
