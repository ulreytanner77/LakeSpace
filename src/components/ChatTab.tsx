"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import MessageList from "./MessageList";
import NewMessageForm from "./NewMessageForm";

interface Message {
  id: string;
  lake_slug: string;
  name: string | null;
  text: string;
  created_at: string;
}

interface ChatTabProps {
  lakeSlug: string;
  isActive: boolean;
}

export default function ChatTab({ lakeSlug, isActive }: ChatTabProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/messages?lake=${lakeSlug}`);
      if (!res.ok) throw new Error("Failed to fetch messages");
      const data = await res.json();
      setMessages(data);
      setError("");
    } catch {
      setError("Could not load messages");
    } finally {
      setLoading(false);
    }
  }, [lakeSlug]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Poll every 5s when active
  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [isActive, fetchMessages]);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-sand-400">Chat</h3>
        <button
          onClick={fetchMessages}
          className="text-xs text-lake-500 hover:text-lake-600 font-medium transition-colors"
        >
          Refresh
        </button>
      </div>

      {loading && (
        <p className="text-sm text-sand-300 text-center py-8">
          Loading messages...
        </p>
      )}

      {error && (
        <p className="text-sm text-red-500 text-center py-4">{error}</p>
      )}

      {!loading && !error && (
        <div className="max-h-[400px] overflow-y-auto">
          <MessageList messages={messages} />
          <div ref={bottomRef} />
        </div>
      )}

      <NewMessageForm lakeSlug={lakeSlug} onSent={fetchMessages} />
    </div>
  );
}
