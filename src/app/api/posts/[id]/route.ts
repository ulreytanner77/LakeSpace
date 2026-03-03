import { NextRequest, NextResponse } from "next/server";
import { getSQL } from "@/lib/db";
import { del } from "@vercel/blob";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const sql = getSQL();

    const rows = await sql`
      DELETE FROM posts
      WHERE id = ${id}
      RETURNING image_url
    `;

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    const imageUrl = rows[0].image_url;
    if (imageUrl) {
      await del(imageUrl);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/posts/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
