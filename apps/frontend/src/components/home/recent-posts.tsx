/**
 * File: components/home/recent-posts.tsx
 *
 * Description:
 * Displays the Recent Posts panel in the Archer's Notes application.
 * Provides a list of recently viewed posts, allowing users to
 * navigate directly to individual posts.
 *
 * Features:
 * - Displays a list of recent posts with author and course information.
 * - Allows users to navigate to individual posts.
 * - Provides a Clear button for removing all displayed recent posts.
 * - Displays an empty state when no recent posts are available.
 * - Uses a bordered panel to separate recent posts from other content.
 */

"use client";

// React hook for managing component state.
import { useState } from "react";

// Next.js component for optimized image rendering.
import Image from "next/image";

// Next.js component for client-side navigation between pages.
import Link from "next/link";

/**
 * Initial Recent Posts
 *
 * Contains mock data representing recently viewed posts.
 *
 * Each post includes:
 * - id: Unique identifier used for navigation.
 * - name: Name of the post's author.
 * - course: Course associated with the post.
 * - title: Title of the post.
 *
 * This data is used to initialize the recentPosts state.
 */
const initialRecentPosts = [
	{
		id: 1,
		name: "John Doe",
		course: "STALGCM",
		title: "Midterms Reviewer",
	},
	{
		id: 2,
		name: "Carmy Berzatto",
		course: "CS1130",
		title: "Notes for Intro to Computing",
	},
];

/**
 * RecentPosts Component
 *
 * Displays a panel containing recently viewed posts.
 * Each post provides a link to its corresponding details page.
 *
 * Manages the displayed recent posts through local React state
 * and allows users to clear the list.
 *
 * When the list is empty, a fallback message is displayed.
 *
 * @returns The Recent Posts panel containing post links or an empty state.
 */
export default function RecentPosts() {

	/**
	 * Recent Posts State
	 *
	 * Stores the list of recent posts displayed in the panel.
	 *
	 * Initializes the state using initialRecentPosts.
	 * The setRecentPosts function updates the list when
	 * the user clears their recent posts.
	 */
	const [recentPosts, setRecentPosts] = useState(initialRecentPosts);

	return (

		/*
		 * Recent Posts Container:
		 * Displays recent posts inside a bordered white panel.
		 *
		 * Uses consistent padding and rounded corners
		 * to match the application's interface.
		 */
		<aside className="w-full rounded-sm border border-gray-200 bg-white p-5">

			{/*
			 * Panel Header:
			 * Displays the section title and Clear button.
			 */}
			<div className="mb-5 flex items-center justify-between">
				<h2 className="text-sm font-semibold">
					Recent Posts
				</h2>

				{/*
				 * Clear Button:
				 * Removes all posts from the displayed list
				 * by updating recentPosts to an empty array.
				 */}
				<button
					type="button"
					onClick={() => setRecentPosts([])}
					className="text-sm text-red-500 hover:underline"
				>
					Clear
				</button>
			</div>

			{/*
			 * Recent Posts List:
			 * Displays recently viewed posts when available.
			 *
			 * If the list is empty, an appropriate
			 * fallback message is displayed instead.
			 */}
			{recentPosts.length === 0 ? (

				/* Empty State: Displayed when there are no recent posts. */
				<p className="py-5 text-center text-xs text-gray-500">
					No recent posts.
				</p>
			) : (
					
				/*
				 * Recent Posts:
				 * Iterates through the recentPosts array and
				 * renders a navigable link for each post.
				 */
				<div>
					{recentPosts.map((post) => (
						
						/*
						 * Post Link:
						 * Navigates to the selected post's details page
						 * using its unique ID.
						 */
						<Link
							key={post.id}
							href={`/posts/${post.id}`}
							className="block border-b border-gray-200 py-5 last:border-b-0"
						>

							{/*
							 * Post Author Information:
							 * Displays the author's profile icon,
							 * name, and associated course.
							 */}
							<div className="flex items-center gap-3">

								{/* Default profile icon for the post author. */}
								<Image
									src="/assets/icons/profile.svg"
									alt=""
									width={35}
									height={35}
								/>

								<div>
									{/* Name of the post author. */}
									<h3 className="text-sm font-semibold">
										{post.name}
									</h3>

									{/* Course associated with the post. */}
									<p className="text-xs">
										{post.course}
									</p>
								</div>
							</div>

							{/*
							 * Post Title:
							 * Displays the title of the recently viewed post.
							 */}
							<p className="ml-4 mt-3 text-xs font-semibold">
								{post.title}
							</p>
						</Link>
					))}
				</div>
			)}
		</aside>
	);
}