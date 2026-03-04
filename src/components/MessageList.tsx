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
      <p className="text-sm text-sand-300 text-center py-8">
        No messages yet. Start the conversation!
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className="rounded-2xl bg-sand-100 px-4 py-3 border border-sand-200 animate-fade-in"
        >
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-sm font-medium text-forest-700">
              {msg.name || "Anonymous"}
            </span>
            <span className="text-xs text-sand-300">
              {new Date(msg.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <p className="text-sm text-stone-700">{msg.text}</p>
        </div>
      ))}
    </div>
  );
}
