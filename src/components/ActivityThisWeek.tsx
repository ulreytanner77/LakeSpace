"use client";

import { useState, useEffect } from "react";

interface ActivitySummary {
  activity: string;
  people: number;
}

const ACTIVITY_ICONS: Record<string, string> = {
  fishing: "🎣",
  paddleboarding: "🛶",
  swimming: "🏊",
  kayaking: "🚣",
  boating: "⛵",
};

export default function ActivityThisWeek({ lakeSlug }: { lakeSlug: string }) {
  const [data, setData] = useState<ActivitySummary[]>([]);

  useEffect(() => {
    fetch(`/api/trips/activity?lake=${lakeSlug}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((rows: ActivitySummary[]) => setData(rows))
      .catch(() => setData([]));
  }, [lakeSlug]);

  if (data.length === 0) return null;

  return (
    <div className="mb-4">
      <h3 className="text-xs font-semibold text-forest-600 uppercase tracking-wide mb-2">
        Activity This Week
      </h3>
      <div className="space-y-1">
        {data.map((a) => (
          <div
            key={a.activity}
            className="flex items-center gap-2 text-sm text-stone-600"
          >
            <span>{ACTIVITY_ICONS[a.activity] || "🌊"}</span>
            <span className="capitalize">{a.activity}</span>
            <span className="text-sand-300">&mdash;</span>
            <span className="font-medium text-forest-600">
              {a.people} {a.people === 1 ? "person" : "people"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
