"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProfileData } from "./profile-types";

interface ProfileAboutProps {
	profile: ProfileData;
	isOwnProfile?: boolean;
}

export default function ProfileAbout({
	profile,
	isOwnProfile = true,
}: ProfileAboutProps) {
	const [socialLinks, setSocialLinks] = useState([
		{
			name: "LinkedIn",
			username: "John Doe",
			icon: "linkedin",
		},
		{
			name: "GitHub",
			username: "John Doe",
			icon: "github",
		},
	]);

  const [showAddLink, setShowAddLink] = useState(false);
  const [newLink, setNewLink] = useState("");

  function handleAddLink() {
    if (!newLink.trim()) return;

    setSocialLinks([
		...socialLinks,
		{
			name: "Website",
			username: newLink,
			icon: "website",
		},
    ]);

    setNewLink("");
    setShowAddLink(false);
  }

	return (
		<aside className="w-full rounded-sm border border-gray-200 bg-white p-5">

			{/* About */}
			<section>
				<h2 className="text-sm font-semibold text-[#343B36]">
					About
				</h2>

				<p className="mt-4 text-xs leading-relaxed text-gray-700">
					{profile.bio || "No bio added yet."}
				</p>
			</section>

			<hr className="my-5 border-gray-200" />

			{/* Social Links */}
			<section>
				<h2 className="text-sm font-semibold text-[#343B36]">
					Social Links
				</h2>

				<div className="mt-4 space-y-4">
					{socialLinks.map((link, index) => (
						<div
							key={index}
							className="flex items-center gap-3"
						>
							{link.icon === "linkedin" ? (
								<span className="flex h-6 w-6 items-center justify-center rounded-sm bg-[#0A66C2] text-xs font-bold text-white">
									in
								</span>
							) : link.icon === "github" ? (
								<Image
									src="/assets/icons/socials/github.svg"
									alt="GitHub"
									width={24}
									height={24}
								/>
							) : (
								<span className="text-xl">↗</span>
							)}

							<span className="min-w-0 truncate text-xs text-gray-700">
								{link.username}
							</span>
						</div>
					))}
				</div>

				{/* Add Social Link - Own Profile Only */}
				{isOwnProfile && (
					<>
						{!showAddLink ? (
							<button
								type="button"
								onClick={() => setShowAddLink(true)}
								className="mt-5 rounded-full border border-[#343B36] px-4 py-1.5 text-xs hover:bg-gray-100"
							>
								+ Add Social Link
							</button>
						) : (
							<div className="mt-4 space-y-2">
								<input
									type="url"
									value={newLink}
									onChange={(e) => setNewLink(e.target.value)}
									placeholder="Enter URL"
									className="w-full rounded border border-gray-300 px-2 py-2 text-xs"
								/>

								<div className="flex gap-2">
									<button
										type="button"
										onClick={handleAddLink}
										className="rounded bg-[#00A651] px-3 py-1 text-xs text-white"
									>
										Add
									</button>

									<button
										type="button"
										onClick={() => {
											setShowAddLink(false);
											setNewLink("");
										}}
										className="rounded border px-3 py-1 text-xs"
									>
										Cancel
									</button>
								</div>
							</div>
						)}
					</>
				)}
			</section>

			<hr className="my-5 border-gray-200" />

			{/* Account Statistics */}
			<section className="grid grid-cols-2 gap-4">
				<div>
					<p className="text-sm font-semibold">2</p>
					<p className="text-xs text-gray-400">
						Contributions
					</p>
				</div>

				<div>
					<p className="text-sm font-semibold">4</p>
					<p className="text-xs text-gray-400">
						Saved Notes
					</p>
				</div>

				<div className="col-span-2">
					<p className="text-sm font-semibold">9 months</p>
					<p className="text-xs text-gray-400">
						Account Age
					</p>
				</div>
			</section>

			<hr className="my-5 border-gray-200" />

			{/* Courses */}
			<section>
				<h2 className="mb-3 text-sm font-semibold text-[#343B36]">
					Courses
				</h2>

				<div className="space-y-2 pl-2 text-xs text-gray-700">
					{profile.courses.length > 0 ? (
						profile.courses.map((course) => (
						<p key={course}>{course}</p>
						))
					) : (
						<p className="text-gray-400">
							No courses added yet.
						</p>
					)}
				</div>
			</section>

		</aside>
	);
}