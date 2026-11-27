/**
 * File: components/admin/remove-quiz-modal.tsx
 *
 * Description:
 * Confirms permanently removing a quiz from Quizbits.
 *
 * Features:
 * - Shows a summary of the quiz being removed.
 * - Requires a reason, which is recorded in the activity log.
 * - Suggests unpublishing instead when the quiz can be fixed.
 * - Shows a confirmation after removing.
 */

"use client";

import { useState } from "react";

import AdminModal, {
	cancelButtonClass,
	dangerButtonClass,
	fieldClass,
} from "./admin-modal";

import type { Quiz } from "@/data/quizzes";

/**
 * RemoveQuizModalProps Interface
 *
 * @property quiz - The quiz being removed.
 * @property onClose - Called when the modal is closed.
 * @property onConfirm - Called with the removal reason.
 */
interface RemoveQuizModalProps {
	quiz: Quiz;
	onClose: () => void;
	onConfirm: (reason: string) => void;
}

/**
 * RemoveQuizModal Component
 *
 * @returns The remove quiz dialog.
 */
export default function RemoveQuizModal({
	quiz,
	onClose,
	onConfirm,
}: RemoveQuizModalProps) {
	const [reason, setReason] = useState("");
	const [attempted, setAttempted] = useState(false);
	const [done, setDone] = useState(false);

	/** Validates the reason and removes the quiz. */
	function handleRemove() {
		setAttempted(true);

		if (!reason.trim()) return;

		onConfirm(reason.trim());
		setDone(true);
	}

	return (
		<AdminModal
			title={`Remove ${quiz.title}`}
			onClose={onClose}
			success={
				done
					? {
						title: "Quiz Removed",
						message: `${quiz.title} has been removed from Quizbits.`,
					}
					: null
			}
			icon={
				<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100">
					<svg
						viewBox="0 0 24 24"
						fill="none"
						stroke="#DC2626"
						strokeWidth="1.8"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="h-4 w-4"
						aria-hidden="true"
					>
						<path d="M5 21V4m0 1c5-4 9 4 14 0v11c-5 4-9-4-14 0" />
					</svg>
				</div>
			}
			footer={
				<>
					<button type="button" onClick={onClose} className={cancelButtonClass}>
						Cancel
					</button>
					<button type="button" onClick={handleRemove} className={dangerButtonClass}>
						Remove Quiz
					</button>
				</>
			}
		>
			{/* Quiz Summary */}
			<div className="rounded-md border border-gray-300 px-3 py-2.5">
				<p className="text-sm font-semibold text-[#303a36]">{quiz.title}</p>

				<div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-400">
					<span>by {quiz.author}</span>
					<span>{quiz.course}</span>
					<span>
						{quiz.questions.length} {quiz.questions.length === 1 ? "item" : "items"}
					</span>
					<span>{quiz.takers} takers</span>
				</div>
			</div>

			{/* Reason */}
			<div>
				<div className={fieldClass(attempted && !reason.trim())}>
					<label htmlFor="remove-quiz-reason" className="block text-xs text-gray-500">
						Reason (logged)
					</label>
					<input
						id="remove-quiz-reason"
						type="text"
						value={reason}
						onChange={(event) => setReason(event.target.value)}
						placeholder="Enter reason for removal"
						maxLength={300}
						className="w-full bg-transparent text-sm font-medium text-[#303a36] outline-none"
					/>
				</div>

				{attempted && !reason.trim() && (
					<p className="mt-1 text-xs text-red-500">Please provide a removal reason.</p>
				)}
			</div>

			<p className="text-xs text-gray-400">
				Removing deletes the quiz and its attempts. To let the author fix it
				instead, unpublish it.
			</p>
		</AdminModal>
	);
}
