import Image from "next/image";

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

function formatTripDateTime(dateStr: string, timeStr: string | null): string {
  const date = new Date(dateStr);
  const dayPart = date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
  if (!timeStr) return dayPart;
  const [hours, minutes] = timeStr.split(":").map(Number);
  const ampm = hours >= 12 ? "PM" : "AM";
  const h = hours % 12 || 12;
  return `${dayPart} • ${h}:${minutes.toString().padStart(2, "0")} ${ampm}`;
}

export default function PostCard({ post, onDelete, onViewTrip }: { post: Post; onDelete?: () => void; onViewTrip?: () => void }) {
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
        {post.trip && (
          <div className="flex items-center gap-2 mb-2 px-2.5 py-1.5 rounded-full bg-lake-500/10 border border-lake-500/20 w-fit">
            <span className="text-xs">{ACTIVITY_ICONS[post.trip.activity] || "🌊"}</span>
            <span className="text-xs text-lake-600 capitalize">{post.trip.activity}</span>
            <span className="text-xs text-sand-300">•</span>
            <span className="text-xs text-lake-600">{formatTripDateTime(post.trip.planned_date, post.trip.planned_time)}</span>
            <span className="text-xs text-sand-300">•</span>
            <span className="text-xs text-lake-600">{post.trip.total_going} going</span>
            {onViewTrip && (
              <>
                <span className="text-xs text-sand-300">•</span>
                <button
                  onClick={onViewTrip}
                  className="text-xs font-medium text-lake-500 hover:text-lake-600 transition-colors"
                >
                  View Trip
                </button>
              </>
            )}
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
