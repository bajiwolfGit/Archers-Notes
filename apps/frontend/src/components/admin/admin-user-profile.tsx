"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import AdminStatusBadge from "./admin-status-badge";
import AdminUserDialogs, {
	useUnsuspendUser,
	type AdminUserDialog,
} from "./admin-user-dialogs";
import RemoveNoteModal, { type RemovalDetails } from "./remove-note-modal";

import { useAdmin } from "@/context/admin-context";
import { usePosts } from "@/context/posts-context";

import {
	formatMonthYear,
	formatRelativeTime,
	type AdminUser,
} from "@/data/admin";

import type { Post } from "@/components/home/post-card";

type ProfileTab = "Notes" | "Reports" | "Activity" | "Trending";

type NoteState = "Live" | "Hidden" | "Removed";

interface AdminUserProfileProps {
	userId: number;
}

export default function AdminUserProfile({ userId }: AdminUserProfileProps) {
	const { getUser, loaded } = useAdmin();

	if (!loaded) return null;

	const user = getUser(userId);

	if (!user) {
		return (
			<div className="mx-auto w-full max-w-[480px] px-6 py-20 text-center">
				<h1 className="text-lg font-semibold text-[#303a36]">User not found</h1>
				<p className="mt-2 text-sm text-gray-500">
					This account may have been deleted or does not exist.
				</p>
				<Link
					href="/admin/users"
					className="mt-6 inline-block rounded-full border border-[#00A651] px-6 py-2 text-sm text-[#00A651] hover:bg-green-50"
				>
					Back to Users
				</Link>
			</div>
		);
	}

	return <AdminUserProfileContent key={user.id} user={user} />;
}

