"use client";

import { useState, useEffect } from "react";

interface ActivityCount {
  activity: string;
  count: number;
}

const ACTIVITY_ICONS: Record<string, string> = {
  fishing: "🎣",
  paddleboarding: "🏄",
  swimming: "🏊",
  kayaking: "🛶",
  boating: "⛵",
};

export default function LiveActivity({ lakeSlug }: { lakeSlug: string }) {
  const [activities, setActivities] = useState<ActivityCount[]>([]);

  useEffect(() => {
    fetch(`/api/posts/activity?lake=${lakeSlug}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data: ActivityCount[]) => setActivities(data))
      .catch(() => setActivities([]));
  }, [lakeSlug]);

  if (activities.length === 0) return null;

  return (
    <div className="mb-4">
      <h3 className="text-xs font-semibold text-forest-600 uppercase tracking-wide mb-2">
        Live on the lake
      </h3>
      <div className="flex flex-wrap gap-2">
        {activities.map((a) => (
          <span
            key={a.activity}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-lake-500/10 border border-lake-500/20 text-xs text-lake-600"
          >
            <span>{ACTIVITY_ICONS[a.activity] || "🌊"}</span>
            <span className="capitalize">{a.activity}</span>
            <span className="text-sand-300">•</span>
            <span>{a.count}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
