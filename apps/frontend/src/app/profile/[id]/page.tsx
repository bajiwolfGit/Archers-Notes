"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

import MainLayout from "@/components/layout/main-layout";
import ProfileAbout from "@/components/profile/profile-about";
import PostCard, { type Post } from "@/components/home/post-card";

import type { ProfileData } from "@/components/profile/profile-types";

import { useParams } from "next/navigation";
import { posts } from "@/data/posts";
import ReportModal from "@/components/posts/report-modal";

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

export default function OtherProfilePage() {
	const params = useParams<{ id: string }>();
	const profileId = params.id;

	const profile = profiles[profileId];
	const info = accountInfo[profileId];

	const [followedUsers, setFollowedUsers] = useState<Set<string>>(
		new Set()
	);

	const [showMoreMenu, setShowMoreMenu] = useState(false);
	const [showReportModal, setShowReportModal] = useState(false);

	const moreMenuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				moreMenuRef.current &&
				!moreMenuRef.current.contains(event.target as Node)
			) {
				setShowMoreMenu(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const isFollowing = followedUsers.has(profileId);
	const followers = info.followers + (isFollowing ? 1 : 0);

	function handleFollow() {
		setFollowedUsers((previous) => {
			const updated = new Set(previous);

			if (updated.has(profileId)) {
				updated.delete(profileId);
			} else {
				updated.add(profileId);
			}

			return updated;
		});
	}

	const userPosts = posts.filter(
		(post) => post.authorId === Number(profileId)
	);

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
			<div className="w-full px-6 py-5">

				{/* Profile Cover */}
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

					{/* Profile Picture */}
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
					<div className="flex items-center gap-3">

						{/* More Options */}
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

							{/* Dropdown */}
							{showMoreMenu && (
								<div className="absolute right-0 top-full z-30 mt-2 w-[120px] rounded-md border border-gray-200 bg-white py-1 shadow-md">
									<button
										type="button"
										onClick={() => {
											setShowMoreMenu(false);
											setShowReportModal(true);
										}}
										className="w-full px-4 py-2 text-center text-xs text-gray-700 hover:bg-gray-50"
									>
										Report
									</button>
								</div>
							)}
						</div>
						
						{/* Follow Button */}
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

				{/* Account Information */}
				<div className="mt-8 ml-[70px]">
					<div className="flex items-center gap-3 text-sm text-[#343B36]">
						<Image
							src="/assets/icons/calendar-black.svg"
							alt=""
							width={24}
							height={24}
						/>

						<span>Joined {info.joined}</span>
					</div>

					<div className="mt-3 flex gap-5 text-sm text-[#343B36]">
						<span>{info.following} Following</span>
						<span>{followers} Followers</span>
					</div>
				</div>

				{/* Divider */}
				<div className="mt-6 ml-[70px] w-[calc(100%-380px)] border-t border-gray-200" />

					{/* Profile Content */}
					<div className="mt-6 grid grid-cols-1 items-start gap-10 xl:grid-cols-[minmax(0,1fr)_210px]">

					{/* Posts */}
					<div className="min-w-0">
						<div className="mx-auto w-full max-w-[480px] space-y-5">
							{userPosts.map((post) => (
								<PostCard key={post.id} post={post} />
							))}
						</div>
					</div>

					{/* About Panel */}
					<div className="-mt-[110px] min-w-0">
						<ProfileAbout profile={profile} isOwnProfile={false} />
					</div>
				</div>
			</div>

			{/* Report Profile Modal */}
            <ReportModal
                isOpen={showReportModal}
                onClose={() => setShowReportModal(false)}
            />
		</MainLayout>
	);
}