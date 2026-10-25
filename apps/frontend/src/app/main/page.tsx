"use client";

import { useState } from "react";
import MainLayout from "@/components/layout/main-layout";
import FeedTabs from "@/components/home/feed-tabs";
import NotesFeed from "@/components/home/notes-feed";
import RecentPosts from "@/components/home/recent-posts";

export default function MainPage() {
  const [sortBy, setSortBy] = useState<"Trending" | "Latest">("Trending");

  return (
    <MainLayout>
      <div className="relative w-full px-6 py-6">

        {/* Center feed aligned with Navbar Search Bar */}
          <div className="relative left-1/2 w-full max-w-[480px] -translate-x-[calc(50%+111px)]">          <FeedTabs
            activeTab={sortBy}
            onTabChange={setSortBy}
          />

          <div className="mt-6">
            <NotesFeed sortBy={sortBy} />
          </div>
        </div>

        {/* Recent Posts - Right Side */}
        <div className="absolute right-6 top-6 hidden w-[225px] xl:block">
          <RecentPosts />
        </div>

      </div>
    </MainLayout>
  );
}