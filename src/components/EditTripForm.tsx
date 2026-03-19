"use client";

import { useState } from "react";

interface EditTripFormProps {
  tripId: string;
  initialDate: string;
  initialTime: string | null;
  initialDescription: string | null;
  onSaved: () => void;
  onCancel: () => void;
}

export default function EditTripForm({
  tripId,
  initialDate,
  initialTime,
  initialDescription,
  onSaved,
  onCancel,
}: EditTripFormProps) {
  const [date, setDate] = useState(initialDate.split("T")[0]);
  const [time, setTime] = useState(initialTime || "");
  const [description, setDescription] = useState(initialDescription || "");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/trips/${tripId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "edit",
          planned_date: date,
          planned_time: time || null,
          description: description || null,
        }),
      });
      if (res.ok) onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-2 border-t border-sand-200 pt-3">
      <div className="flex gap-2">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="flex-1 text-xs rounded-lg border border-sand-200 bg-white px-2 py-1.5 text-stone-700 focus:outline-none focus:ring-1 focus:ring-lake-400"
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="text-xs rounded-lg border border-sand-200 bg-white px-2 py-1.5 text-stone-700 focus:outline-none focus:ring-1 focus:ring-lake-400"
        />
      </div>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        rows={2}
        className="w-full text-xs rounded-lg border border-sand-200 bg-white px-2 py-1.5 text-stone-700 focus:outline-none focus:ring-1 focus:ring-lake-400 resize-none"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="text-xs font-medium px-3 py-1 rounded-full bg-lake-500 text-white hover:bg-lake-600 disabled:opacity-50 transition-all"
        >
          {saving ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-xs font-medium px-3 py-1 rounded-full border border-sand-200 text-sand-400 hover:text-stone-600 transition-all"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
