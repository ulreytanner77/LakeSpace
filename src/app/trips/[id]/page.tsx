"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getLakeBySlug } from "@/lib/lakes";

interface Trip {
  id: string;
  lake_slug: string;
  activity: string;
  description: string | null;
  planned_date: string;
  planned_time: string | null;
  group_size: number;
  join_count: number;
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

export default function SharedTripPage({ params }: { params: { id: string } }) {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [joinCount, setJoinCount] = useState(0);
  const [joining, setJoining] = useState(false);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    fetch(`/api/trips/${params.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data: Trip) => {
        setTrip(data);
        setJoinCount(data.join_count);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [params.id]);

  async function handleJoin() {
    setJoining(true);
    setJoinCount((c) => c + 1);
    try {
      const res = await fetch(`/api/trips/${params.id}`, { method: "PATCH" });
      if (res.ok) {
        setJoined(true);
      } else {
        setJoinCount((c) => c - 1);
      }
    } catch {
      setJoinCount((c) => c - 1);
    } finally {
      setJoining(false);
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-sand-300">Loading trip...</p>
      </div>
    );
  }

  if (notFound || !trip) {
    return (
      <div className="text-center py-12">
        <h1 className="text-xl font-extrabold text-forest-700 mb-2">Trip not found</h1>
        <p className="text-sm text-sand-400 mb-4">This trip may have expired or been deleted.</p>
        <Link href="/lakes" className="text-lake-500 hover:text-lake-600 text-sm">
          Browse lakes
        </Link>
      </div>
    );
  }

  const lake = getLakeBySlug(trip.lake_slug);
  const lakeName = lake?.name || trip.lake_slug;
  const totalGoing = trip.group_size + joinCount;

  return (
    <div className="max-w-md mx-auto py-8 px-4">
      <Link
        href={`/lakes/${trip.lake_slug}`}
        className="text-sm text-lake-500 hover:text-lake-600 mb-4 inline-block"
      >
        &larr; {lakeName}
      </Link>

      <div className="rounded-2xl border border-sand-200 bg-sand-100 p-6 shadow-sm">
        <p className="text-xs text-sand-300 uppercase tracking-wide mb-1">{lakeName}</p>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">{ACTIVITY_ICONS[trip.activity] || "🌊"}</span>
          <span className="text-lg font-bold text-forest-700 capitalize">{trip.activity}</span>
        </div>

        {trip.description && (
          <p className="text-stone-600 text-sm mb-3">{trip.description}</p>
        )}

        <div className="flex items-center gap-3 text-sm text-stone-600 mb-4">
          <span>{formatDateTime(trip.planned_date, trip.planned_time)}</span>
          <span className="text-sand-300">•</span>
          <span>{totalGoing} {totalGoing === 1 ? "person" : "people"} going</span>
        </div>

        {joined ? (
          <div className="w-full rounded-full bg-forest-500 px-4 py-2.5 text-sm font-medium text-white text-center">
            You&apos;re in! See you there
          </div>
        ) : (
          <button
            onClick={handleJoin}
            disabled={joining}
            className="w-full rounded-full bg-lake-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-lake-600 active:scale-95 disabled:opacity-50 transition-all"
          >
            Join Trip ({totalGoing} going)
          </button>
        )}
      </div>
    </div>
  );
}
