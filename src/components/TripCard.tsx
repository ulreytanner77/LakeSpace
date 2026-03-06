"use client";

import { useState } from "react";

interface Trip {
  id: string;
  lake_slug: string;
  activity: string;
  description: string | null;
  planned_date: string;
  planned_time: string | null;
  group_size: number;
  join_count: number;
  created_at: string;
}

const ACTIVITY_ICONS: Record<string, string> = {
  fishing: "🎣",
  paddleboarding: "🏄",
  swimming: "🏊",
  kayaking: "🛶",
  boating: "⛵",
};

function formatDateTime(dateStr: string, timeStr: string | null): string {
  const date = new Date(dateStr);
  const dayPart = date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
  if (!timeStr) return dayPart;
  const [hours, minutes] = timeStr.split(":").map(Number);
  const ampm = hours >= 12 ? "PM" : "AM";
  const h = hours % 12 || 12;
  return `${dayPart} • ${h}:${minutes.toString().padStart(2, "0")} ${ampm}`;
}

export default function TripCard({ trip, onDelete }: { trip: Trip; onDelete?: () => void }) {
  const [joinCount, setJoinCount] = useState(trip.join_count);
  const [joining, setJoining] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleJoin() {
    setJoining(true);
    setJoinCount((c) => c + 1);
    try {
      const res = await fetch(`/api/trips/${trip.id}`, { method: "PATCH" });
      if (!res.ok) {
        setJoinCount((c) => c - 1);
      }
    } catch {
      setJoinCount((c) => c - 1);
    } finally {
      setJoining(false);
    }
  }

  const totalGoing = trip.group_size + joinCount;

  return (
    <div id={`trip-${trip.id}`} className="rounded-2xl border border-sand-200 bg-sand-100 p-4 shadow-sm animate-fade-in">
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-sm">{ACTIVITY_ICONS[trip.activity] || "🌊"}</span>
        <span className="text-xs font-semibold text-lake-600 capitalize">{trip.activity}</span>
      </div>

      {trip.description && (
        <p className="text-stone-700 text-sm mb-2">{trip.description}</p>
      )}

      <div className="flex items-center gap-3 text-xs text-sand-400 mb-3">
        <span>{formatDateTime(trip.planned_date, trip.planned_time)}</span>
        <span>{totalGoing} {totalGoing === 1 ? "person" : "people"} heading out</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={handleJoin}
            disabled={joining}
            className="bg-lake-500 text-white text-sm font-medium px-4 py-1.5 rounded-full hover:bg-lake-600 active:scale-95 disabled:opacity-50 transition-all"
          >
            Join ({joinCount} going)
          </button>
          <button
            onClick={() => {
              const url = `${window.location.origin}/trips/${trip.id}`;
              navigator.clipboard.writeText(url).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              });
            }}
            className="text-xs text-lake-500 hover:text-lake-600 transition-colors"
          >
            {copied ? "Link copied!" : "Share"}
          </button>
        </div>

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
  );
}
