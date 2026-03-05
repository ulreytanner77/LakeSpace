"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import PostCard from "./PostCard";
import NewPostForm from "./NewPostForm";

interface Post {
  id: string;
  lake_slug: string;
  image_url: string;
  caption: string | null;
  tags: string[];
  activity: string | null;
  created_at: string;
}

export default function PostsFeed({ lakeSlug }: { lakeSlug: string }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch(`/api/posts?lake=${lakeSlug}`);
      if (!res.ok) throw new Error("Failed to fetch posts");
      const data = await res.json();
      setPosts(data);
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
