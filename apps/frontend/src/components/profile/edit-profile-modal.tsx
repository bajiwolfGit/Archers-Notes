"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { ProfileData } from "./profile-types";

interface EditProfileModalProps {
	profile: ProfileData;
	onClose: () => void;
	onSave: (profile: ProfileData) => void;
}

export default function EditProfileModal({
	profile,
	onClose,
	onSave,
}: EditProfileModalProps) {
	const [draft, setDraft] = useState<ProfileData>(() => ({
		...profile,
		courses: [...profile.courses],
	}));

	const [showCourseInput, setShowCourseInput] = useState(false);
	const [newCourse, setNewCourse] = useState("");

	const avatarInputRef = useRef<HTMLInputElement>(null);
	const coverInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";

		return () => {
			document.body.style.overflow = previousOverflow;
		};
  	}, []);

	function handleImageUpload(
		event: React.ChangeEvent<HTMLInputElement>,
		type: "avatar" | "cover"
	) {
		const file = event.target.files?.[0];

		if (!file) return;

		if (!file.type.startsWith("image/")) {
			alert("Please select an image file.");
			return;
		}

    	const reader = new FileReader();

		reader.onload = () => {
			if (typeof reader.result === "string") {
				setDraft((previous) => ({
				...previous,
				[type]: reader.result as string,
				}));
			}
		};

		reader.readAsDataURL(file);
		event.target.value = "";
	}

	function addCourse() {
		const course = newCourse.trim().toUpperCase();

		if (!course) return;

		if (draft.courses.includes(course)) {
			setNewCourse("");
			return;
		}

		setDraft((previous) => ({
			...previous,
			courses: [...previous.courses, course],
		}));

		setNewCourse("");
		setShowCourseInput(false);
  	}

	function removeCourse(course: string) {
		setDraft((previous) => ({
			...previous,
			courses: previous.courses.filter((item) => item !== course),
		}));
	}

	function handleSave() {
		if (!draft.name.trim()) {
			alert("Please enter a nickname.");
			return;
		}

		onSave({
			...draft,
			name: draft.name.trim(),
			bio: draft.bio.trim(),
		});
	}

  	return (
		<div
			className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4 py-6"
			onMouseDown={(event) => {
				if (event.target === event.currentTarget) {
				onClose();
				}
			}}
		>
			<div
				role="dialog"
				aria-modal="true"
				aria-labelledby="edit-profile-title"
				className="flex max-h-[90vh] w-full max-w-[580px] flex-col overflow-hidden rounded-[34px] bg-white shadow-xl"
			>
				{/* Modal Header */}
				<div className="flex h-[58px] shrink-0 items-center justify-between px-7">
					<div className="flex items-center gap-7">
						<button
							type="button"
							onClick={onClose}
							aria-label="Close edit profile"
							className="flex h-8 w-8 items-center justify-center text-2xl text-[#343B36] hover:text-black"
						>
							<Image
								src="/assets/icons/exit.svg"
								alt=""
								width={16}
								height={16}
								className="object-contain"
							/>
						</button>

						<h2
							id="edit-profile-title"
							className="text-sm font-semibold text-[#343B36]"
						>
							Edit Profile
						</h2>
					</div>

					<button
						type="button"
						onClick={handleSave}
						className="rounded-full bg-[#00A651] px-7 py-2.5 text-xs font-semibold text-white transition hover:bg-[#008C45]"
					>
						Save Changes
					</button>
				</div>

				{/* Scrollable Modal Body */}
				<div className="min-h-0 flex-1 overflow-y-auto pb-8">
					
					{/* Cover Photo */}
					<div className="relative h-[120px] w-full bg-gradient-to-b from-[#A9BDB5] to-[#839F93]">
						{draft.cover && (
							<Image
								src={draft.cover}
								alt="Profile cover"
								fill
								unoptimized
								sizes="580px"
								className="object-cover"
							/>
						)}

						<button
							type="button"
							onClick={() => coverInputRef.current?.click()}
							aria-label="Change cover photo"
							className="absolute inset-0 flex items-center justify-center bg-black/10 text-white transition hover:bg-black/20"
						>
							<Image
								src="/assets/icons/edit-photo.svg"
								alt=""
								width={34}
								height={34}
								className="h-[34px] w-[34px] object-contain"
							/>
						</button>

						<input
							ref={coverInputRef}
							type="file"
							accept="image/*"
							className="hidden"
							onChange={(event) => handleImageUpload(event, "cover")}
						/>
					</div>

					{/* Avatar */}
					<div className="relative z-10 -mt-[47px] ml-6">
						<button
							type="button"
							onClick={() => avatarInputRef.current?.click()}
							aria-label="Change profile picture"
							className="relative flex h-[94px] w-[94px] items-center justify-center overflow-hidden rounded-full border-4 border-white bg-[#BFE7D6]"
						>
							{draft.avatar ? (
								<Image
									src={draft.avatar}
									alt="Profile picture"
									fill
									unoptimized
									sizes="94px"
									className="object-cover"
								/>
							) : (
								<Image
									src="/assets/icons/profile.svg"
									alt=""
									width={68}
									height={68}
									className="object-contain"
								/>
							)}

							<span className="absolute inset-0 flex items-center justify-center bg-black/40 text-white transition hover:bg-black/50">
								<Image
									src="/assets/icons/edit-photo.svg"
									alt=""
									width={34}
									height={34}
									className="h-[34px] w-[34px] object-contain"
								/>
							</span>
						</button>

						<input
							ref={avatarInputRef}
							type="file"
							accept="image/*"
							className="hidden"
							onChange={(event) => handleImageUpload(event, "avatar")}
						/>
					</div>

					{/* Form */}
					<div className="mx-auto mt-2 w-[calc(100%-48px)] max-w-[425px] space-y-3">
						
						{/* Nickname */}
						<div className="rounded-md border border-gray-200 px-3 py-2">
							<label
								htmlFor="profile-nickname"
								className="block text-[10px] text-gray-400"
							>
								Nickname
							</label>

							<input
								id="profile-nickname"
								type="text"
								value={draft.name}
								onChange={(event) =>
								setDraft((previous) => ({
									...previous,
									name: event.target.value,
								}))
								}
								className="w-full bg-transparent text-xs font-semibold text-[#343B36] outline-none"
							/>
						</div>

						{/* Bio */}
						<div className="rounded-md border border-gray-200 px-3 py-2">
							<label
								htmlFor="profile-bio"
								className="block text-[10px] text-gray-400"
							>
								Bio
							</label>

							<textarea
								id="profile-bio"
								value={draft.bio}
								onChange={(event) =>
								setDraft((previous) => ({
									...previous,
									bio: event.target.value,
								}))
								}
								rows={3}
								className="w-full resize-none bg-transparent text-xs font-medium text-[#343B36] outline-none"
							/>
						</div>

						{/* Courses */}
						<div className="flex min-h-[120px] flex-col rounded-md border border-gray-200 p-3">
							<span className="text-[10px] text-gray-400">
								Courses
							</span>

							<div className="mt-2 flex flex-wrap gap-2">
								{draft.courses.map((course) => (
									<span
										key={course}
										className="flex items-center gap-1 rounded-full bg-[#E4EBE7] px-3 py-1 text-[10px] font-medium text-[#343B36]"
									>
										{course}

										<button
											type="button"
											onClick={() => removeCourse(course)}
											aria-label={`Remove ${course}`}
											className="text-sm leading-none hover:text-red-500"
										>
											x
										</button>
									</span>
								))}
							</div>

							<div className="mt-auto flex justify-end pt-5">
								{showCourseInput ? (
									<div className="flex flex-wrap items-center justify-end gap-2">
										<input
											type="text"
											value={newCourse}
											onChange={(event) =>
												setNewCourse(event.target.value)
											}
											onKeyDown={(event) => {
												if (event.key === "Enter") {
												event.preventDefault();
												addCourse();
												}
											}}
											placeholder="Course code"
											className="w-28 rounded border border-gray-300 px-2 py-1.5 text-xs outline-none focus:border-[#00A651]"
										/>

										<button
											type="button"
											onClick={addCourse}
											className="rounded-full bg-[#00A651] px-3 py-1.5 text-xs text-white"
										>
											Add
										</button>

										<button
											type="button"
											onClick={() => {
												setShowCourseInput(false);
												setNewCourse("");
											}}
											className="text-xs text-gray-500 hover:text-black"
										>
											Cancel
										</button>
									</div>
								) : (
									<button
										type="button"
										onClick={() => setShowCourseInput(true)}
										className="rounded-full bg-[#00A651] px-3 py-1.5 text-[10px] font-semibold text-white transition hover:bg-[#008C45]"
									>
										Add Course +
									</button>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
  	);
}