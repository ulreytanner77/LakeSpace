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
      className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
    >
      <h3 className="text-sm font-semibold text-gray-700 mb-3">New Post</h3>

      <input
        id="post-file-input"
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="block w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 mb-3"
        disabled={isSubmitting}
        required
      />

      <input
        type="text"
        placeholder="Caption (optional)"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-3"
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
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-white text-gray-600 border-gray-300 hover:border-blue-300"
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
        className="w-full rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
