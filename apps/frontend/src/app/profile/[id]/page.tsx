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
import PostCard from "@/components/home/post-card";

// TypeScript type defining the structure of user profile information.
import type { ProfileData } from "@/components/profile/profile-types";

// Next.js hook for retrieving dynamic URL parameters.
import { useParams } from "next/navigation";

// Mock post data used to retrieve posts belonging to the selected user.
import { posts } from "@/data/posts";

// Modal component for reporting another user's profile.
import ReportModal from "@/components/posts/report-modal";

interface PublicProfileResponse {
	id: string;
	name: string;
	username: string | null;
	bio: string | null;
	avatar_url: string | null;
	cover_url: string | null;
	created_at: string;
	college_id: number | null;
	college: {
		college_id: number;
		name: string;
	} | null;
	program: string | null;
	courses: {
		course_id: number;
		code: string;
		name: string;
	}[];
}

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

	// Profile info with selected user
	const [profile, setProfile] = useState<ProfileData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	
	useEffect(() => {
	async function fetchProfile() {
		try {
			setIsLoading(true);
			setError(null);

			const response = await fetch(
				`${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"}/users/${profileId}`,
				{
					credentials: "include",
				}
			);

			if (!response.ok) {
				if (response.status === 404) {
					throw new Error("Profile not found.");
				}

				throw new Error("Failed to load profile.");
			}

			const user: PublicProfileResponse = await response.json();

			const collegeCodes: Record<number, string> = {
				1: "BAGCED",
				2: "CCS",
				3: "CLA",
				4: "COB",
				5: "COS",
				6: "GCOE",
				7: "SOE",
			};

			const collegeId = user.college?.college_id ?? user.college_id;

			const collegeCode = collegeId
				? collegeCodes[collegeId] ?? user.college?.name
				: null;

			const subtitleParts = [
				collegeCode ? `${collegeCode} Student` : null,
				user.program,
			].filter(Boolean);

			setProfile({
				name: user.name,
				email: "",
				subtitle: subtitleParts.join(" · "),
				bio: user.bio ?? "",
				courses: user.courses ?? [],
				avatar: user.avatar_url,
				cover: user.cover_url,
				createdAt: user.created_at,
			});
		} catch (err) {
			console.error("Profile fetch error:", err);
			setError(
				err instanceof Error
					? err.message
					: "Something went wrong."
			);
		} finally {
			setIsLoading(false);
		}
	}

	fetchProfile();
}, [profileId]);
	
	// Stores the selected user's actual follow status and account statistics.
	const [isFollowing, setIsFollowing] = useState(false);
	const [followingCount, setFollowingCount] = useState(0);
	const [followersCount, setFollowersCount] = useState(0);
	const [isFollowLoading, setIsFollowLoading] = useState(false);

	// Retrieves the selected user's follow status and counts from the backend.
	useEffect(() => {
		async function fetchFollowInformation() {
			const API_URL =
				process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

			try {
				const countsResponse = await fetch(
					`${API_URL}/follows/${profileId}/counts`,
					{ credentials: "include" }
				);

				if (countsResponse.ok) {
					const counts: {
						followers: number;
						following: number;
					} = await countsResponse.json();

					setFollowersCount(counts.followers);
					setFollowingCount(counts.following);
				}

				const statusResponse = await fetch(
					`${API_URL}/follows/${profileId}/status`,
					{ credentials: "include" }
				);

				if (statusResponse.ok) {
					const status: { isFollowing: boolean } =
						await statusResponse.json();

					setIsFollowing(status.isFollowing);
				}
			} catch (err) {
				console.error("Follow information fetch error:", err);
			}
		}

		fetchFollowInformation();
	}, [profileId]);

	// Follows or unfollows the selected user through the backend.
	async function handleFollow() {
		if (isFollowLoading) return;

		const API_URL =
			process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

		try {
			setIsFollowLoading(true);

			const response = await fetch(
				`${API_URL}/follows/${profileId}`,
				{
					method: isFollowing ? "DELETE" : "POST",
					credentials: "include",
				}
			);

			if (!response.ok) {
				throw new Error("Failed to update follow status.");
			}

			const newFollowStatus = !isFollowing;

			setIsFollowing(newFollowStatus);

			// Refresh the selected user's follow counts.
			const countsResponse = await fetch(
				`${API_URL}/follows/${profileId}/counts`,
				{ credentials: "include" }
			);

			if (countsResponse.ok) {
				const counts: {
					followers: number;
					following: number;
				} = await countsResponse.json();

				setFollowersCount(counts.followers);
				setFollowingCount(counts.following);
			}
		} catch (err) {
			console.error("Follow action error:", err);
			alert("Unable to update follow status. Please try again.");
		} finally {
			setIsFollowLoading(false);
		}
	}

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
	if (isLoading) {
		return (
			<MainLayout>
				<div className="p-6 text-sm text-gray-600">
					Loading profile...
				</div>
			</MainLayout>
		);
	}

	if (error || !profile) {
		return (
			<MainLayout>
				<div className="p-6 text-sm text-gray-600">
					{error || "Profile not found."}
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
							disabled={isFollowLoading}
							aria-pressed={isFollowing}
							className={`min-w-[125px] rounded-full px-6 py-2 text-xs font-semibold transition ${
								isFollowing
									? "border border-[#00A651] bg-white text-[#00A651]"
									: "bg-[#00A651] text-white hover:bg-[#008C45]"
							} disabled:cursor-not-allowed disabled:opacity-60`}
						>
							{isFollowLoading
								? "Loading..."
								: isFollowing
									? "Following"
									: "Follow"}
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

						<span>
							Joined{" "}
							{profile.createdAt
								? new Date(profile.createdAt).toLocaleDateString("en-US", {
										month: "long",
										year: "numeric",
									})
								: "Unknown"}
						</span>
					</div>

					{/*
					 * Follow Statistics:
					 * Displays the number of followed accounts and followers.
					 *
					 * The follower count updates locally when the
					 * Follow button is clicked.
					 */}
					<div className="mt-3 flex gap-5 text-sm text-[#343B36]">
						<span>{followingCount} Following</span>
						<span>{followersCount} Followers</span>
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