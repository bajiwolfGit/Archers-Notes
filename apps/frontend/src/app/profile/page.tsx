"use client";

import { useState } from "react";

import MainLayout from "@/components/layout/main-layout";

import ProfileHeader from "@/components/profile/profile-header";
import ProfileAbout from "@/components/profile/profile-about";
import ProfilePosts from "@/components/profile/profile-posts";

import {
	initialProfile,
	type ProfileData,
} from "@/components/profile/profile-types";

export default function ProfilePage() {
	const [profile, setProfile] = useState<ProfileData>(initialProfile);

	return (
		<MainLayout>
			<div className="w-full px-6 py-5">
				{/* Profile Header */}
				<ProfileHeader
					profile={profile}
					onProfileChange={setProfile}
				/>

				{/* Profile Content */}
				<div className="mt-6 grid grid-cols-1 items-start gap-10 xl:grid-cols-[minmax(0,1fr)_210px]">
					
					{/* Centered Posts */}
					<div className="min-w-0">
						<div className="mx-auto w-full max-w-[480px]">
						<ProfilePosts />
						</div>
					</div>

					{/* About Panel */}
					<div className="-mt-[110px] min-w-0">
						<ProfileAbout profile={profile} />
					</div>
				</div>
			</div>
		</MainLayout>
	);
}