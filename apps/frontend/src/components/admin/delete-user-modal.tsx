"use client";

import { useState } from "react";

import AdminModal, {
	cancelButtonClass,
	dangerButtonClass,
	fieldClass,
} from "./admin-modal";
import AdminToggleChip from "./admin-toggle-chip";

import type { AdminUser } from "@/data/admin";

export interface DeletionDetails {
	keepNotesAnonymous: boolean;
	reason: string;
}

interface DeleteUserModalProps {
	user: AdminUser;
	noteCount: number;
	onClose: () => void;
	onConfirm: (details: DeletionDetails) => void;
}

export default function DeleteUserModal({
	user,
	noteCount,
	onClose,
	onConfirm,
}: DeleteUserModalProps) {
	const [keepNotesAnonymous, setKeepNotesAnonymous] = useState(true);
	const [reason, setReason] = useState("");
	const [confirmation, setConfirmation] = useState("");
	const [attempted, setAttempted] = useState(false);

	const emailMatches =
		confirmation.trim().toLowerCase() === user.email.toLowerCase();

	function handleDelete() {
		setAttempted(true);

		if (!reason.trim() || !emailMatches) return;

		onConfirm({ keepNotesAnonymous, reason: reason.trim() });
	}

	return (
		<AdminModal
			title={`Delete ${user.name}'s Account?`}
			subtitle="This removes the account and signs them out everywhere."
			maxWidth="max-w-[600px]"
			onClose={onClose}
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
					<button type="button" onClick={handleDelete} className={dangerButtonClass}>
						Delete user
					</button>
				</>
			}
		>
			<div className="rounded-md border border-gray-300 px-3 py-2.5">
				<p className="text-sm font-semibold text-[#303a36]">{user.name}</p>

				<div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-400">
					<span>
						{user.college} {user.role}
					</span>
					<span>
						{noteCount} {noteCount === 1 ? "note" : "notes"}
					</span>
					<span>{user.comments} comments</span>
				</div>
			</div>

			<div className="flex flex-wrap gap-2" role="group" aria-label="What to do with their notes">
				<AdminToggleChip
					selected={keepNotesAnonymous}
					onClick={() => setKeepNotesAnonymous(true)}
				>
					Keep notes as anonymous
				</AdminToggleChip>
				<AdminToggleChip
					selected={!keepNotesAnonymous}
					variant="danger"
					onClick={() => setKeepNotesAnonymous(false)}
				>
					Delete their notes
				</AdminToggleChip>
			</div>

			<div>
				<div className={fieldClass(attempted && !reason.trim())}>
					<label htmlFor="delete-user-reason" className="block text-xs text-gray-500">
						Reason (logged)
					</label>
					<input
						id="delete-user-reason"
						type="text"
						value={reason}
						onChange={(event) => setReason(event.target.value)}
						placeholder="e.g. Repeated violations"
						maxLength={300}
						className="w-full bg-transparent text-sm font-medium text-[#303a36] outline-none"
					/>
				</div>

				{attempted && !reason.trim() && (
					<p className="mt-1 text-xs text-red-500">
						Please provide a reason for deleting this account.
					</p>
				)}
			</div>

			<div>
				<div className={fieldClass(attempted && !emailMatches)}>
					<label htmlFor="delete-user-confirm" className="block text-xs text-gray-500">
						Type email to confirm
					</label>
					<input
						id="delete-user-confirm"
						type="email"
						value={confirmation}
						onChange={(event) => setConfirmation(event.target.value)}
						placeholder={user.email}
						autoComplete="off"
						className="w-full bg-transparent text-sm font-medium text-[#303a36] outline-none placeholder:text-gray-300"
					/>
				</div>

				{attempted && !emailMatches && (
					<p className="mt-1 text-xs text-red-500">
						Type {user.email} exactly to confirm.
					</p>
				)}
			</div>

			<p className="text-xs text-gray-400">
				Suspending keeps the account and is reversible. Deleting is not.
			</p>
		</AdminModal>
	);
}
