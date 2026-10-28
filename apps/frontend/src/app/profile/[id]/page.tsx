/**
 * File: app/profile/[id]/page.tsx
 *
 * Description:
 * Handles the profile pages of other users in the Archer's Notes application.
 * Retrieves and displays a user's profile information, account statistics,
 * published posts, and additional details based on their unique profile ID.
 *
 * Features:
 * - Displays another user's profile information and profile images.
 * - Retrieves user profiles using dynamic URL parameters.
 * - Displays account creation dates, following counts, and follower counts.
 * - Allows users to follow or unfollow other users.
 * - Provides a dropdown menu for reporting user profiles.
 * - Displays posts published by the selected user.
 * - Provides an About panel containing additional profile information.
 * - Displays a fallback message when the requested profile does not exist.
 * - Uses the shared application layout for consistent navigation.
 */

"use client";

// React hooks for managing state, component lifecycle effects, and DOM references.
import { useState, useEffect, useRef } from "react";

// Next.js component for optimized image rendering.
import Image from "next/image";

// Shared application layout containing the navigation bar and sidebar.
import MainLayout from "@/components/layout/main-layout";

// Component displaying additional information about the selected user.
import ProfileAbout from "@/components/profile/profile-about";

// Component for displaying individual posts and the TypeScript Post type.
import PostCard, { type Post } from "@/components/home/post-card";

// TypeScript type defining the structure of user profile information.
import type { ProfileData } from "@/components/profile/profile-types";

// Next.js hook for retrieving dynamic URL parameters.
import { useParams } from "next/navigation";

// Mock post data used to retrieve posts belonging to the selected user.
import { posts } from "@/data/posts";

// Modal component for reporting another user's profile.
import ReportModal from "@/components/posts/report-modal";

/**
 * Mock User Profiles
 *
 * Stores sample profile information for users other than the
 * currently logged-in user.
 *
 * Each profile is identified by a unique string ID corresponding
 * to the dynamic [id] parameter in the page URL.
 *
 * Record<string, ProfileData> ensures that each profile follows
 * the structure defined by the ProfileData type.
 */
const profiles: Record<string, ProfileData> = {
	"2": {
		name: "Jane Doe",
		email: "jane_doe@dlsu.edu.ph",
		subtitle: "COB Student",
		bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
		courses: ["FNDACCT"],
		avatar: null,
		cover: null,
	},

	"3": {
		name: "Carmy Berzatto",
		email: "carmy.berzatto@dlsu.edu.ph",
		subtitle: "CCS Student",
		bio: "Computer Science student sharing notes and reviewers.",
		courses: ["CS1130"],
		avatar: null,
		cover: null,
	},

	"4": {
		name: "Alan Smith",
		email: "alan.smith@dlsu.edu.ph",
		subtitle: "CCS Student",
		bio: "Interested in programming and technology.",
		courses: ["CSADPRG", "CSARCH1"],
		avatar: null,
		cover: null,
	},
};

/**
 * Mock Account Information
 *
 * Stores account-related statistics for each user profile.
 *
 * Each entry contains:
 * - joined: The month and year the user joined the application.
 * - following: The number of accounts followed by the user.
 * - followers: The number of users following the account.
 *
 * The profile ID is used as the key to associate account
 * information with the corresponding user profile.
 */
const accountInfo: Record<
	string,
	{
		joined: string;
		following: number;
		followers: number;
	}
	> = {
	"2": {
		joined: "October 2024",
		following: 16,
		followers: 50,
	},
	"3": {
		joined: "March 2025",
		following: 12,
		followers: 28,
	},
	"4": {
		joined: "June 2025",
		following: 8,
		followers: 15,
	},
};

/**
 * Mock Posts for Jane Doe
 *
 * Contains sample post data associated with Jane Doe's profile.
 *
 * Each post follows the Post type structure, including
 * author information, course, title, content, images,
 * engagement statistics, and creation date.
 *
 * Note: This array is currently not used when rendering posts.
 * The displayed posts are retrieved from the imported posts array.
 */
const janePosts: Post[] = [
  	{
		id: 2,
		authorId: 2,
		name: "Jane Doe",
		course: "FNDACCT",
		time: "2 days ago",
		title: "Lorem Ipsum",
		content:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. " +
			"Reprehenderit neque ab aliqua ipsam consequuntur reprehenderit " +
			"doloremque architecto beatae elit consectetur.\n\n" +
			"Architecto officia totam nostrum voluptas ipsam eum fugiat " +
			"enim sit error incidunt porro.\n\n" +
			"Et ullamco dolorem deserunt quas duis velit laborum qui " +
			"ratione culpa.",
		images: [],
		likes: 0,
		comments: 0,
		createdAt: "2026-10-24",
	},
];

/**
 * OtherProfilePage Component
 *
 * Serves as the main interface for viewing another user's profile.
 *
 * Retrieves the profile ID from the URL and uses it to display
 * the corresponding user's profile information, account statistics,
 * published posts, and About panel.
 *
 * Also manages the follow/unfollow functionality, profile options
 * dropdown, and report profile modal.
 *
 * @returns The selected user's profile page or a profile-not-found message.
 */
