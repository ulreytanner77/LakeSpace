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
      SELECT name, joined_at
      FROM trip_participants
      WHERE trip_id = ${id}
      ORDER BY joined_at ASC
    `;
    return NextResponse.json(rows);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
