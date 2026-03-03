import Link from "next/link";
import { lakes } from "@/lib/lakes";

export default function LakeGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {lakes.map((lake) => (
        <Link
          key={lake.slug}
          href={`/lakes/${lake.slug}`}
          className="block rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-blue-300 transition-all"
        >
          <h2 className="text-lg font-semibold text-gray-900">{lake.name}</h2>
          <p className="text-sm text-blue-600 mt-0.5">{lake.region}</p>
          <p className="text-sm text-gray-500 mt-2 line-clamp-2">
            {lake.description}
          </p>
        </Link>
      ))}
    </div>
  );
}
