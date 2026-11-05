
/**
 * File: app/main/courses/[course]/page.tsx
 *
 * Description:
 * Displays all notes belonging to a selected course.
 *
 * Features:
 * - Retrieves the selected course from the URL.
 * - Filters notes using the reusable NotesFeed component.
 * - Supports Trending and Latest sorting.
 * - Maintains the same layout as the main page.
 * - Displays recently viewed posts.
 */

"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import MainLayout from "@/components/layout/main-layout";
import FeedTabs from "@/components/home/feed-tabs";
import NotesFeed from "@/components/home/notes-feed";
import RecentPosts from "@/components/home/recent-posts";

export default function CoursePage() {

    // Stores the selected sorting option.
    const [sortBy, setSortBy] = useState<"Trending" | "Latest">(
        "Trending"
    );

    // Retrieves the selected course from the URL.
    const params = useParams<{ course: string }>();

    // Converts the course code to uppercase for display.
    const course = params.course.toUpperCase();

    return (
        <MainLayout>
            {/* Main Content Container */}
            <div className="relative w-full px-6 py-6">

                {/* Center Course Feed */}
                <div className="relative left-1/2 w-full max-w-[480px] -translate-x-[calc(50%+111px)]">

                    {/* Course Heading */}
                    <h1 className="text-xl font-semibold text-[#343B36]">
                        {course}
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Notes under {course}
                    </p>

                    {/* Feed Sorting Tabs */}
                    <div className="mt-6">
                        <FeedTabs
                            activeTab={sortBy}
                            onTabChange={setSortBy}
                        />
                    </div>

                    {/* Filtered Course Notes */}
                    <div className="mt-6">
                        <NotesFeed
                            sortBy={sortBy}
                            course={course}
                        />
                    </div>
                </div>

                {/* Recent Posts Section */}
                <div className="absolute right-6 top-6 hidden w-[225px] xl:block">
                    <RecentPosts />
                </div>
            </div>
        </MainLayout>
    );
}
