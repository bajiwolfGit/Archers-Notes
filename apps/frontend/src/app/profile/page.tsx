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

const collegeCodes: Record<number, string> = {
  1: "BAGCED",
  2: "CCS",
  3: "CLA",
  4: "COB",
  5: "COS",
  6: "GCOE",
  7: "SOE",
};

interface UserProfileResponse {
  id: string;
  name: string;
  gmail: string;
  username: string;
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

export default function ProfilePage() {

	const [profile, setProfile] = useState<ProfileData>(initialProfile);
  const [userId, setUserId] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
  

  const [followingCount, setFollowingCount] = useState(0);
  const [followersCount, setFollowersCount] = useState(0);

  // Refresh the logged-in user's follow counts.
  async function refreshFollowCounts(id: string) {
      try {
          const response = await fetch(`${API_URL}/follows/${id}/counts`, {
              method: "GET",
              credentials: "include",
          });

          if (!response.ok) {
              throw new Error("Failed to refresh follow counts.");
          }

          const counts: { followers: number; following: number } =
              await response.json();

          setFollowersCount(counts.followers);
          setFollowingCount(counts.following);
      } catch (err) {
          console.error("Error refreshing follow counts:", err);
      }
  }

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
        setUserId(user.id);

        await refreshFollowCounts(user.id);

        const collegeId = user.college?.college_id ?? user.college_id;
        const collegeCode = collegeId
          ? collegeCodes[collegeId] ?? user.college?.name
          : null;

        const subtitleParts = [
          collegeCode ? `${collegeCode} Student` : null,
          user.program,
        ].filter(Boolean);

        setProfile((currentProfile) => ({
          ...currentProfile,
          name: user.name,
          email: user.gmail,
          subtitle: subtitleParts.join(" · "),
          bio: user.bio ?? "",
          avatar: user.avatar_url,
          cover: user.cover_url,
          createdAt: user.created_at,
          courses: user.courses ?? [],
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
          followingCount={followingCount}
          followersCount={followersCount}
          refreshFollowCounts={() => userId ? refreshFollowCounts(userId) : Promise.resolve()}
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