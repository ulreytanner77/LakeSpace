"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getLakeBySlug } from "@/lib/lakes";
import Tabs from "@/components/Tabs";
import PostsFeed from "@/components/PostsFeed";
import ChatTab from "@/components/ChatTab";
import TripsTab from "@/components/TripsTab";
import LiveActivity from "@/components/LiveActivity";
import ActivityThisWeek from "@/components/ActivityThisWeek";
import RecentActivity from "@/components/RecentActivity";

export default function LakePage() {
  const params = useParams();
  const slug = params.lakeSlug as string;
  const lake = getLakeBySlug(slug);
  const [activeTab, setActiveTab] = useState<"posts" | "chat" | "trips">("posts");

  if (!lake) {
    return (
      <div className="text-center py-12">
        <h1 className="text-xl font-extrabold text-forest-700 mb-2">
          Lake not found
        </h1>
        <p className="text-sm text-sand-400 mb-4">
          We don&apos;t have a lake with that name.
        </p>
        <Link href="/lakes" className="text-lake-500 hover:text-lake-600 text-sm">
          Back to lakes
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link
        href="/lakes"
        className="text-sm text-lake-500 hover:text-lake-600 mb-3 inline-block"
      >
        &larr; All Lakes
      </Link>

      <div className="mb-4">
        <h1 className="text-2xl font-extrabold text-forest-700">{lake.name}</h1>
        <p className="text-sm text-sunset-500">{lake.region}</p>
        <p className="text-sm text-sand-400 mt-1">{lake.description}</p>
      </div>

      <ActivityThisWeek lakeSlug={slug} />

      <LiveActivity lakeSlug={slug} />

      <RecentActivity lakeSlug={slug} />

      <Tabs active={activeTab} onChange={setActiveTab} />

      {activeTab === "posts" ? (
        <PostsFeed lakeSlug={slug} onSwitchToTrips={() => setActiveTab("trips")} />
      ) : activeTab === "chat" ? (
        <ChatTab lakeSlug={slug} isActive={activeTab === "chat"} />
      ) : (
        <TripsTab lakeSlug={slug} lakeName={lake.name} />
      )}
    </div>
  );
}
