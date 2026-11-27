/**
 * File: components/admin/admin-quiz-preview.tsx
 *
 * Description:
 * Displays a quiz in the admin moderation workspace, including
 * its answer key.
 *
 * Features:
 * - Shows the quiz instructions and every question.
 * - Reuses QuizQuestion to highlight the correct answers.
 * - Quiz details panel with status, items, duration, and takers.
 * - Unpublish, republish, and remove actions.
 * - Records every action in the activity log.
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import DOMPurify from "isomorphic-dompurify";

import QuizQuestion from "@/components/quizzes/quiz-question";
import RemoveQuizModal from "./remove-quiz-modal";

import { useQuizzes } from "@/context/quizzes-context";
import { useAdmin } from "@/context/admin-context";

import { formatRelativeTime } from "@/data/admin";
import { isAutoGraded, type Quiz } from "@/data/quizzes";

/**
 * AdminQuizPreviewProps Interface
 *
 * @property quizId - The ID of the quiz to display.
 */
interface AdminQuizPreviewProps {
	quizId: number;
}

/**
 * AdminQuizPreview Component
 *
 * @returns The quiz preview, or a not found message.
 */
export default function AdminQuizPreview({ quizId }: AdminQuizPreviewProps) {
	const { getQuiz, loaded } = useQuizzes();
	const [removedTitle, setRemovedTitle] = useState<string | null>(null);

	if (!loaded) return null;

	const quiz = getQuiz(quizId);

	if (!quiz) {
		return (
			<div className="mx-auto w-full max-w-[480px] px-6 py-20 text-center">
				<h1 className="text-lg font-semibold text-[#303a36]">
					{removedTitle ? `${removedTitle} was removed` : "Quiz not found"}
				</h1>
				<p className="mt-2 text-sm text-gray-500">
					{removedTitle
						? "It no longer appears in Quizbits."
						: "This quiz may have been removed or does not exist."}
				</p>
				<Link
					href="/admin/quizzes"
					className="mt-6 inline-block rounded-full border border-[#00A651] px-6 py-2 text-sm text-[#00A651] hover:bg-green-50"
				>
					Back to Quizzes
				</Link>
			</div>
		);
	}

	return (
		<AdminQuizPreviewContent
			key={quiz.id}
			quiz={quiz}
			onRemoved={() => setRemovedTitle(quiz.title)}
		/>
	);
}

/**
 * AdminQuizPreviewContent Component
 *
 * @param quiz - The quiz to display.
 * @param onRemoved - Called after the quiz is removed.
 * @returns The quiz content and details panel.
 */
