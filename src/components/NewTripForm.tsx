"use client";

import { useState } from "react";

const ACTIVITIES = ["paddleboarding", "fishing", "kayaking"];

interface NewTripFormProps {
  lakeSlug: string;
  onCreated: () => void;
}

export default function NewTripForm({ lakeSlug, onCreated }: NewTripFormProps) {
  const [activity, setActivity] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [plannedDate, setPlannedDate] = useState("");
  const [groupSize, setGroupSize] = useState(1);
  const [status, setStatus] = useState<"idle" | "posting" | "error">("idle");
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!activity || !plannedDate) return;

    setError("");
    setStatus("posting");

    try {
      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lake_slug: lakeSlug,
          activity,
          description: description || null,
          planned_date: plannedDate,
          group_size: groupSize,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create trip");
      }

      setActivity(null);
      setDescription("");
      setPlannedDate("");
      setGroupSize(1);
      setStatus("idle");

      onCreated();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  const isSubmitting = status === "posting";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-sand-200 bg-sand-100 p-4 shadow-sm"
    >
      <h3 className="text-sm font-semibold text-stone-700 mb-3">Plan a Trip</h3>

      <div className="flex flex-wrap gap-2 mb-3">
        {ACTIVITIES.map((a) => (
          <button
            key={a}
            type="button"
            onClick={() => setActivity(activity === a ? null : a)}
            disabled={isSubmitting}
            className={`text-xs font-medium px-3 py-1 rounded-full border transition-colors ${
              activity === a
                ? "bg-forest-500 text-white border-forest-500"
                : "bg-sand-50 text-stone-600 border-sand-200 hover:border-forest-500"
            }`}
          >
            {a}
          </button>
        ))}
      </div>

      <input
        type="text"
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full rounded-lg border border-sand-200 bg-sand-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500/40 focus:border-transparent mb-3"
        disabled={isSubmitting}
      />

      <div className="flex gap-3 mb-3">
        <input
          type="date"
          value={plannedDate}
          onChange={(e) => setPlannedDate(e.target.value)}
          min={today}
          required
          className="flex-1 rounded-lg border border-sand-200 bg-sand-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500/40 focus:border-transparent"
          disabled={isSubmitting}
        />
        <input
          type="number"
          value={groupSize}
          onChange={(e) => setGroupSize(Math.max(1, parseInt(e.target.value) || 1))}
          min={1}
          className="w-20 rounded-lg border border-sand-200 bg-sand-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500/40 focus:border-transparent"
          disabled={isSubmitting}
          placeholder="Size"
        />
      </div>

      {error && <p className="text-sm text-red-500 mb-2">{error}</p>}

      <button
        type="submit"
        disabled={!activity || !plannedDate || isSubmitting}
        className="w-full rounded-full bg-forest-500 px-4 py-2 text-sm font-medium text-white hover:bg-forest-600 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {isSubmitting ? "Creating..." : "Plan Trip"}
      </button>
    </form>
  );
}
