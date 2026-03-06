"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import PostCard from "./PostCard";
import NewPostForm from "./NewPostForm";

interface LinkedTrip {
  activity: string;
  planned_date: string;
  planned_time: string | null;
  total_going: number;
}

interface Post {
  id: string;
  lake_slug: string;
  image_url: string;
  caption: string | null;
  tags: string[];
  activity: string | null;
  created_at: string;
  trip?: LinkedTrip | null;
}

interface RawPost {
  id: string;
  lake_slug: string;
  image_url: string;
  caption: string | null;
  tags: string[];
  activity: string | null;
  created_at: string;
  trip_id: number | null;
  trip_activity: string | null;
  trip_planned_date: string | null;
  trip_planned_time: string | null;
  trip_group_size: number | null;
  trip_join_count: number | null;
}

function mapPost(raw: RawPost): Post {
  return {
    id: raw.id,
    lake_slug: raw.lake_slug,
    image_url: raw.image_url,
    caption: raw.caption,
    tags: raw.tags,
    activity: raw.activity,
    created_at: raw.created_at,
    trip: raw.trip_id && raw.trip_activity && raw.trip_planned_date != null
      ? {
          activity: raw.trip_activity,
          planned_date: raw.trip_planned_date,
          planned_time: raw.trip_planned_time || null,
          total_going: (raw.trip_group_size || 1) + (raw.trip_join_count || 0),
        }
      : null,
  };
}

export default function PostsFeed({ lakeSlug, onSwitchToTrips }: { lakeSlug: string; onSwitchToTrips?: () => void }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch(`/api/posts?lake=${lakeSlug}`);
      if (!res.ok) throw new Error("Failed to fetch posts");
      const data: RawPost[] = await res.json();
      setPosts(data.map(mapPost));
      setError("");
    } catch {
      setError("Could not load posts");
    } finally {
      setLoading(false);
    }
  }, [lakeSlug]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const activityCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const post of posts) {
      if (post.activity) {
        counts[post.activity] = (counts[post.activity] || 0) + 1;
      }
    }
    return counts;
  }, [posts]);

  return (
    <div className="space-y-4">
      <NewPostForm lakeSlug={lakeSlug} onPosted={fetchPosts} activityCounts={activityCounts} />

      {loading && (
        <p className="text-sm text-sand-300 text-center py-8">
          Loading posts...
        </p>
      )}

      {error && (
        <p className="text-sm text-red-500 text-center py-4">{error}</p>
      )}

      {!loading && !error && posts.length === 0 && (
        <p className="text-sm text-sand-300 text-center py-8">
          No posts yet. Be the first to share!
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onViewTrip={post.trip && onSwitchToTrips ? onSwitchToTrips : undefined}
            onDelete={async () => {
              if (!confirm("Delete this post?")) return;
              try {
                const res = await fetch(`/api/posts/${post.id}`, {
                  method: "DELETE",
                });
                if (res.ok) {
                  setPosts((prev) => prev.filter((p) => p.id !== post.id));
                }
              } catch {
                // silent fail
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}
