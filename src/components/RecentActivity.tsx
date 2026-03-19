"use client";

import { useState, useEffect } from "react";

interface ActivityEvent {
  type: "post" | "trip" | "join";
  id: string;
  activity: string | null;
  detail: string | null;
  occurred_at: string;
}

const TYPE_ICONS: Record<string, string> = {
  post: "📸",
  trip: "📅",
  join: "🙋",
};

function relativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const mins = Math.floor((now - then) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function eventDescription(event: ActivityEvent): string {
  switch (event.type) {
    case "post":
      return event.activity
        ? `New ${event.activity} photo shared`
        : "New photo shared";
    case "trip":
      return event.activity
        ? `New ${event.activity} trip planned`
        : "New trip planned";
    case "join":
      return event.detail
        ? `${event.detail} joined a ${event.activity || ""} trip`
        : `Someone joined a ${event.activity || ""} trip`;
  }
}

export default function RecentActivity({ lakeSlug }: { lakeSlug: string }) {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch(`/api/activity?lake=${lakeSlug}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setEvents(data);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, [lakeSlug]);

  if (!loaded || events.length === 0) return null;

  return (
    <div className="mb-4">
      <h3 className="text-xs font-semibold text-forest-600 uppercase tracking-wide mb-2">
        Recent Activity
      </h3>
      <div className="space-y-1.5">
        {events.map((event, i) => (
          <div key={`${event.type}-${event.id}-${i}`} className="flex items-center gap-2 text-xs text-stone-600">
            <span>{TYPE_ICONS[event.type] || "🌊"}</span>
            <span className="flex-1 truncate">{eventDescription(event)}</span>
            <span className="text-sand-300 shrink-0">{relativeTime(event.occurred_at)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
