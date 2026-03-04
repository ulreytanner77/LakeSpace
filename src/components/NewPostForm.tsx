"use client";

import { useState } from "react";

const CONDITION_TAGS = ["windy", "glassy", "choppy", "crowded"];

interface NewPostFormProps {
  lakeSlug: string;
  onPosted: () => void;
}

export default function NewPostForm({ lakeSlug, onPosted }: NewPostFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [status, setStatus] = useState<
    "idle" | "uploading" | "posting" | "error"
  >("idle");
  const [error, setError] = useState("");

  function toggleTag(tag: string) {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;

    setError("");
    setStatus("uploading");

    try {
      // 1) Upload image
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        const data = await uploadRes.json();
        throw new Error(data.error || "Upload failed");
      }

      const { url } = await uploadRes.json();

      // 2) Create post
      setStatus("posting");

      const postRes = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lake_slug: lakeSlug,
          image_url: url,
          caption: caption || null,
          tags,
        }),
      });

      if (!postRes.ok) {
        const data = await postRes.json();
        throw new Error(data.error || "Failed to create post");
      }

      // Reset form
      setFile(null);
      setCaption("");
      setTags([]);
      setStatus("idle");

      // Reset file input
      const fileInput = document.getElementById(
        "post-file-input"
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";

      onPosted();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  const isSubmitting = status === "uploading" || status === "posting";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-sand-200 bg-sand-100 p-4 shadow-sm"
    >
      <h3 className="text-sm font-semibold text-stone-700 mb-3">New Post</h3>

      <input
        id="post-file-input"
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="block w-full text-sm text-sand-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-forest-500/10 file:text-forest-600 hover:file:bg-forest-500/20 mb-3"
        disabled={isSubmitting}
        required
      />

      <input
        type="text"
        placeholder="Caption (optional)"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className="w-full rounded-lg border border-sand-200 bg-sand-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500/40 focus:border-transparent mb-3"
        disabled={isSubmitting}
      />

      <div className="flex flex-wrap gap-2 mb-3">
        {CONDITION_TAGS.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => toggleTag(tag)}
            disabled={isSubmitting}
            className={`text-xs font-medium px-3 py-1 rounded-full border transition-colors ${
              tags.includes(tag)
                ? "bg-forest-500 text-white border-forest-500"
                : "bg-sand-50 text-stone-600 border-sand-200 hover:border-forest-500"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {error && <p className="text-sm text-red-500 mb-2">{error}</p>}

      <button
        type="submit"
        disabled={!file || isSubmitting}
        className="w-full rounded-full bg-forest-500 px-4 py-2 text-sm font-medium text-white hover:bg-forest-600 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {status === "uploading"
          ? "Uploading..."
          : status === "posting"
          ? "Posting..."
          : "Post"}
      </button>
    </form>
  );
}
