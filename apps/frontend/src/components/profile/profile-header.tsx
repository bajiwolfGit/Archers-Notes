/**
 * File: components/profile/profile-header.tsx
 *
 * Description:
 * Displays the header section of a user's profile
 * in the Archer's Notes application.
 *
 * Includes the user's cover image, profile picture,
 * profile information, and an option to edit their profile.
 *
 * Features:
 * - Displays a customizable profile cover image.
 * - Displays the user's profile picture.
 * - Provides a default profile icon when no avatar is set.
 * - Displays user information through ProfileInfo.
 * - Opens the EditProfileModal for profile editing.
 * - Handles saving updated profile information.
 * - Notifies the parent component when profile data changes.
 * - Displays a divider below the profile information.
 */

"use client";

// React hook for managing component state.
import { useState } from "react";

// Next.js component for optimized image rendering.
import Image from "next/image";

// Component responsible for displaying user profile information.
import ProfileInfo from "./profile-info";

// Modal component for editing profile information.
import EditProfileModal from "./edit-profile-modal";

// Initial profile data and reusable profile type.
import {
	initialProfile,
	type ProfileData,
} from "./profile-types";

/**
 * ProfileHeaderProps Interface
 *
 * Defines the properties required by the ProfileHeader component.
 *
 * @property profile - Object containing the user's profile information.
 *
 * @property onProfileChange - Callback function that receives the
 *                             updated profile data after saving changes.
 */
interface ProfileHeaderProps {
	profile: ProfileData;
	onProfileChange: (profile: ProfileData) => void;
}

/**
 * ProfileHeader Component
 *
 * Displays the visual header section of a user's profile.
 *
 * Receives the user's profile information from its parent
 * component and renders the cover image, profile picture,
 * and profile details.
 *
 * Manages whether the EditProfileModal is visible.
 *
 * When profile changes are saved, the updated profile
 * information is passed to the parent component through
 * the onProfileChange callback.
 *
 * @param profile - Current profile information.
 * @param onProfileChange - Function for updating profile data.
 * @returns The profile header and edit profile modal.
 */
export default function ProfileHeader({
	profile,
	onProfileChange,
}: ProfileHeaderProps) {

	/**
	 * Edit Modal State
	 *
	 * Determines whether the EditProfileModal is displayed.
	 *
	 * false:
	 * The edit profile modal is hidden.
	 *
	 * true:
	 * The edit profile modal is visible.
	 *
	 * Initially set to false.
	 */
	const [isEditing, setIsEditing] = useState(false);

	/**
	 * handleSave
	 *
	 * Handles saving updated profile information.
	 *
	 * Receives the updated profile object from
	 * EditProfileModal and forwards it to the parent
	 * component through onProfileChange.
	 *
	 * After forwarding the updated information,
	 * the edit profile modal is closed.
	 *
	 * @param updatedProfile - Updated user profile information.
	 * @returns void
	 */
	function handleSave(updatedProfile: ProfileData) {

		// Notify the parent component of the updated profile data.
		onProfileChange(updatedProfile);

		// Close the edit profile modal after saving.
		setIsEditing(false);
	}

	return (
		<>
			{/*
			 * Profile Header Container:
			 * Wraps the cover image, profile picture,
			 * profile information, and divider.
			 */}
			<div className="w-full">

				{/*
				 * Cover and Profile Picture:
				 * Provides a relatively positioned container
				 * for the cover image and overlapping avatar.
				 */}
				<div className="relative w-full">

					{/*
					 * Profile Cover:
					 * Displays the user's cover image when available.
					 *
					 * If no cover image is assigned, the container
					 * displays a green gradient background.
					 *
					 * The cover image fills the container
					 * using Next.js Image with object-cover.
					 */}
					<div className="relative h-[125px] w-full overflow-hidden rounded-sm bg-gradient-to-b from-[#F6FCF9] to-[#CBEFDD]">

						{/*
						 * Custom Cover Image:
						 * Rendered only when profile.cover
						 * contains an image URL.
						 */}
						{profile.cover && (
							<Image
								src={profile.cover}
								alt="Profile cover"
								fill
								unoptimized
								sizes="100vw"
								className="object-cover"
							/>
						)}
					</div>

					{/*
					 * Profile Picture:
					 * Displays the user's avatar overlapping
					 * the bottom-left area of the cover.
					 *
					 * Absolute positioning places the avatar
					 * partially outside the cover container.
					 */}
					<div className="absolute -bottom-[62px] left-6">

						{/*
						 * Avatar Container:
						 * Creates a circular background
						 * for the user's profile picture.
						 *
						 * overflow-hidden ensures the image
						 * stays within the circular boundary.
						 */}
						<div className="relative flex h-[96px] w-[96px] items-center justify-center overflow-hidden rounded-full bg-[#C7EBDD]">

							{/*
							 * Profile Avatar:
							 * Displays the user's custom avatar
							 * when profile.avatar contains an image URL.
							 *
							 * Otherwise, displays the default
							 * profile icon.
							 */}
							{profile.avatar ? (
								<Image
									src={profile.avatar}
									alt={`${profile.name}'s profile picture`}
									fill
									unoptimized
									sizes="96px"
									className="object-cover"
								/>
							) : (
								<Image
									src="/assets/icons/profile.svg"
									alt="Profile picture"
									width={70}
									height={70}
									className="object-contain"
								/>
							)}
						</div>
					</div>
				</div>

				{/*
				 * Profile Information:
				 * Displays the user's profile details
				 * through the ProfileInfo component.
				 *
				 * Passes the current profile object
				 * to ProfileInfo.
				 *
				 * The onEdit callback opens the
				 * EditProfileModal when the user
				 * selects the edit profile action.
				 */}
				<ProfileInfo
					profile={profile}
					onEdit={() => setIsEditing(true)}
				/>

				{/*
				 * Divider:
				 * Displays a horizontal line beneath
				 * the profile information.
				 *
				 * Uses the existing margin and width
				 * values to align the divider with
				 * the profile page layout.
				 */}
				<div className="mt-6 ml-[70px] w-[calc(100%-380px)] border-t border-gray-200" />
			</div>

			{/*
			 * Edit Profile Modal:
			 * Conditionally renders EditProfileModal
			 * when isEditing is true.
			 *
			 * profile:
			 * Provides the current profile information
			 * to populate the edit form.
			 *
			 * onClose:
			 * Closes the modal without calling handleSave.
			 *
			 * onSave:
			 * Calls handleSave with the updated profile data.
			 */}
			{isEditing && (
				<EditProfileModal
					profile={profile}
					onClose={() => setIsEditing(false)}
					onSave={handleSave}
				/>
			)}
		</>
	);
}