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

  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    // body is optional for join
  }

  const action = typeof body.action === "string" ? body.action : "join";

  try {
    const sql = getSQL();

    if (action === "cancel") {
      const rows = await sql`
        UPDATE trips
        SET status = 'cancelled'
        WHERE id = ${id}
        RETURNING *
      `;
      if (rows.length === 0) {
        return NextResponse.json({ error: "Trip not found" }, { status: 404 });
      }
      return NextResponse.json(rows[0]);
    }

    if (action === "edit") {
      const planned_date = typeof body.planned_date === "string" ? body.planned_date : null;
      const planned_time = typeof body.planned_time === "string" ? body.planned_time : null;
      const description = body.description !== undefined ? body.description : undefined;

      const rows = await sql`
        UPDATE trips
        SET
          planned_date = COALESCE(${planned_date}, planned_date),
          planned_time = COALESCE(${planned_time}, planned_time),
          description = COALESCE(${description !== undefined ? (description as string | null) : null}, description),
          expires_at = COALESCE(${planned_date}, planned_date::text)::date + INTERVAL '1 day'
        WHERE id = ${id}
        RETURNING *
      `;
      if (rows.length === 0) {
        return NextResponse.json({ error: "Trip not found" }, { status: 404 });
      }
      return NextResponse.json(rows[0]);
    }

    // Default: join
    const name = typeof body.name === "string" ? body.name : null;

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
      { error: "Failed to update trip" },
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
