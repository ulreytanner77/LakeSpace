import Image from "next/image";

interface Post {
  id: string;
  lake_slug: string;
  image_url: string;
  caption: string | null;
  tags: string[];
  created_at: string;
}

const TAG_COLORS: Record<string, string> = {
  windy: "bg-sky-100 text-sky-700",
  glassy: "bg-emerald-100 text-emerald-700",
  choppy: "bg-amber-100 text-amber-700",
  crowded: "bg-rose-100 text-rose-700",
};

export default function PostCard({ post }: { post: Post }) {
  const date = new Date(post.created_at);
  const timeAgo = getTimeAgo(date);

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
      <div className="relative w-full aspect-[4/3]">
        <Image
          src={post.image_url}
          alt={post.caption || "Lake post"}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <div className="p-4">
        {post.caption && (
          <p className="text-gray-800 text-sm mb-2">{post.caption}</p>
        )}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  TAG_COLORS[tag] || "bg-gray-100 text-gray-600"
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <p className="text-xs text-gray-400">{timeAgo}</p>
      </div>
    </div>
  );
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
