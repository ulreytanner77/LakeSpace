"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface TripMessage {
  id: string;
  trip_id: string;
  name: string | null;
  text: string;
  created_at: string;
}

interface TripChatProps {
  tripId: string;
}

export default function TripChat({ tripId }: TripChatProps) {
  const [messages, setMessages] = useState<TripMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/trips/${tripId}/messages`);
      if (!res.ok) throw new Error("Failed to fetch messages");
      const data = await res.json();
      setMessages(data);
      setError("");
    } catch {
      setError("Could not load messages");
    } finally {
      setLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Poll every 5s
  useEffect(() => {
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;

    setSending(true);
    setError("");

    try {
      const res = await fetch(`/api/trips/${tripId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || null,
          text: text.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send message");
      }

      setText("");
      fetchMessages();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mt-6 rounded-2xl border border-sand-200 bg-white p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-forest-700">Group Chat</h3>
        <button
          onClick={fetchMessages}
          className="text-xs text-lake-500 hover:text-lake-600 font-medium transition-colors"
        >
          Refresh
        </button>
      </div>

      {loading && (
        <p className="text-sm text-sand-300 text-center py-6">
          Loading messages...
        </p>
      )}

      {error && (
        <p className="text-sm text-red-500 text-center py-2">{error}</p>
      )}

      {!loading && !error && (
        <div className="max-h-[300px] overflow-y-auto mb-3">
          {messages.length === 0 ? (
            <p className="text-sm text-sand-300 text-center py-6">
              No messages yet. Say hi to the group!
            </p>
          ) : (
            <div className="space-y-2">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className="rounded-xl bg-sand-50 px-3 py-2 border border-sand-100 animate-fade-in"
                >
                  <div className="flex items-baseline gap-2 mb-0.5">
                    <span className="text-xs font-medium text-forest-700">
                      {msg.name || "Anonymous"}
                    </span>
                    <span className="text-[10px] text-sand-300">
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
          )}
          <div ref={bottomRef} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="Name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-lg border border-sand-200 bg-sand-50 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500/40 focus:border-transparent"
          disabled={sending}
        />
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 rounded-lg border border-sand-200 bg-sand-50 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500/40 focus:border-transparent"
            disabled={sending}
            required
          />
          <button
            type="submit"
            disabled={sending || !text.trim()}
            className="rounded-full bg-forest-500 px-4 py-1.5 text-sm font-medium text-white hover:bg-forest-600 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {sending ? "..." : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
}
