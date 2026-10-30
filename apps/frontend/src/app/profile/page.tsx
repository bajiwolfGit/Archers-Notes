/**
 * File: app/profile/page.tsx
 *
 * Description:
 * Serves as the user profile page of the Archer's Notes application.
 * Displays the user's profile information, personal details, and
 * published posts. Allows users to update their profile information
 * through the ProfileHeader component.
 *
 * Features:
 * - Displays the user's profile header and account information.
 * - Allows users to update their profile details.
 * - Displays posts created by the user.
 * - Provides an About panel containing additional user information.
 * - Uses a responsive layout to organize profile content.
 * - Uses the shared application layout for consistent navigation.
 */
"use client";

// React hook for managing component state.
import { useState } from "react";

// Shared application layout containing the navigation bar and sidebar.
import MainLayout from "@/components/layout/main-layout";

// Component responsible for displaying and updating the user's profile header.
import ProfileHeader from "@/components/profile/profile-header";

// Component displaying additional user information in the About panel.
import ProfileAbout from "@/components/profile/profile-about";

// Component responsible for displaying posts created by the user.
import ProfilePosts from "@/components/profile/profile-posts";

// Initial profile data and TypeScript type defining the user's profile structure.
import {
	initialProfile,
	type ProfileData,
} from "@/components/profile/profile-types";

/**
 * ProfilePage Component
 *
 * Serves as the main interface for viewing and managing a user's profile.
 * Maintains the current profile information using React state and passes
 * the necessary data to the profile components.
 *
 * The page consists of three main sections:
 * - ProfileHeader: Displays and allows updates to profile information.
 * - ProfilePosts: Displays posts created by the user.
 * - ProfileAbout: Displays additional user information.
 *
 * @returns The user profile page wrapped in MainLayout.
 */
export default function ProfilePage() {

	/**
	 * Profile State:
	 * Stores the current user's profile information.
	 *
	 * Initializes the profile using initialProfile and enforces
	 * the ProfileData type for consistent data structure.
	 *
	 * setProfile allows the ProfileHeader component to update
	 * the profile information displayed throughout the page.
	 */
	const [profile, setProfile] = useState<ProfileData>(initialProfile);

	return (
		<MainLayout>

			{/* Main Profile Page Container */}
			<div className="w-full px-6 py-5">
					
				{/*
				 * Profile Header:
				 * Displays the user's primary profile information.
				 *
				 * The profile prop provides the current profile data.
				 * The onProfileChange prop allows the component
				 * to update the profile state when changes are made.
				 */}
				<ProfileHeader
					profile={profile}
					onProfileChange={setProfile}
				/>

				{/*
				 * Profile Content:
				 * Organizes the user's posts and About panel.
				 *
				 * Uses a single-column layout on smaller screens.
				 * At the xl breakpoint, switches to a two-column layout
				 * with a flexible posts section and a 210px About panel.
				 *
				 * The gap-10 class provides spacing between columns.
				 */}
				<div className="mt-6 grid grid-cols-1 items-start gap-10 xl:grid-cols-[minmax(0,1fr)_210px]">
					
					{/*
					 * Centered Posts Section:
					 * Displays posts created by the current user.
					 *
					 * Uses a flexible container to prevent overflow
					 * and centers the posts within a maximum width of 480px.
					 */}
					<div className="min-w-0">
						<div className="mx-auto w-full max-w-[480px]">

							{/*
							 * ProfilePosts Component:
							 * Retrieves and displays the user's published posts.
							 */}
							<ProfilePosts />
						</div>
					</div>

					{/*
					 * About Panel:
					 * Displays additional information about the user.
					 *
					 * Receives the current profile data through the profile prop.
					 *
					 * Uses a negative top margin of 110px to position
					 * the panel higher relative to the posts section.
					 */}
					<div className="-mt-[110px] min-w-0">
						<ProfileAbout profile={profile} />
					</div>
				</div>
			</div>
		</MainLayout>
	);
}