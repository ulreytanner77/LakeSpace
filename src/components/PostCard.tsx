import Image from "next/image";

interface Post {
  id: string;
  lake_slug: string;
  image_url: string;
  caption: string | null;
  tags: string[];
  activity: string | null;
  created_at: string;
}

const TAG_COLORS: Record<string, string> = {
  windy: "bg-lake-500/15 text-lake-600",
  glassy: "bg-forest-500/15 text-forest-600",
  choppy: "bg-sunset-500/15 text-sunset-600",
  crowded: "bg-sand-300/40 text-sand-400",
};

const ACTIVITY_ICONS: Record<string, string> = {
  fishing: "🎣",
  paddleboarding: "🏄",
  swimming: "🏊",
  kayaking: "🛶",
  boating: "⛵",
};

export default function PostCard({ post, onDelete }: { post: Post; onDelete?: () => void }) {
  const date = new Date(post.created_at);
  const timeAgo = getTimeAgo(date);

  return (
    <div className="rounded-2xl border border-sand-200 bg-sand-100 overflow-hidden shadow-sm animate-fade-in">
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
        {post.activity && (
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-sm">{ACTIVITY_ICONS[post.activity] || "🌊"}</span>
            <span className="text-xs font-semibold text-lake-600 capitalize">{post.activity}</span>
          </div>
        )}
        {post.caption && (
          <p className="text-stone-700 text-sm mb-2">{post.caption}</p>
        )}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  TAG_COLORS[tag] || "bg-sand-200 text-sand-400"
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between">
          <p className="text-xs text-sand-300">{timeAgo}</p>
          {onDelete && (
            <button
              onClick={onDelete}
              className="text-xs text-red-400 hover:text-red-600 transition-colors"
            >
              Delete
            </button>
          )}
        </div>
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
