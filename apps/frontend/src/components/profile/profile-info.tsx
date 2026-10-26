"use client";

import Image from "next/image";
import { useState } from "react";

import DeleteAccountModal from "./delete-account-modal";
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

					<span>Joined January 2026</span>
				</div>

				<div className="mt-3 flex gap-5 text-sm text-[#343B36]">
					<span>5 Following</span>
					<span>34 Followers</span>
				</div>
			</div>

			{/* Delete Account Modal */}
			{isDeleteModalOpen && (
				<DeleteAccountModal
					onClose={() => setIsDeleteModalOpen(false)}
					onConfirm={(password) => {
						// TODO: Send the password securely to your backend
						// to verify the user's identity before deleting the account.

						// Do not store or log the password.
						void password;

						alert("Account deletion requires backend integration.");
					}}
				/>
			)}
		</>
	);
}