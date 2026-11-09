"use client";

import { useState, useEffect } from "react";

import MainLayout from "@/components/layout/main-layout";

import ProfileHeader from "@/components/profile/profile-header";

import ProfileAbout from "@/components/profile/profile-about";

import ProfilePosts from "@/components/profile/profile-posts";

import ProfileQuizzes from "@/components/profile/profile-quizzes";

import {
	initialProfile,
	type ProfileData,
} from "@/components/profile/profile-types";

const API_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

interface UserProfileResponse {
  id: string;
  name: string;
  gmail: string;
  username: string;
  bio: string | null;
  avatar_url: string | null;
}

export default function ProfilePage() {

	const [profile, setProfile] = useState<ProfileData>(initialProfile);

	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch(`${API_URL}/users/me`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Failed to load profile (${response.status})`);
        }

        const user: UserProfileResponse = await response.json();

        setProfile((currentProfile) => ({
          ...currentProfile,
          name: user.name,
          email: user.gmail,
          bio: user.bio ?? "",
          avatar: user.avatar_url,
        }));
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Unable to load your profile. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  	}, []);

	return (
		<MainLayout>

			<div className="w-full px-6 py-5">
					
				<ProfileHeader
					profile={profile}
					onProfileChange={setProfile}
				/>

				<div className="mt-6 grid grid-cols-1 items-start gap-10 xl:grid-cols-[minmax(0,1fr)_210px]">
					
					<div className="min-w-0">
						<div className="mx-auto w-full max-w-[480px]">

							<ProfilePosts />

							<ProfileQuizzes />
						</div>
					</div>

					<div className="-mt-[110px] min-w-0">
						<ProfileAbout profile={profile} />
					</div>
				</div>
			</div>
		</MainLayout>
	);
}