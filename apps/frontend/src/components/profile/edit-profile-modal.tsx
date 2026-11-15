"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { ProfileData, Course } from "./profile-types";

const API_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

interface EditProfileModalProps {
	profile: ProfileData;
	onClose: () => void;
	onSave: (profile: ProfileData) => Promise<void>;
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

	const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
	const [courseError, setCourseError] = useState<string | null>(null);

	const avatarInputRef = useRef<HTMLInputElement>(null);
	const coverInputRef = useRef<HTMLInputElement>(null);

	const [isSaving, setIsSaving] = useState(false);
	const [saveError, setSaveError] = useState<string | null>(null);

	const [avatarFile, setAvatarFile] = useState<File | null>(null);
	const [coverFile, setCoverFile] = useState<File | null>(null);

	useEffect(() => {
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";

		return () => {
			document.body.style.overflow = previousOverflow;
		};
  	}, []);

	useEffect(() => {
  		async function fetchCourses() {
    		try {
      			const response = await fetch(`${API_URL}/courses`, {
        		credentials: "include",
      	});

		if (!response.ok) {
			throw new Error("Failed to load available courses.");
		}

      	const courses: Course[] = await response.json();
      	setAvailableCourses(courses);
    		}	catch (error) {
				console.error("Error fetching courses:", error);
				setCourseError("Unable to load available courses.");
		}
	}

	fetchCourses();
	}, []);

	function handleImageUpload(
		event: React.ChangeEvent<HTMLInputElement>,
		type: "avatar" | "cover"
		) {
		const file = event.target.files?.[0];

		if (!file) return;

		const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

		if (!allowedTypes.includes(file.type)) {
			alert("Only JPEG, PNG, and WebP images are allowed.");
			event.target.value = "";
			return;
		}

		if (file.size > 5 * 1024 * 1024) {
			alert("Image must not exceed 5 MB.");
			event.target.value = "";
			return;
		}

		// Keep the actual file for uploading later.
		if (type === "avatar") {
			setAvatarFile(file);
		} else {
			setCoverFile(file);
		}

		// Generate a temporary preview.
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
 		const courseCode = newCourse.trim().toUpperCase();

  		if (!courseCode) return;

  		const selectedCourse = availableCourses.find(
    		(course) => course.code.toUpperCase() === courseCode
  		);

  		if (!selectedCourse) {
    		setCourseError("Course code not found.");
    		return;
		}

		if (
			draft.courses.some(
			(course) => course.course_id === selectedCourse.course_id
			)
		) {
			setCourseError("You have already added this course.");
			return;
		}

		setDraft((previous) => ({
			...previous,
			courses: [...previous.courses, selectedCourse],
		}));

		setCourseError(null);
		setNewCourse("");
		setShowCourseInput(false);
	}

	function removeCourse(courseId: number) {
		setDraft((previous) => ({
			...previous,
			courses: previous.courses.filter(
			(course) => course.course_id !== courseId
			),
		}));
	}

	async function handleSave() {
		if (!draft.name.trim()) {
			alert("Please enter a nickname.");
			return;
		}

		setIsSaving(true);
		setSaveError(null);

		try {
			// Find courses that were added
			const addedCourses = draft.courses.filter(
			(course) =>
				!profile.courses.some(
				(original) => original.course_id === course.course_id
				)
			);

			// Find courses that were removed
			const removedCourses = profile.courses.filter(
			(course) =>
				!draft.courses.some(
				(current) => current.course_id === course.course_id
				)
			);

			// Save course additions and removals
			const courseRequests = [
			...addedCourses.map((course) =>
				fetch(`${API_URL}/users/me/courses`, {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					course_id: course.course_id,
				}),
				})
			),

			...removedCourses.map((course) =>
				fetch(`${API_URL}/users/me/courses/${course.course_id}`, {
				method: "DELETE",
				credentials: "include",
				})
			),
			];

			const responses = await Promise.all(courseRequests);

			if (responses.some((response) => !response.ok)) {
			throw new Error("Failed to update courses.");
			}

			// Upload the new profile picture, if one was selected.
			let updatedAvatar = draft.avatar;

			if (avatarFile) {
			const formData = new FormData();
			formData.append("file", avatarFile);

			const response = await fetch(`${API_URL}/users/me/avatar`, {
				method: "POST",
				credentials: "include",
				body: formData,
			});

			if (!response.ok) {
				throw new Error("Failed to upload profile picture.");
			}

			const updatedProfile = await response.json();
			updatedAvatar = updatedProfile.avatar_url;
			}

			// Upload the new cover image, if one was selected.
			let updatedCover = draft.cover;

			if (coverFile) {
			const formData = new FormData();
			formData.append("file", coverFile);

			const response = await fetch(`${API_URL}/users/me/cover`, {
				method: "POST",
				credentials: "include",
				body: formData,
			});

			if (!response.ok) {
				throw new Error("Failed to upload cover image.");
			}

			const updatedProfile = await response.json();
			updatedCover = updatedProfile.cover_url;
			}

			// Save the other profile information
			await onSave({
			...draft,
			avatar: updatedAvatar,
  			cover: updatedCover,
			name: draft.name.trim(),
			bio: draft.bio.trim(),
			});
			setAvatarFile(null);
			setCoverFile(null);
		} catch (error) {
			console.error("Error saving profile:", error);
			setSaveError("Unable to save your profile. Please try again.");
		} finally {
			setIsSaving(false);
	}
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
						disabled={isSaving}
						className="rounded-full bg-[#00A651] px-7 py-2.5 text-xs font-semibold text-white transition hover:bg-[#008C45]"
					>
						{isSaving ? "Saving..." : "Save Changes"}
					</button>
				</div>

				{/* Save Error Message */}
				{saveError && (
					<p className="px-7 py-2 text-xs text-red-500">
						{saveError}
					</p>
				)}

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

							{courseError && (
								<p className="mt-2 text-xs text-red-500">
									{courseError}
								</p>
							)}

							<div className="mt-2 flex flex-wrap gap-2">
								{draft.courses.map((course) => (
									<span
										key={course.course_id}
										className="flex items-center gap-1 rounded-full bg-[#E4EBE7] px-3 py-1 text-[10px] font-medium text-[#343B36]"
									>
										{course.code}

										<button
										type="button"
										onClick={() => removeCourse(course.course_id)}
										aria-label={`Remove ${course.code}`}
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