function AdminQuizPreviewContent({
	quiz,
	onRemoved,
}: {
	quiz: Quiz;
	onRemoved: () => void;
}) {
	const router = useRouter();
	const { updateQuiz, deleteQuiz } = useQuizzes();
	const { users, now, logAction } = useAdmin();

	const [showRemove, setShowRemove] = useState(false);

	const published = quiz.status === "published";
	const author = users.find((user) => user.id === quiz.authorId);

	/** Unpublishes or republishes the quiz. */
	function handleTogglePublished() {
		updateQuiz({ ...quiz, status: published ? "draft" : "published" });
		logAction(published ? "Unpublished quiz" : "Republished quiz", quiz.title);
	}

	/** Removes the quiz. */
	function handleRemove(reason: string) {
		logAction("Removed quiz", quiz.title, reason);
	}

	/** Deletes the quiz once the removal dialog is closed. */
	function handleCloseRemove(removed: boolean) {
		setShowRemove(false);

		if (removed) {
			onRemoved();
			deleteQuiz(quiz.id);
		}
	}

	const detailsPanel = (
		<aside className="w-full rounded-md border border-gray-200 bg-white p-5">
			<div className="flex items-center justify-between gap-2">
				<h2 className="text-sm font-semibold text-[#303a36]">Quiz Details</h2>
				<span
					className={`rounded-full px-3 py-1 text-[10px] font-semibold ${
						published ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"
					}`}
				>
					{published ? "Published" : "Draft"}
				</span>
			</div>

			<dl className="mt-4 grid grid-cols-2 gap-y-3 text-xs">
				<dt className="text-gray-400">Items</dt>
				<dd className="text-right text-[#303a36]">{quiz.questions.length}</dd>

				<dt className="text-gray-400">Auto-graded</dt>
				<dd className="text-right text-[#303a36]">
					{quiz.questions.filter(isAutoGraded).length}
				</dd>

				<dt className="text-gray-400">Duration</dt>
				<dd className="text-right text-[#303a36]">{quiz.duration} mins</dd>

				<dt className="text-gray-400">Takers</dt>
				<dd className="text-right text-[#303a36]">{quiz.takers}</dd>

				<dt className="text-gray-400">Created</dt>
				<dd className="text-right text-[#303a36]">
					{formatRelativeTime(quiz.createdAt, now)} ago
				</dd>
			</dl>

			<hr className="my-4 border-gray-200" />

			{/* Moderation Actions */}
			<div className="flex flex-col gap-2">
				<button
					type="button"
					onClick={handleTogglePublished}
					className={`w-full rounded-md px-4 py-2.5 text-xs font-semibold transition-colors ${
						published
							? "border border-gray-200 bg-white text-[#303a36] hover:bg-gray-50"
							: "bg-[#00A651] text-white hover:bg-[#008F45]"
					}`}
				>
					{published ? "Unpublish Quiz" : "Republish Quiz"}
				</button>

				<button
					type="button"
					onClick={() => setShowRemove(true)}
					className="w-full rounded-md border border-red-400 bg-white px-4 py-2.5 text-xs font-semibold text-red-500 transition-colors hover:bg-red-50"
				>
					Remove Quiz
				</button>
			</div>

			{/* Links */}
			<div className="mt-4 space-y-2 text-xs">
				{author && (
					<Link
						href={`/admin/users/${author.id}`}
						className="block font-semibold text-[#00A651] hover:underline"
					>
						View {author.name}&apos;s profile
					</Link>
				)}
				{published && (
					<Link
						href={`/quizbits/${quiz.id}`}
						className="block font-semibold text-[#00A651] hover:underline"
					>
						View on Quizbits
					</Link>
				)}
			</div>
		</aside>
	);

	return (
		<>
			<div className="relative w-full px-6 py-7">

				{/*
				 * Quiz Details Panel:
				 * Rendered once. Fixed on the right on large screens
				 * (matching the note moderation panel), above the quiz otherwise.
				 */}
				<div className="mb-5 w-full xl:fixed xl:right-6 xl:top-22 xl:z-10 xl:mb-0 xl:w-56.25">
					{detailsPanel}
				</div>

				{/* Quiz Content */}
				<div className="relative left-1/2 w-full max-w-[575px] -translate-x-[calc(50%+111px)]">
					<article className="rounded-sm border border-gray-200 bg-white px-6 pb-6 pt-8">

						{/* Header */}
						<div className="flex items-center gap-5">
							<button
								type="button"
								onClick={() => router.push("/admin/quizzes")}
								aria-label="Back to quizzes"
								className="flex h-8 w-8 shrink-0 items-center justify-center hover:opacity-60"
							>
								<Image src="/assets/icons/back.svg" alt="" width={18} height={18} />
							</button>

							<h1 className="min-w-0 flex-1 text-xl font-semibold text-[#303a36]">
								{quiz.title}
							</h1>

							<span
								className="h-4 w-4 shrink-0 rounded-sm"
								style={{ backgroundColor: quiz.color }}
								aria-hidden="true"
							/>
						</div>

						<p className="ml-[52px] mt-1 text-xs text-gray-500">
							{quiz.course || "No course"} · by {quiz.author}
						</p>

						<p className="ml-[52px] mt-3 rounded-md bg-green-50 px-3 py-2 text-[11px] text-green-700">
							Admin view: correct answers are highlighted.
						</p>

						{/* Instructions */}
						{quiz.instructions && (
							<div
								className="ml-[52px] mt-6 border-b border-gray-200 pb-8 text-xs leading-relaxed text-[#303a36] [&_em]:italic [&_li]:mb-1 [&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-3 [&_strong]:font-bold [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_img]:max-h-[250px] [&_img]:rounded"
								dangerouslySetInnerHTML={{
									__html: DOMPurify.sanitize(quiz.instructions),
								}}
							/>
						)}

						{/* Questions with Answer Key */}
						<div className="ml-[52px]">
							{quiz.questions.length === 0 ? (
								<p className="py-8 text-center text-xs text-gray-500">
									This quiz has no items yet.
								</p>
							) : (
								quiz.questions.map((question, index) => (
									<QuizQuestion
										key={question.id}
										question={question}
										number={index + 1}
										mode="review"
										answer={isAutoGraded(question) ? question.correct : undefined}
									/>
								))
							)}
						</div>
					</article>
				</div>
			</div>

			{/* Remove Quiz Modal */}
			{showRemove && (
				<RemoveQuizModalWithClose
					quiz={quiz}
					onRemove={handleRemove}
					onClose={handleCloseRemove}
				/>
			)}
		</>
	);
}

/**
 * RemoveQuizModalWithClose Component
 *
 * Tracks whether the quiz was removed so the quiz is only deleted
 * after the confirmation is dismissed (keeping the success message visible).
 */
function RemoveQuizModalWithClose({
	quiz,
	onRemove,
	onClose,
}: {
	quiz: Quiz;
	onRemove: (reason: string) => void;
	onClose: (removed: boolean) => void;
}) {
	const [removed, setRemoved] = useState(false);

	return (
		<RemoveQuizModal
			quiz={quiz}
			onClose={() => onClose(removed)}
			onConfirm={(reason) => {
				setRemoved(true);
				onRemove(reason);
			}}
		/>
	);
}
