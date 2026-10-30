/**
 * File: components/home/feed-tabs.tsx
 *
 * Description:
 * Provides the feed navigation tabs for the Archer's Notes application.
 * Allows users to switch between Trending and Latest posts through
 * an interactive tab interface.
 *
 * Features:
 * - Displays Trending and Latest feed options.
 * - Highlights the currently selected tab.
 * - Notifies the parent component when a different tab is selected.
 * - Displays an icon corresponding to each sorting option.
 * - Updates tab styling dynamically based on the active selection.
 */

"use client";

// Next.js component for optimized image rendering.
import Image from "next/image";

/**
 * FeedTab Type
 *
 * Defines the available sorting options for the notes feed.
 *
 * Restricts the selected tab to either "Trending" or "Latest"
 * to ensure consistent values throughout the application.
 */
type FeedTab = "Trending" | "Latest";

/**
 * FeedTabsProps Interface
 *
 * Defines the properties required by the FeedTabs component.
 *
 * @property activeTab - The currently selected feed tab.
 * @property onTabChange - Callback function triggered when a tab is selected.
 */
interface FeedTabsProps {
	activeTab: FeedTab;
	onTabChange: (tab: FeedTab) => void;
}

/**
 * FeedTabs Component
 *
 * Displays interactive navigation tabs for switching between
 * Trending and Latest posts in the main notes feed.
 *
 * The component receives the currently active tab from its parent
 * and invokes the onTabChange callback when a user selects a tab.
 *
 * The parent component is responsible for managing the selected
 * tab state and updating the displayed feed accordingly.
 *
 * @param activeTab - The currently selected sorting option.
 * @param onTabChange - Callback function for updating the selected tab.
 * @returns The feed navigation tabs with dynamic styling and icons.
 */
export default function FeedTabs({
	activeTab,
	onTabChange,
}: FeedTabsProps) {

	// Defines the available tabs displayed in the feed navigation.
  	const tabs: FeedTab[] = ["Trending", "Latest"];

	return (

		/*
		 * Feed Tabs Container:
		 * Displays the available sorting options horizontally.
		 *
		 * Uses a green border and a fixed height of 36px.
		 * Each tab occupies an equal portion of the container.
		 */
		<div className="flex h-[36px] w-full rounded border border-[#00A651] p-[2px]">
			
			{/* Generate a button for each available feed tab. */}
			{tabs.map((tab) => (
				<button
					key={tab}
					type="button"

					// Notify the parent component when the selected tab changes.
					onClick={() => onTabChange(tab)}

					// Indicate whether this tab is currently selected.
					aria-pressed={activeTab === tab}
					
					/*
					 * Tab Styling:
					 * Active tabs have a green background and white text.
					 * Inactive tabs have a white background and green text.
					 */
					className={`flex flex-1 items-center justify-center gap-3 rounded-sm text-sm transition-colors ${
						activeTab === tab
						? "bg-[#00A651] text-white"
						: "bg-white text-[#00A651]"
					}`}
				>

					{/*
					 * Tab Icon:
					 * Displays a heart icon for Trending posts
					 * and a calendar icon for Latest posts.
					 */}
					<Image
						src={
						tab === "Trending"
							? "/assets/icons/heart.svg"
							: "/assets/icons/calendar.svg"
						}
						alt=""
						width={20}
						height={20}

						/*
						 * Icon Styling:
						 * Converts the icon to white when its tab is active.
						 * Otherwise, the original icon appearance is preserved.
						 */
						className={
							activeTab === tab
								? "brightness-0 invert"
								: ""
						}
					/>

					{/* Display the name of the current tab. */}
					<span>{tab}</span>
				</button>
			))}
		</div>
	);
}