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
      SELECT id, lake_slug, image_url, caption, tags, created_at
      FROM posts
      WHERE lake_slug = ${lake}
      ORDER BY created_at DESC
      LIMIT 50
    `;
    return NextResponse.json(rows);
  } catch (error) {
    console.error("GET /api/posts error:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lake_slug, image_url, caption, tags } = body;

    if (!lake_slug || !image_url) {
      return NextResponse.json(
        { error: "lake_slug and image_url are required" },
        { status: 400 }
      );
    }

    const safeTags = Array.isArray(tags) ? tags : [];

    const sql = getSQL();
    const rows = await sql`
      INSERT INTO posts (lake_slug, image_url, caption, tags)
      VALUES (${lake_slug}, ${image_url}, ${caption || null}, ${safeTags})
      RETURNING id, lake_slug, image_url, caption, tags, created_at
    `;

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    console.error("POST /api/posts error:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
