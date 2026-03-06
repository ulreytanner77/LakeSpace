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
      SELECT id, lake_slug, activity, description, planned_date, planned_time, group_size, join_count, created_at, expires_at
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
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const sql = getSQL();
    const rows = await sql`
      UPDATE trips
      SET join_count = join_count + 1
      WHERE id = ${id}
      RETURNING id, lake_slug, activity, description, planned_date, planned_time, group_size, join_count, created_at, expires_at
    `;

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Trip not found" },
        { status: 404 }
      );
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
