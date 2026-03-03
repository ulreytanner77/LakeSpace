"use client";

interface TabsProps {
  active: "posts" | "chat";
  onChange: (tab: "posts" | "chat") => void;
}

export default function Tabs({ active, onChange }: TabsProps) {
  return (
    <div className="flex border-b border-gray-200 mb-4">
      <button
        onClick={() => onChange("posts")}
        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
          active === "posts"
            ? "border-blue-500 text-blue-600"
            : "border-transparent text-gray-500 hover:text-gray-700"
        }`}
      >
        Posts
      </button>
      <button
        onClick={() => onChange("chat")}
        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
          active === "chat"
            ? "border-blue-500 text-blue-600"
            : "border-transparent text-gray-500 hover:text-gray-700"
        }`}
      >
        Chat
      </button>
    </div>
  );
}
