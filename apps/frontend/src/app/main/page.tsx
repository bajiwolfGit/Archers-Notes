/**
 * File: app/main/page.tsx
 *
 * Description:
 * Serves as the main page of the Archer's Notes application.
 * Displays the notes feed, allows users to switch between
 * Trending and Latest posts, and provides a section for
 * recently viewed posts.
 *
 * Features:
 * - Displays the main notes feed.
 * - Allows users to sort posts by Trending or Latest.
 * - Displays recently viewed posts on the right side.
 * - Aligns the notes feed with the navigation bar's search bar.
 * - Uses the shared application layout for consistent navigation.
 */

"use client";

// React hook for managing component state.
import { useState } from "react";

// Shared application layout containing the navigation bar and sidebar.
import MainLayout from "@/components/layout/main-layout";

// Component providing tabs for switching between Trending and Latest posts.
import FeedTabs from "@/components/home/feed-tabs";

// Component responsible for displaying the notes feed based on the selected sorting option.
import NotesFeed from "@/components/home/notes-feed";

// Component displaying recently viewed posts on the right side of the page.
import RecentPosts from "@/components/home/recent-posts";


/**
 * MainPage Component
 *
 * Serves as the main interface for browsing notes in Archer's Notes.
 * Manages the selected sorting option and passes it to the feed
 * components to control which posts are displayed and their order.
 *
 * @returns The main page containing the notes feed and recent posts.
 */
export default function MainPage() {
	
	// Stores the selected sorting option for the notes feed.
	// Defaults to "Trending" when the page is first loaded.
	const [sortBy, setSortBy] = useState<"Trending" | "Latest">("Trending");

	return (
		<MainLayout>
			{/* Main Content Container */}
			<div className="relative w-full px-6 py-6">

				{/*
				 * Center Notes Feed:
				 * Displays the feed tabs and the list of available notes.
				 *
				 * Uses absolute positioning adjustments to align the
				 * feed horizontally with the navigation bar's search bar.
				 *
				 * The feed has a maximum width of 480px.
				 */}
				<div className="relative left-1/2 w-full max-w-[480px] -translate-x-[calc(50%+111px)]">
					
					{/*
					 * Feed Sorting Tabs:
					 * Allows users to switch between Trending and Latest.
					 *
					 * activeTab identifies the currently selected option.
					 * onTabChange updates the sortBy state when a tab is selected.
					 */}
					<FeedTabs
						activeTab={sortBy}
						onTabChange={setSortBy}
					/>

					{/*
					 * Notes Feed:
					 * Displays posts according to the selected sorting option.
					 *
					 * The sortBy prop passes the current sorting preference
					 * to the NotesFeed component.
					 */}
					<div className="mt-6">
						<NotesFeed sortBy={sortBy} />
					</div>
				</div>

				{/*
				 * Recent Posts Section:
				 * Displays recently viewed posts on the right side.
				 *
				 * Positioned independently from the main notes feed.
				 * Hidden on smaller screens and becomes visible
				 * on extra-large screens (xl breakpoint and above).
				 *
				 * Uses a fixed width of 225px.
				 */}
				<div className="absolute right-6 top-6 hidden w-[225px] xl:block">
					<RecentPosts />
				</div>
			</div>
		</MainLayout>
	);
}