export default function OtherProfilePage() {

	// Retrieve the dynamic route parameters from the current URL.
	const params = useParams<{ id: string }>();

	// Extract the unique profile ID from the route parameters.
	const profileId = params.id;

	// Retrieve the profile information associated with the selected user.
	const profile = profiles[profileId];

	// Retrieve the account statistics associated with the selected user.
	const info = accountInfo[profileId];

	/**
	 * Followed Users State
	 *
	 * Stores the IDs of users followed during the current page session.
	 *
	 * A Set is used to prevent duplicate profile IDs and allow
	 * efficient checking, addition, and removal of followed users.
	 */
	const [followedUsers, setFollowedUsers] = useState<Set<string>>(
		new Set()
	);

	// Controls whether the profile's More Options dropdown is visible.
	const [showMoreMenu, setShowMoreMenu] = useState(false);
	
	// Controls whether the Report Profile modal is displayed.
	const [showReportModal, setShowReportModal] = useState(false);

	// Reference to the More Options dropdown container for detecting outside clicks.
	const moreMenuRef = useRef<HTMLDivElement>(null);

	/**
	 * Outside Click Detection
	 *
	 * Registers a mouse event listener when the component mounts.
	 * Automatically closes the More Options dropdown when the user
	 * clicks anywhere outside its container.
	 *
	 * The event listener is removed when the component unmounts
	 * to prevent unnecessary listeners from remaining active.
	 */
	useEffect(() => {

		/**
		 * Handles mouse clicks outside the More Options dropdown.
		 *
		 * @param event - The mouse event triggered by the user's click.
		 */
		const handleClickOutside = (event: MouseEvent) => {
			if (
				moreMenuRef.current &&
				!moreMenuRef.current.contains(event.target as Node)
			) {
				setShowMoreMenu(false);
			}
		};

		// Register the mouse event listener.
		document.addEventListener("mousedown", handleClickOutside);

		// Remove the event listener when the component unmounts.
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	// Determine whether the currently viewed profile is followed.
	const isFollowing = followedUsers.has(profileId);
	
	// Adjust the displayed follower count based on the current follow state.
	const followers = info.followers + (isFollowing ? 1 : 0);

	/**
	 * handleFollow
	 *
	 * Toggles the follow status of the currently viewed user.
	 *
	 * Creates a new Set from the previous followedUsers state
	 * to avoid directly mutating React state.
	 *
	 * If the user is already followed, their ID is removed.
	 * Otherwise, their ID is added to the Set.
	 *
	 * Updating the state automatically refreshes the Follow button
	 * and the displayed follower count.
	 */
	function handleFollow() {
		setFollowedUsers((previous) => {

			// Create a copy of the current followed users.
			const updated = new Set(previous);

			// Remove the user if already followed, otherwise add them.
			if (updated.has(profileId)) {
				updated.delete(profileId);
			} else {
				updated.add(profileId);
			}

			// Return the updated Set to trigger a state update.
			return updated;
		});
	}

	/**
	 * User Posts
	 *
	 * Filters the imported posts array to retrieve posts
	 * created by the currently viewed user.
	 *
	 * Converts the profile ID from a string to a number
	 * before comparing it with each post's authorId.
	 */
	const userPosts = posts.filter(
		(post) => post.authorId === Number(profileId)
	);

	/*
	 * Profile Not Found:
	 * Displays a fallback message when the requested profile ID
	 * does not correspond to an existing user profile.
	 */
	if (!profile) {
		return (
			<MainLayout>
				<div className="p-6 text-sm text-gray-600">
				Profile not found.
				</div>
			</MainLayout>
		);
	}

	return (
		<MainLayout>

			{/* Main Profile Page Container */}
			<div className="w-full px-6 py-5">

				{/*
				 * Profile Cover:
				 * Displays the user's cover image when available.
				 *
				 * If no cover image is provided, a green gradient
				 * background is displayed instead.
				 */}
				<div className="relative">
					<div className="relative h-[125px] w-full overflow-hidden rounded-sm bg-gradient-to-b from-[#F6FCF9] to-[#CBEFDD]">
						{profile.cover && (
							<Image
								src={profile.cover}
								alt="Cover"
								fill
								unoptimized
								sizes="100vw"
								className="object-cover"
							/>
						)}
					</div>

					{/*
					 * Profile Picture:
					 * Displays the user's avatar in a circular container.
					 *
					 * Uses the default profile icon when the user
					 * has not provided a custom avatar.
					 */}
					<div className="absolute -bottom-[62px] left-6">
						<div className="relative flex h-[96px] w-[96px] items-center justify-center overflow-hidden rounded-full bg-[#C7EBDD]">
							{profile.avatar ? (
								<Image
									src={profile.avatar}
									alt={profile.name}
									fill
									unoptimized
									sizes="96px"
									className="object-cover"
								/>
							) : (
								<Image
									src="/assets/icons/profile.svg"
									alt="Profile"
									width={70}
									height={70}
								/>
							)}
						</div>
					</div>
				</div>

				{/*
				 * Profile Information:
				 * Displays the selected user's name, email,
				 * and academic or personal subtitle.
				 */}
				<div className="mt-3 flex items-start justify-between gap-4 pl-[145px]">

					<div>
						<h1 className="text-base font-semibold text-[#343B36]">
							{profile.name}
						</h1>

						<p className="mt-1 text-xs text-gray-600">
							{profile.email}
						</p>

						<p className="mt-2 text-xs text-gray-700">
							{profile.subtitle}
						</p>
					</div>

					{/*
					 * Profile Actions:
					 * Contains the More Options dropdown and Follow button.
					 */}
					<div className="flex items-center gap-3">

						{/*
						 * More Options:
						 * Toggles the dropdown menu containing additional
						 * actions available for the selected user profile.
						 */}
						<div ref={moreMenuRef} className="relative">
							<button
								type="button"
								onClick={() => setShowMoreMenu((prev) => !prev)}
								aria-label="More profile options"
								aria-expanded={showMoreMenu}
								className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100"
							>
								<Image
									src="/assets/icons/more.svg"
									alt=""
									width={23}
									height={6}
								/>
							</button>

							{/*
							 * More Options Dropdown:
							 * Appears when showMoreMenu is true.
							 * Currently provides an option to report the profile.
							 */}
							{showMoreMenu && (
								<div className="absolute right-0 top-full z-30 mt-2 w-[120px] rounded-md border border-gray-200 bg-white py-1 shadow-md">
									<button
										type="button"
										onClick={() => {

											// Close the dropdown menu.
											setShowMoreMenu(false);

											// Open the Report Profile modal.
											setShowReportModal(true);
										}}
										className="w-full px-4 py-2 text-center text-xs text-gray-700 hover:bg-gray-50"
									>
										Report
									</button>
								</div>
							)}
						</div>
						
						{/*
						 * Follow Button:
						 * Allows the user to follow or unfollow the selected profile.
						 *
						 * Updates its appearance and label depending on
						 * whether the user is currently followed.
						 *
						 * aria-pressed communicates the follow state
						 * to assistive technologies.
						 */}
						<button
							type="button"
							onClick={handleFollow}
							aria-pressed={isFollowing}
							className={`min-w-[125px] rounded-full px-6 py-2 text-xs font-semibold transition ${
								isFollowing
									? "border border-[#00A651] bg-white text-[#00A651]"
									: "bg-[#00A651] text-white hover:bg-[#008C45]"
							}`}
						>
							{isFollowing ? "Following" : "Follow"}
						</button>
					</div>
				</div>

				{/*
				 * Account Information:
				 * Displays the user's account creation date,
				 * following count, and follower count.
				 */}
				<div className="mt-8 ml-[70px]">

					{/* Account Creation Date */}
					<div className="flex items-center gap-3 text-sm text-[#343B36]">
						<Image
							src="/assets/icons/calendar-black.svg"
							alt=""
							width={24}
							height={24}
						/>

						<span>Joined {info.joined}</span>
					</div>

					{/*
					 * Follow Statistics:
					 * Displays the number of followed accounts and followers.
					 *
					 * The follower count updates locally when the
					 * Follow button is clicked.
					 */}
					<div className="mt-3 flex gap-5 text-sm text-[#343B36]">
						<span>{info.following} Following</span>
						<span>{followers} Followers</span>
					</div>
				</div>

				{/*
				 * Divider:
				 * Separates the profile information from the
				 * user's published posts and About panel.
				 */}
				<div className="mt-6 ml-[70px] w-[calc(100%-380px)] border-t border-gray-200" />

					{/*
					* Profile Content:
					* Organizes the user's published posts and About panel.
					*
					* Uses a single-column layout on smaller screens.
					* At the xl breakpoint, switches to a two-column layout
					* with a flexible posts section and a 210px About panel.
					*/}
					<div className="mt-6 grid grid-cols-1 items-start gap-10 xl:grid-cols-[minmax(0,1fr)_210px]">

					{/*
					 * User Posts:
					 * Displays posts published by the selected user.
					 *
					 * Each post is rendered using the PostCard component.
					 * The posts are centered within a maximum width of 480px.
					 */}
					<div className="min-w-0">
						<div className="mx-auto w-full max-w-[480px] space-y-5">
							{userPosts.map((post) => (
								<PostCard key={post.id} post={post} />
							))}
						</div>
					</div>

					{/*
					 * About Panel:
					 * Displays additional information about the selected user.
					 *
					 * The isOwnProfile prop is set to false to indicate
					 * that the profile belongs to another user.
					 *
					 * Uses a negative top margin of 110px to align
					 * the panel with the upper profile content.
					 */}
					<div className="-mt-[110px] min-w-0">
						<ProfileAbout profile={profile} isOwnProfile={false} />
					</div>
				</div>
			</div>

			{/*
			 * Report Profile Modal:
			 * Displays the reporting interface when showReportModal is true.
			 *
			 * The onClose callback hides the modal when the user
			 * dismisses or closes the reporting interface.
			 */}
            <ReportModal
                isOpen={showReportModal}
                onClose={() => setShowReportModal(false)}
            />
		</MainLayout>
	);
}