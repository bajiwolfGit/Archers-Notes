"use client";

import Image from "next/image";
import { useState } from "react";

import DeleteAccountModal from "./delete-account-modal";
import FollowListModal from "./follow-list-modal";
import type { ProfileData } from "./profile-types";

interface ProfileInfoProps {
	profile: ProfileData;
	onEdit: () => void;
}


export default function ProfileInfo({
	profile,
	onEdit,
}: ProfileInfoProps) {
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

	// Stores the users currently followed.
	const [followingIds, setFollowingIds] = useState<number[]>([2, 3]);

	// Mock followers.
	const followerIds = [2, 3, 4];

	// Follow or unfollow a user.
	function handleToggleFollow(userId: number) {
		setFollowingIds((previous) =>
			previous.includes(userId)
				? previous.filter((id) => id !== userId)
				: [...previous, userId]
		);
	}

	const [activeFollowTab, setActiveFollowTab] = useState<
		"following" | "followers" | null
	>(null);
	const joinedDate = profile.createdAt
	? new Date(profile.createdAt).toLocaleDateString("en-US", {
			month: "long",
			year: "numeric",
		})
	: "Unknown";

	return (
		<>
			{/* Profile Information */}
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

				{/* Profile Actions */}
				<div className="flex items-center gap-4">

				{/* Delete Account */}
					<button
						type="button"
						onClick={() => setIsDeleteModalOpen(true)}
						className="transition hover:opacity-70"
						aria-label="Delete profile"
					>
						<Image
							src="/assets/icons/delete.svg"
							alt=""
							width={24}
							height={24}
							className="h-6 w-6 object-contain"
						/>
					</button>

					{/* Edit Profile */}
					<button
						type="button"
						onClick={onEdit}
						className="rounded-full border border-[#343B36] px-7 py-2 text-xs transition hover:bg-gray-100"
					>
						Edit Profile
					</button>
				</div>
			</div>

			{/* Account Information */}
			<div className="mt-8 ml-[70px]">
				<div className="flex items-center gap-3 text-sm text-[#343B36]">
					<Image
						src="/assets/icons/calendar-black.svg"
						alt=""
						width={24}
						height={24}
						className="h-6 w-6 object-contain"
					/>

					<span>Joined {joinedDate}</span>
				</div>

				<div className="mt-3 flex gap-5 text-sm text-[#343B36]">
					<button
						type="button"
						onClick={() => setActiveFollowTab("following")}
						className="hover:text-[#00A651] hover:underline"
					>
						{followingIds.length} Following
					</button>

					<button
						type="button"
						onClick={() => setActiveFollowTab("followers")}
						className="hover:text-[#00A651] hover:underline"
					>
						{followerIds.length} Followers
					</button>
				</div>
			</div>

			{/* Delete Account Modal */}
			{isDeleteModalOpen && (
				<DeleteAccountModal
					onClose={() => setIsDeleteModalOpen(false)}
					onConfirm={(password) => {
					// TODO: Verify password through backend
						void password;

						alert("Account deletion requires backend integration.");
					}}
				/>
			)}

			{/* Following / Followers Modal */}
			{activeFollowTab && (
				<FollowListModal
					initialTab={activeFollowTab}
					followingIds={followingIds}
					followerIds={followerIds}
					onToggleFollow={handleToggleFollow}
					onClose={() => setActiveFollowTab(null)}
				/>
			)}
		</>
	);
}