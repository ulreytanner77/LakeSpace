"use client";

import { useState, useEffect, useCallback } from "react";
import TripCard from "./TripCard";
import NewTripForm from "./NewTripForm";

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

export default function TripsTab({ lakeSlug, lakeName }: { lakeSlug: string; lakeName?: string }) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTrips = useCallback(async () => {
    try {
      const res = await fetch(`/api/trips?lake=${lakeSlug}`);
      if (!res.ok) throw new Error("Failed to fetch trips");
      const data = await res.json();
      setTrips(data);
      setError("");
    } catch {
      setError("Could not load trips");
    } finally {
      setLoading(false);
    }
  }, [lakeSlug]);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  const upcoming = trips.slice(0, 5);

  return (
    <div className="space-y-4">
      {!loading && upcoming.length > 0 && (
        <div className="rounded-2xl border border-lake-500/20 bg-lake-500/5 p-4">
          <h3 className="text-xs font-semibold text-forest-600 uppercase tracking-wide mb-2.5">
            Upcoming{lakeName ? ` at ${lakeName}` : ""}
          </h3>
          <div className="space-y-1.5">
            {upcoming.map((trip) => {
              const totalGoing = trip.group_size + trip.join_count;
              return (
                <a
                  key={trip.id}
                  href={`#trip-${trip.id}`}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-lake-500/10 transition-colors"
                >
                  <span className="text-sm">{ACTIVITY_ICONS[trip.activity] || "🌊"}</span>
                  <span className="text-xs font-medium text-lake-600 capitalize">{trip.activity}</span>
                  <span className="text-xs text-sand-300">•</span>
                  <span className="text-xs text-stone-600">{formatDateTime(trip.planned_date, trip.planned_time)}</span>
                  <span className="text-xs text-sand-300">•</span>
                  <span className="text-xs text-stone-600">{totalGoing} going</span>
                </a>
              );
            })}
          </div>
        </div>
      )}

      <NewTripForm lakeSlug={lakeSlug} onCreated={fetchTrips} />

      {loading && (
        <p className="text-sm text-sand-300 text-center py-8">
          Loading trips...
        </p>
      )}

      {error && (
        <p className="text-sm text-red-500 text-center py-4">{error}</p>
      )}

      {!loading && !error && trips.length === 0 && (
        <p className="text-sm text-sand-300 text-center py-8">
          No trips planned yet. Be the first!
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {trips.map((trip) => (
          <TripCard
            key={trip.id}
            trip={trip}
            onDelete={async () => {
              if (!confirm("Delete this trip?")) return;
              try {
                const res = await fetch(`/api/trips/${trip.id}`, {
                  method: "DELETE",
                });
                if (res.ok) {
                  setTrips((prev) => prev.filter((t) => t.id !== trip.id));
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
