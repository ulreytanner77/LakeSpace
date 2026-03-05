import Link from "next/link";
import Image from "next/image";
import { lakes } from "@/lib/lakes";

export default function LakeGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {lakes.map((lake) => (
        <Link
          key={lake.slug}
          href={`/lakes/${lake.slug}`}
          className={`block rounded-2xl border border-sand-200 bg-sand-100 shadow-sm hover:shadow-lg hover:border-sunset-400 hover:-translate-y-1 transition-all duration-200 overflow-hidden ${lake.image ? "" : "p-5"}`}
        >
          {lake.image && (
            <div className="relative w-full aspect-video">
              <Image
                src={lake.image}
                alt={lake.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
          )}
          <div className={lake.image ? "p-5" : ""}>
            <h2 className="text-lg font-semibold text-stone-800">{lake.name}</h2>
            <p className="text-sm text-sunset-500 mt-0.5">{lake.region}</p>
            <p className="text-sm text-sand-400 mt-2 line-clamp-2">
              {lake.description}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