function AdminUserProfileContent({ user }: { user: AdminUser }) {
	const router = useRouter();
	const { reports, activityLog, now, logAction } = useAdmin();
	const { posts } = usePosts();
	const unsuspendUser = useUnsuspendUser();

	const [activeTab, setActiveTab] = useState<ProfileTab>("Notes");
	const [dialog, setDialog] = useState<AdminUserDialog | null>(null);

	const [noteStates, setNoteStates] = useState<Record<number, NoteState>>({});
	const [noteToRemove, setNoteToRemove] = useState<Post | null>(null);

	const userPosts = posts
		.filter((post) => post.authorId === user.id)
		.filter((post) => noteStates[post.id] !== "Removed");

	const userReports = reports.filter((report) => report.authorId === user.id);

	const postTitles = posts
		.filter((post) => post.authorId === user.id)
		.map((post) => post.title);

	const userActivity = activityLog.filter(
		(entry) => entry.target === user.name || postTitles.includes(entry.target)
	);

	const trendingPosts = [...userPosts].sort(
		(a, b) => b.likes + b.comments - (a.likes + a.comments)
	);

	function openReportsFor(postId: number) {
		return userReports.filter(
			(report) =>
				report.postId === postId &&
				report.targetType === "Note" &&
				(report.status === "Open" || report.status === "In Review")
		);
	}

	function handleToggleHide(post: Post) {
		const hidden = noteStates[post.id] === "Hidden";

		setNoteStates((previous) => ({
			...previous,
			[post.id]: hidden ? "Live" : "Hidden",
		}));

		logAction(hidden ? "Unhid note" : "Hid note", post.title);
	}

	function handleConfirmRemove(details: RemovalDetails) {
		if (!noteToRemove) return;

		setNoteStates((previous) => ({
			...previous,
			[noteToRemove.id]: details.mode === "hide" ? "Hidden" : "Removed",
		}));

		logAction(
			details.mode === "hide" ? "Hid note" : "Removed note",
			noteToRemove.title,
			details.reason
		);
	}

	const accountAge = formatRelativeTime(user.joinedAt, now);

	const tabs: ProfileTab[] = ["Notes", "Reports", "Activity", "Trending"];

	function renderNotes(list: Post[]) {
		if (list.length === 0) {
			return (
				<div className="rounded-md border border-gray-200 p-6 text-center text-sm text-gray-500">
					{user.name} hasn&apos;t posted any notes.
				</div>
			);
		}

		return list.map((post) => {
			const openReports = openReportsFor(post.id);
			const hidden = noteStates[post.id] === "Hidden";

			return (
				<article
					key={post.id}
					className="rounded-[10px] border border-gray-200 bg-white p-5"
				>
					<div className="flex items-start justify-between gap-3">
						<div className="flex min-w-0 items-center gap-3">
							<Image
								src="/assets/icons/profile.svg"
								alt=""
								width={36}
								height={36}
								className="h-9 w-9 shrink-0"
							/>
							<div className="min-w-0">
								<p className="truncate text-sm font-semibold text-[#303a36]">
									{user.name}
								</p>
								<p className="text-xs text-gray-500">
									{post.course}
									<span className="mx-2">·</span>
									{post.time}
								</p>
							</div>
						</div>

						<div className="flex shrink-0 items-center gap-2">
							{hidden && (
								<span className="rounded-full bg-gray-200 px-3 py-1 text-[10px] font-semibold text-gray-700">
									Hidden
								</span>
							)}
							{openReports.length > 0 && (
								<span className="rounded-full bg-red-100 px-3 py-1 text-[10px] font-semibold text-red-600">
									{openReports.length}{" "}
									{openReports.length === 1 ? "report" : "reports"}
								</span>
							)}
						</div>
					</div>

					<div className="mt-3 pl-12">
						<h3 className="text-sm font-semibold text-[#303a36]">{post.title}</h3>
						<p className="mt-1 line-clamp-3 whitespace-pre-wrap text-sm text-gray-600">
							{post.content}
						</p>

						<div className="mt-4 flex flex-wrap items-center gap-5 text-xs text-gray-600">
							<span className="flex items-center gap-2">
								<Image src="/assets/icons/heart.svg" alt="" width={18} height={18} />
								{post.likes}
							</span>
							<span className="flex items-center gap-2">
								<Image src="/assets/icons/comment.svg" alt="" width={18} height={18} />
								{post.comments}
							</span>
							<span>{post.images?.length ?? 0} attachments</span>
						</div>

						<div className="mt-4 flex flex-wrap items-center gap-2">
							<Link
								href={
									openReports.length > 0
										? `/admin/reports/${openReports[0].id}`
										: `/admin/notes/${post.id}`
								}
								className="rounded-full bg-[#00A651] px-5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#008F45]"
							>
								Review
							</Link>
							<button
								type="button"
								onClick={() => handleToggleHide(post)}
								className="rounded-full border border-[#00A651] px-5 py-1.5 text-xs font-semibold text-[#00A651] transition-colors hover:bg-green-50"
							>
								{hidden ? "Unhide" : "Hide"}
							</button>
							<button
								type="button"
								onClick={() => setNoteToRemove(post)}
								className="rounded-full border border-red-400 px-5 py-1.5 text-xs font-semibold text-red-500 transition-colors hover:bg-red-50"
							>
								Remove
							</button>
						</div>
					</div>
				</article>
			);
		});
	}

	return (
		<>
			<div className="w-full px-6 py-6">
				<div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_260px]">

					<div className="min-w-0">

						<div className="relative">
							<div className="h-[125px] w-full rounded-sm bg-gradient-to-b from-[#F6FCF9] to-[#CBEFDD]" />

							<div className="absolute -bottom-[48px] left-6 flex h-[96px] w-[96px] items-center justify-center rounded-full bg-[#C7EBDD]">
								<Image
									src="/assets/icons/profile.svg"
									alt={`${user.name}'s profile picture`}
									width={70}
									height={70}
								/>
							</div>
						</div>

						<div className="ml-[136px] mt-3 flex flex-wrap items-start justify-between gap-3">
							<div>
								<h1 className="text-base font-semibold text-[#303a36]">{user.name}</h1>
								<p className="text-xs text-gray-600">{user.email}</p>
								<p className="mt-1 text-xs text-gray-600">
									{user.college} {user.role}
								</p>
							</div>

							<div className="flex flex-wrap items-center gap-2">
								<button
									type="button"
									onClick={() => setDialog({ type: "edit", user })}
									className="rounded-full border border-[#00A651] px-4 py-1.5 text-xs font-semibold text-[#00A651] transition-colors hover:bg-green-50"
								>
									Edit User
								</button>
								<button
									type="button"
									onClick={() => setDialog({ type: "reset", user })}
									className="rounded-full border border-[#303a36] px-4 py-1.5 text-xs font-semibold text-[#303a36] transition-colors hover:bg-gray-50"
								>
									Reset Password
								</button>
								{user.status === "Suspended" ? (
									<button
										type="button"
										onClick={() => unsuspendUser(user)}
										className="rounded-full border border-[#00A651] px-4 py-1.5 text-xs font-semibold text-[#00A651] transition-colors hover:bg-green-50"
									>
										Unsuspend
									</button>
								) : (
									<button
										type="button"
										onClick={() => setDialog({ type: "suspend", user })}
										className="rounded-full border border-red-400 px-4 py-1.5 text-xs font-semibold text-red-500 transition-colors hover:bg-red-50"
									>
										Suspend
									</button>
								)}
								<button
									type="button"
									onClick={() => setDialog({ type: "delete", user })}
									className="rounded-full bg-red-600 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-red-700"
								>
									Delete
								</button>
							</div>
						</div>

						<div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-gray-500">
							<AdminStatusBadge status={user.status} />
							<span>
								Joined {formatMonthYear(user.joinedAt)} · {user.following} Following ·{" "}
								{user.followers} Followers
							</span>
						</div>

						{user.suspension && user.status === "Suspended" && (
							<p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-xs text-red-600">
								Suspended {user.suspension.duration === "Permanent" ? "permanently" : `for ${user.suspension.duration}`}
								{user.suspension.until &&
									` (until ${new Date(user.suspension.until).toLocaleDateString("en-US", {
										month: "short",
										day: "numeric",
										year: "numeric",
									})})`}
								: {user.suspension.reason}
							</p>
						)}

						<div
							role="tablist"
							aria-label="User profile sections"
							className="mt-6 grid grid-cols-4 overflow-hidden rounded-md border border-green-600"
						>
							{tabs.map((tab) => (
								<button
									key={tab}
									type="button"
									role="tab"
									aria-selected={activeTab === tab}
									onClick={() => setActiveTab(tab)}
									className={`py-2.5 text-sm font-semibold transition-colors ${
										activeTab === tab
											? "bg-green-600 text-white"
											: "bg-white text-green-600 hover:bg-green-50"
									}`}
								>
									{tab}
								</button>
							))}
						</div>

						<div role="tabpanel" className="mt-5 space-y-4">
							{activeTab === "Notes" && renderNotes(userPosts)}

							{activeTab === "Trending" && renderNotes(trendingPosts)}

							{activeTab === "Reports" &&
								(userReports.length === 0 ? (
									<div className="rounded-md border border-gray-200 p-6 text-center text-sm text-gray-500">
										No reports against {user.name}.
									</div>
								) : (
									userReports.map((report) => (
										<Link
											key={report.id}
											href={`/admin/reports/${report.id}`}
											className="flex items-center justify-between gap-3 rounded-[10px] border border-gray-200 p-4 transition-colors hover:bg-gray-50"
										>
											<div className="min-w-0">
												<p className="text-xs font-semibold text-[#303a36]">
													{report.reason} · {report.contentTitle}
												</p>
												<p className="mt-1 text-[11px] text-gray-400">
													{report.reporters.length}{" "}
													{report.reporters.length === 1 ? "reporter" : "reporters"} ·{" "}
													{formatRelativeTime(report.createdAt, now)} ago
												</p>
											</div>
											<AdminStatusBadge status={report.status} />
										</Link>
									))
								))}

							{activeTab === "Activity" &&
								(userActivity.length === 0 ? (
									<div className="rounded-md border border-gray-200 p-6 text-center text-sm text-gray-500">
										No admin activity for {user.name}.
									</div>
								) : (
									userActivity.map((entry) => (
										<div
											key={entry.id}
											className="rounded-[10px] border border-gray-200 p-4"
										>
											<p className="text-xs font-semibold text-[#303a36]">
												{entry.action} · {entry.target}
											</p>
											<p className="mt-1 text-[11px] text-gray-400">
												{entry.admin} · {formatRelativeTime(entry.createdAt, now)} ago
												{entry.reason && ` · ${entry.reason}`}
											</p>
										</div>
									))
								))}
						</div>
					</div>

					<aside className="w-full rounded-md border border-gray-200 bg-white p-5">
						<h2 className="text-sm font-semibold text-[#303a36]">Account</h2>
						<p className="mt-2 text-xs text-gray-500">
							{userPosts.length} Contributions · {user.savedNotes} Saved Notes ·{" "}
							{accountAge} account age
						</p>

						<hr className="my-4 border-gray-200" />

						<h2 className="text-sm font-semibold text-[#303a36]">Courses</h2>
						{user.courses.length > 0 ? (
							<ul className="mt-2 space-y-1 text-xs text-[#303a36]">
								{user.courses.map((course) => (
									<li key={course}>{course}</li>
								))}
							</ul>
						) : (
							<p className="mt-2 text-xs text-gray-400">No courses.</p>
						)}

						<hr className="my-4 border-gray-200" />

						<h2 className="text-sm font-semibold text-[#303a36]">Recent Activity</h2>
						{userPosts.length > 0 ? (
							<ul className="mt-2 space-y-1 text-xs text-gray-500">
								{userPosts.slice(0, 3).map((post) => (
									<li key={post.id}>Posted {post.title}</li>
								))}
							</ul>
						) : (
							<p className="mt-2 text-xs text-gray-400">No recent activity.</p>
						)}
					</aside>
				</div>
			</div>

			<AdminUserDialogs
				dialog={dialog}
				onClose={() => setDialog(null)}
				onDeleted={() => router.replace("/admin/users")}
			/>

			{noteToRemove && (
				<RemoveNoteModal
					isOpen={true}
					onClose={() => setNoteToRemove(null)}
					onConfirm={handleConfirmRemove}
					noteTitle={noteToRemove.title}
					authorName={user.name}
					likes={noteToRemove.likes}
					comments={noteToRemove.comments}
				/>
			)}
		</>
	);
}
