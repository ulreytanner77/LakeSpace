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
  group_size: number;
  join_count: number;
  created_at: string;
}

export default function TripsTab({ lakeSlug }: { lakeSlug: string }) {
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

  return (
    <div className="space-y-4">
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
