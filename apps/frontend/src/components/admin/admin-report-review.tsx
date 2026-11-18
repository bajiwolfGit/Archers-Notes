"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import PostDetails from "@/components/posts/post-details";
import NotifyAuthorModal from "./notify-author-modal";
import RemoveNoteModal, { type RemovalDetails } from "./remove-note-modal";
import AdminStatusBadge from "./admin-status-badge";
import AdminToggleChip from "./admin-toggle-chip";

import { useAdmin } from "@/context/admin-context";
import { usePosts } from "@/context/posts-context";

import {
	CURRENT_ADMIN,
	formatRelativeTime,
	formatReporters,
	type AdminReport,
} from "@/data/admin";

interface AdminReportReviewProps {
	reportId: number;
}

export default function AdminReportReview({ reportId }: AdminReportReviewProps) {
	const { reports, loaded } = useAdmin();

	if (!loaded) return null;

	const report = reports.find((item) => item.id === reportId);

	if (!report) {
		return (
			<div className="mx-auto w-full max-w-[480px] px-6 py-20 text-center">
				<h1 className="text-lg font-semibold text-[#303a36]">Report not found</h1>
				<p className="mt-2 text-sm text-gray-500">
					This report may have been removed or does not exist.
				</p>
				<Link
					href="/admin/reports"
					className="mt-6 inline-block rounded-full border border-[#00A651] px-6 py-2 text-sm text-[#00A651] hover:bg-green-50"
				>
					Back to Reports
				</Link>
			</div>
		);
	}

	return <AdminReportReviewContent key={report.id} report={report} />;
}

