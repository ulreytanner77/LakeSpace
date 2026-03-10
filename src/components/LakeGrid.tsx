"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { lakes } from "@/lib/lakes";

const FALLBACK_GRADIENTS = [
  "from-lake-600 to-lake-800",
  "from-forest-600 to-forest-800",
  "from-lake-700 to-forest-700",
  "from-sunset-500 to-sunset-700",
  "from-forest-700 to-lake-600",
  "from-lake-500 to-lake-700",
  "from-forest-600 to-lake-700",
  "from-sunset-600 to-lake-600",
  "from-lake-600 to-forest-600",
  "from-forest-500 to-forest-700",
];

export default function LakeGrid() {
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    fetch("/api/trips/counts")
      .then((res) => (res.ok ? res.json() : {}))
      .then((data: Record<string, number>) => setCounts(data))
      .catch(() => setCounts({}));
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {lakes.map((lake, index) => {
        const tripCount = counts[lake.slug] || 0;
        return (
          <Link
            key={lake.slug}
            href={`/lakes/${lake.slug}`}
            className="group relative block rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 aspect-[4/3]"
          >
            {lake.image ? (
              <Image
                src={lake.image}
                alt={lake.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <div
                className={`absolute inset-0 bg-gradient-to-br ${FALLBACK_GRADIENTS[index % FALLBACK_GRADIENTS.length]}`}
              />
            )}

            {/* Gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

            {/* Text content overlaid at bottom-left */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h2 className="text-lg font-semibold text-white drop-shadow-sm">
                {lake.name}
              </h2>
              {tripCount > 0 && (
                <p className="text-sm text-white/85 mt-0.5 drop-shadow-sm">
                  🔥 {tripCount} {tripCount === 1 ? "trip" : "trips"} planned
                </p>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
