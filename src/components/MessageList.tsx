interface Message {
  id: string;
  lake_slug: string;
  name: string | null;
  text: string;
  created_at: string;
}

export default function MessageList({ messages }: { messages: Message[] }) {
  if (messages.length === 0) {
    return (
      <p className="text-sm text-gray-400 text-center py-8">
        No messages yet. Start the conversation!
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className="rounded-lg bg-gray-50 px-4 py-3 border border-gray-100"
        >
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-sm font-medium text-gray-800">
              {msg.name || "Anonymous"}
            </span>
            <span className="text-xs text-gray-400">
              {new Date(msg.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <p className="text-sm text-gray-700">{msg.text}</p>
        </div>
      ))}
    </div>
  );
}
