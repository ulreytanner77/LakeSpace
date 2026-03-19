"use client";

import { useState, useEffect, useCallback } from "react";
import TripCard from "./TripCard";
import NewTripForm from "./NewTripForm";
import FilterPills from "./FilterPills";

const ACTIVITY_OPTIONS = ["fishing", "paddleboarding", "swimming", "kayaking", "boating"];
const ACTIVITY_ICONS: Record<string, string> = {
  fishing: "🎣",
  paddleboarding: "🏄",
  swimming: "🏊",
  kayaking: "🛶",
  boating: "⛵",
};

interface Trip {
  id: string;
  lake_slug: string;
  activity: string;
  description: string | null;
  planned_date: string;
  planned_time: string | null;
  group_size: number;
  join_count: number;
  status?: string;
  created_at: string;
}

export default function TripsTab({ lakeSlug, lakeName }: { lakeSlug: string; lakeName?: string }) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activityFilter, setActivityFilter] = useState<string | null>(null);

  const fetchTrips = useCallback(async () => {
    try {
      let url = `/api/trips?lake=${lakeSlug}`;
      if (activityFilter) url += `&activity=${activityFilter}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch trips");
      const data = await res.json();
      setTrips(data);
      setError("");
    } catch {
      setError("Could not load trips");
    } finally {
      setLoading(false);
    }
  }, [lakeSlug, activityFilter]);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  return (
    <div className="space-y-4">
      <FilterPills
        options={ACTIVITY_OPTIONS}
        selected={activityFilter}
        onChange={setActivityFilter}
        icons={ACTIVITY_ICONS}
      />

      {!loading && trips.length > 0 && (
        <h3 className="text-xs font-semibold text-forest-600 uppercase tracking-wide">
          Upcoming Trips{lakeName ? ` at ${lakeName}` : ""}
        </h3>
      )}

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
            onUpdate={fetchTrips}
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

      <NewTripForm lakeSlug={lakeSlug} onCreated={fetchTrips} />
    </div>
  );
}