function AdminReportReviewContent({ report }: { report: AdminReport }) {
	const router = useRouter();
	const { users, now, updateReports, logAction } = useAdmin();
	const { posts } = usePosts();

	const [resolutionNote, setResolutionNote] = useState(report.resolutionNote);
	const [notifyReporter, setNotifyReporter] = useState(true);
	const [notifyAuthor, setNotifyAuthor] = useState(false);
	const [showRequestEdit, setShowRequestEdit] = useState(false);
	const [showRemove, setShowRemove] = useState(false);

	const post = posts.find((item) => item.id === report.postId);
	const author = users.find((user) => user.id === report.authorId);
	const isClosed = report.status === "Resolved" || report.status === "Dismissed";
	const isComment = report.targetType === "Comment";

	function notifyExtras() {
		return [
			notifyReporter ? "reporter notified" : "",
			notifyAuthor ? "author notified" : "",
		]
			.filter(Boolean)
			.join(", ");
	}

	function logReason(base: string) {
		const extras = notifyExtras();
		const note = resolutionNote.trim() || base;

		return extras ? `${note} (${extras})` : note;
	}

	function handleDismiss() {
		updateReports([report.id], {
			status: "Dismissed",
			moderator: CURRENT_ADMIN,
			resolutionNote: resolutionNote.trim(),
		});

		logAction("Dismissed report", report.contentTitle, logReason(report.reason));
	}

	function handleRequestEdit(notification: { message: string }) {
		updateReports([report.id], {
			status: "In Review",
			moderator: CURRENT_ADMIN,
			resolutionNote: resolutionNote.trim(),
		});

		logAction("Requested edit", report.contentTitle, notification.message);
	}

	function handleRemove(details: RemovalDetails) {
		const action =
			details.mode === "hide"
				? isComment
					? "Hid comment"
					: "Hid note"
				: isComment
					? "Removed comment"
					: "Removed note";

		updateReports([report.id], {
			status: "Resolved",
			moderator: CURRENT_ADMIN,
			resolutionNote: resolutionNote.trim() || details.reason,
		});

		logAction(action, report.contentTitle, details.reason);
	}

	const adminActions = (
		<div className="flex flex-wrap items-center justify-between gap-2">
			<p className="text-xs font-semibold text-[#303a36]">Admin actions</p>

			<div className="flex flex-wrap items-center gap-2">
				<button
					type="button"
					onClick={handleDismiss}
					disabled={isClosed}
					className="rounded-full bg-[#00A651] px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#008F45] disabled:cursor-not-allowed disabled:opacity-40"
				>
					Dismiss Report
				</button>
				<button
					type="button"
					onClick={() => setShowRequestEdit(true)}
					disabled={isClosed}
					className="rounded-full border border-[#00A651] px-4 py-1.5 text-xs font-semibold text-[#00A651] transition-colors hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-40"
				>
					Request Edit
				</button>
				<button
					type="button"
					onClick={() => setShowRemove(true)}
					disabled={isClosed}
					className="rounded-full bg-red-500 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-40"
				>
					{isComment ? "Remove Comment" : "Remove Note"}
				</button>
			</div>
		</div>
	);

	const detailsPanel = (
		<aside className="w-full rounded-md border border-gray-200 bg-white p-5">
			<div className="flex items-center justify-between gap-2">
				<h2 className="text-sm font-semibold text-[#303a36]">Report Details</h2>
				<AdminStatusBadge status={report.status} />
			</div>

			<div className="mt-4 rounded-md border border-gray-200 p-3">
				<p className="text-xs font-semibold text-[#303a36]">Reason: {report.reason}</p>
				<p className="mt-1 text-[11px] text-gray-400">
					Reported by {formatReporters(report.reporters)} ·{" "}
					{formatRelativeTime(report.createdAt, now)} ago
				</p>
				{report.details && (
					<p className="mt-2 text-xs text-gray-600">&ldquo;{report.details}&rdquo;</p>
				)}
			</div>

			<p className="mt-3 text-[11px] text-gray-500">
				Moderator: {report.moderator ?? "Unassigned"}
			</p>

			<div className="mt-4">
				<label
					htmlFor="resolution-note"
					className="mb-2 block text-xs font-semibold text-[#303a36]"
				>
					Resolution note
				</label>
				<textarea
					id="resolution-note"
					value={resolutionNote}
					onChange={(event) => setResolutionNote(event.target.value)}
					disabled={isClosed}
					placeholder="Explain how this report was handled..."
					rows={4}
					maxLength={500}
					className="w-full resize-none rounded-md border border-gray-200 p-3 text-xs outline-none focus:border-[#00A651] disabled:bg-gray-50"
				/>
			</div>

			{!isClosed && (
				<div className="mt-2 flex flex-wrap gap-2">
					<AdminToggleChip
						selected={notifyReporter}
						onClick={() => setNotifyReporter(!notifyReporter)}
					>
						Notify reporter
					</AdminToggleChip>
					<AdminToggleChip
						selected={notifyAuthor}
						onClick={() => setNotifyAuthor(!notifyAuthor)}
					>
						Notify author
					</AdminToggleChip>
				</div>
			)}

			{isClosed && (
				<p className="mt-3 rounded-md bg-gray-50 px-3 py-2 text-xs text-gray-500">
					This report is {report.status.toLowerCase()}.
				</p>
			)}

			{author && (
				<>
					<hr className="my-4 border-gray-200" />
					<Link
						href={`/admin/users/${author.id}`}
						className="text-xs font-semibold text-[#00A651] hover:underline"
					>
						View {author.name}&apos;s profile
					</Link>
				</>
			)}
		</aside>
	);

	return (
		<>
			<div className="relative w-full px-6 py-7">

				<div className="mb-5 w-full xl:fixed xl:right-6 xl:top-22 xl:z-10 xl:mb-0 xl:w-56.25">
					{detailsPanel}
				</div>

				<div className="relative left-1/2 w-full max-w-120 -translate-x-[calc(50%+111px)]">

					{!post && (
						<button
							type="button"
							onClick={() => router.push("/admin/reports")}
							aria-label="Back to reports"
							className="mb-4 flex h-8 w-8 items-center justify-center hover:opacity-60"
						>
							<Image src="/assets/icons/back.svg" alt="" width={16} height={16} />
						</button>
					)}

					{isComment && report.commentText && (
						<div className="mb-5 ml-12 rounded-md border border-red-200 bg-red-50 p-3">
							<p className="text-[10px] font-semibold uppercase tracking-wide text-red-500">
								Reported comment by {author?.name ?? "Deleted user"}
							</p>
							<p className="mt-1 text-xs text-[#303a36]">{report.commentText}</p>
						</div>
					)}

					{post ? (
						<PostDetails post={post} mode="admin" adminActions={adminActions} />
					) : (
						<div className="space-y-4">
							<div className="rounded-md border border-gray-200 p-6 text-center text-sm text-gray-500">
								The reported note is no longer available.
							</div>
							<div className="rounded-sm border border-gray-200 bg-[#F7FAF8] px-3 py-2">
								{adminActions}
							</div>
						</div>
					)}
				</div>
			</div>

			<NotifyAuthorModal
				isOpen={showRequestEdit}
				onClose={() => setShowRequestEdit(false)}
				noteId={report.postId}
				noteTitle={report.contentTitle}
				authorName={author?.name ?? "the author"}
				onSend={handleRequestEdit}
			/>

			<RemoveNoteModal
				isOpen={showRemove}
				onClose={() => setShowRemove(false)}
				onConfirm={handleRemove}
				noteTitle={report.contentTitle}
				authorName={author?.name}
				likes={isComment ? 0 : post?.likes ?? 0}
				comments={isComment ? 0 : post?.comments ?? 0}
			/>
		</>
	);
}
