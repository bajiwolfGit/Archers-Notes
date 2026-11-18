"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import AdminModal, {
	cancelButtonClass,
	fieldClass,
	primaryButtonClass,
} from "./admin-modal";
import AdminToggleChip from "./admin-toggle-chip";

import {
	colleges,
	courseOptions,
	isValidDlsuEmail,
	type AdminUser,
	type UserRole,
} from "@/data/admin";

export interface UserFormValues {
	name: string;
	email: string;
	college: string;
	role: UserRole;
	courses: string[];
	sendInvite: boolean;
	requirePasswordReset: boolean;
}

interface UserFormModalProps {
	user?: AdminUser;
	existingEmails: string[];
	onClose: () => void;
	onSubmit: (values: UserFormValues) => void;
}

export default function UserFormModal({
	user,
	existingEmails,
	onClose,
	onSubmit,
}: UserFormModalProps) {
	const isEditing = Boolean(user);

	const [name, setName] = useState(user?.name ?? "");
	const [email, setEmail] = useState(user?.email ?? "");
	const [college, setCollege] = useState(user?.college ?? "CCS");
	const [role, setRole] = useState<UserRole>(user?.role ?? "Student");
	const [courses, setCourses] = useState<string[]>(user?.courses ?? []);
	const [sendInvite, setSendInvite] = useState(true);
	const [requirePasswordReset, setRequirePasswordReset] = useState(true);
	const [attempted, setAttempted] = useState(false);
	const [done, setDone] = useState(false);

	const [courseMenuOpen, setCourseMenuOpen] = useState(false);
	const courseMenuRef = useRef<HTMLDivElement>(null);

	const availableCourses = courseOptions.filter(
		(course) => !courses.includes(course)
	);

	useEffect(() => {
		if (!courseMenuOpen) return;

		function handleClickOutside(event: MouseEvent) {
			if (
				courseMenuRef.current &&
				!courseMenuRef.current.contains(event.target as Node)
			) {
				setCourseMenuOpen(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);

		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [courseMenuOpen]);

	const normalizedEmail = email.trim().toLowerCase();

	const errors = {
		name: !name.trim() ? "Please enter a name." : "",
		email: !isValidDlsuEmail(email)
			? "Please enter a valid @dlsu.edu.ph email."
			: existingEmails.some(
				(existing) =>
					existing.toLowerCase() === normalizedEmail &&
					existing.toLowerCase() !== user?.email.toLowerCase()
			)
				? "This email is already in use."
				: "",
	};

	function handleSubmit() {
		setAttempted(true);

		if (errors.name || errors.email) return;

		onSubmit({
			name: name.trim(),
			email: normalizedEmail,
			college,
			role,
			courses,
			sendInvite: !isEditing && sendInvite,
			requirePasswordReset: !isEditing && requirePasswordReset,
		});

		setDone(true);
	}

	const selectClass =
		"w-full bg-transparent text-sm font-medium text-[#303a36] outline-none";

	return (
		<AdminModal
			title={isEditing ? "Edit user" : "Add user"}
			maxWidth="max-w-[640px]"
			onClose={onClose}
			success={
				done
					? {
						title: isEditing ? "User Updated" : "User Created",
						message: isEditing
							? `${name.trim()}'s details have been saved.`
							: sendInvite
								? `${name.trim()} has been added and an invite email will be sent.`
								: `${name.trim()} has been added.`,
					}
					: null
			}
			footer={
				<>
					<button type="button" onClick={onClose} className={cancelButtonClass}>
						Cancel
					</button>
					<button type="button" onClick={handleSubmit} className={primaryButtonClass}>
						{isEditing ? "Save changes" : "Create user"}
					</button>
				</>
			}
		>
			<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

				<div>
					<div className={fieldClass(attempted && Boolean(errors.name))}>
						<label htmlFor="user-name" className="block text-xs text-gray-500">
							Name
						</label>
						<input
							id="user-name"
							type="text"
							value={name}
							onChange={(event) => setName(event.target.value)}
							maxLength={100}
							className={selectClass}
						/>
					</div>
					{attempted && errors.name && (
						<p className="mt-1 text-xs text-red-500">{errors.name}</p>
					)}
				</div>

				<div>
					<div className={fieldClass(attempted && Boolean(errors.email))}>
						<label htmlFor="user-email" className="block text-xs text-gray-500">
							Email
						</label>
						<input
							id="user-email"
							type="email"
							value={email}
							onChange={(event) => setEmail(event.target.value)}
							placeholder="name@dlsu.edu.ph"
							maxLength={255}
							className={`${selectClass} placeholder:text-gray-300`}
						/>
					</div>
					{attempted && errors.email && (
						<p className="mt-1 text-xs text-red-500">{errors.email}</p>
					)}
				</div>

				<div className={fieldClass()}>
					<label htmlFor="user-college" className="block text-xs text-gray-500">
						College
					</label>
					<select
						id="user-college"
						value={college}
						onChange={(event) => setCollege(event.target.value)}
						className={selectClass}
					>
						{colleges.map((option) => (
							<option key={option} value={option}>
								{option}
							</option>
						))}
					</select>
				</div>

				<div className={fieldClass()}>
					<label htmlFor="user-role" className="block text-xs text-gray-500">
						Role
					</label>
					<select
						id="user-role"
						value={role}
						onChange={(event) => setRole(event.target.value as UserRole)}
						className={selectClass}
					>
						<option value="Student">Student</option>
						<option value="Admin">Admin</option>
					</select>
				</div>
			</div>

			<div className={fieldClass()}>
				<p className="mb-2 text-xs text-gray-500">Courses</p>

				<div className="flex flex-wrap items-center gap-2">
					{courses.map((course) => (
						<span
							key={course}
							className="inline-flex items-center gap-2 rounded-full bg-[#E7EEE9] px-3 py-1 text-xs font-semibold text-[#303a36]"
						>
							{course}
							<button
								type="button"
								onClick={() =>
									setCourses(courses.filter((item) => item !== course))
								}
								aria-label={`Remove ${course}`}
								className="hover:opacity-60"
							>
								<Image src="/assets/icons/exit.svg" alt="" width={8} height={8} />
							</button>
						</span>
					))}

					{availableCourses.length > 0 && (
						<div ref={courseMenuRef} className="relative">
							<button
								type="button"
								onClick={() => setCourseMenuOpen(!courseMenuOpen)}
								aria-haspopup="listbox"
								aria-expanded={courseMenuOpen}
								className="rounded-full bg-[#00A651] px-3 py-1 text-xs font-semibold text-white hover:bg-[#008F45]"
							>
								Add course
							</button>

							{courseMenuOpen && (
								<div
									role="listbox"
									aria-label="Courses"
									className="absolute left-0 top-full z-30 mt-2 max-h-48 w-40 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1.5 shadow-lg"
								>
									{availableCourses.map((course) => (
										<button
											key={course}
											type="button"
											role="option"
											aria-selected={false}
											onClick={() => {
												setCourses([...courses, course]);
												setCourseMenuOpen(false);
											}}
											className="block w-full rounded-md px-3 py-2 text-left text-xs font-medium text-[#303a36] hover:bg-green-50"
										>
											{course}
										</button>
									))}
								</div>
							)}
						</div>
					)}

					{courses.length === 0 && availableCourses.length === 0 && (
						<span className="text-xs text-gray-400">No courses available.</span>
					)}
				</div>
			</div>

			{!isEditing && (
				<div className="flex flex-wrap gap-2">
					<AdminToggleChip selected={sendInvite} onClick={() => setSendInvite(!sendInvite)}>
						Send invite email
					</AdminToggleChip>
					<AdminToggleChip
						selected={requirePasswordReset}
						onClick={() => setRequirePasswordReset(!requirePasswordReset)}
					>
						Require password reset
					</AdminToggleChip>
				</div>
			)}
		</AdminModal>
	);
}
