"use client";

import { useState } from "react";
import EditTripForm from "./EditTripForm";

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

interface Participant {
  name: string | null;
  joined_at: string;
}

export default function TripCard({ trip, onDelete, onUpdate }: { trip: Trip; onDelete?: () => void; onUpdate?: () => void }) {
  const [joinCount, setJoinCount] = useState(trip.join_count);
  const [joining, setJoining] = useState(false);
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loadingParticipants, setLoadingParticipants] = useState(false);

  const isCancelled = trip.status === "cancelled";

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

  async function handleCancel() {
    if (!confirm("Cancel this trip?")) return;
    try {
      const res = await fetch(`/api/trips/${trip.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancel" }),
      });
      if (res.ok) onUpdate?.();
    } catch {
      // silent fail
    }
  }

  async function toggleParticipants() {
    if (showParticipants) {
      setShowParticipants(false);
      return;
    }
    setLoadingParticipants(true);
    try {
      const res = await fetch(`/api/trips/${trip.id}/participants`);
      const data = await res.json();
      setParticipants(Array.isArray(data) ? data : []);
    } catch {
      setParticipants([]);
    } finally {
      setLoadingParticipants(false);
      setShowParticipants(true);
    }
  }

  const totalGoing = trip.group_size + joinCount;

  return (
    <div id={`trip-${trip.id}`} className={`rounded-2xl border border-sand-200 bg-sand-100 p-4 shadow-sm animate-fade-in ${isCancelled ? "opacity-60" : ""}`}>
      <div className="flex items-center gap-1.5">
        <span className="text-sm">{ACTIVITY_ICONS[trip.activity] || "🌊"}</span>
        <span className="text-xs font-semibold text-lake-600 capitalize">{trip.activity}</span>
        {isCancelled && (
          <span className="ml-auto text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full uppercase">
            Cancelled
          </span>
        )}
      </div>

      {trip.description && (
        <p className="text-stone-700 text-sm mt-1">{trip.description}</p>
      )}

      <p className="text-xs text-sand-400 mt-1 mb-3">
        {formatDateTime(trip.planned_date, trip.planned_time)}
        <span className="mx-1">•</span>
        {totalGoing} going
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={handleJoin}
            disabled={joining || isCancelled}
            className="bg-lake-500 text-white text-sm font-medium px-4 py-1.5 rounded-full hover:bg-lake-600 active:scale-95 disabled:opacity-50 transition-all"
          >
            Join ({joinCount} going)
          </button>
          <a
            href={`/trips/${trip.id}`}
            className="text-xs text-forest-500 hover:text-forest-600 font-medium transition-colors"
          >
            Group Chat
          </a>
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

        <div className="flex items-center gap-2">
          {!isCancelled && (
            <>
              <button
                onClick={() => setEditing(!editing)}
                className="text-xs text-lake-500 hover:text-lake-600 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={handleCancel}
                className="text-xs text-red-400 hover:text-red-600 transition-colors"
              >
                Cancel
              </button>
            </>
          )}
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

      <button
        onClick={toggleParticipants}
        className="text-xs text-sand-400 hover:text-lake-500 mt-2 transition-colors"
      >
        {showParticipants ? "Hide" : "Who's going?"}
      </button>

      {showParticipants && (
        <div className="mt-1.5 text-xs text-stone-600 space-y-0.5">
          {loadingParticipants ? (
            <p className="text-sand-300">Loading...</p>
          ) : participants.length === 0 ? (
            <p className="text-sand-300">No one has joined yet</p>
          ) : (
            participants.map((p, i) => (
              <p key={i}>{p.name || "Anonymous"}</p>
            ))
          )}
        </div>
      )}

      {editing && !isCancelled && (
        <EditTripForm
          tripId={trip.id}
          initialDate={trip.planned_date}
          initialTime={trip.planned_time}
          initialDescription={trip.description}
          onSaved={() => {
            setEditing(false);
            onUpdate?.();
          }}
          onCancel={() => setEditing(false)}
        />
      )}
    </div>
  );
}
