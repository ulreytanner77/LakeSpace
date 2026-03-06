"use client";

type TabValue = "posts" | "chat" | "trips";

interface TabsProps {
  active: TabValue;
  onChange: (tab: TabValue) => void;
}

export default function Tabs({ active, onChange }: TabsProps) {
  return (
    <div className="inline-flex gap-1 bg-sand-200/60 rounded-full p-1 mb-4">
      <button
        onClick={() => onChange("posts")}
        className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
          active === "posts"
            ? "bg-forest-500 text-white shadow-sm"
            : "text-stone-600 hover:bg-sand-100"
        }`}
      >
        Posts
      </button>
      <button
        onClick={() => onChange("chat")}
        className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
          active === "chat"
            ? "bg-forest-500 text-white shadow-sm"
            : "text-stone-600 hover:bg-sand-100"
        }`}
      >
        Chat
      </button>
      <button
        onClick={() => onChange("trips")}
        className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
          active === "trips"
            ? "bg-forest-500 text-white shadow-sm"
            : "text-stone-600 hover:bg-sand-100"
        }`}
      >
        Trips
      </button>
    </div>
  );
}
