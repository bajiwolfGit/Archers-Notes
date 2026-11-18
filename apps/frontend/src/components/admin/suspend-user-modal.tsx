"use client";

import { useState } from "react";

import AdminModal, {
	cancelButtonClass,
	dangerButtonClass,
	fieldClass,
} from "./admin-modal";
import AdminToggleChip from "./admin-toggle-chip";

import type { SuspensionDuration } from "@/data/admin";

const durations: SuspensionDuration[] = ["24 hours", "7 days", "30 days", "Permanent"];

export interface SuspensionDetails {
	duration: SuspensionDuration;
	reason: string;
	hideNotes: boolean;
	notifyByEmail: boolean;
}

interface SuspendUserModalProps {
	userName: string;
	onClose: () => void;
	onConfirm: (details: SuspensionDetails) => void;
}

export default function SuspendUserModal({
	userName,
	onClose,
	onConfirm,
}: SuspendUserModalProps) {
	const [duration, setDuration] = useState<SuspensionDuration>("7 days");
	const [reason, setReason] = useState("");
	const [hideNotes, setHideNotes] = useState(false);
	const [notifyByEmail, setNotifyByEmail] = useState(true);
	const [attempted, setAttempted] = useState(false);
	const [done, setDone] = useState(false);

	function handleSuspend() {
		setAttempted(true);

		if (!reason.trim()) return;

		onConfirm({ duration, reason: reason.trim(), hideNotes, notifyByEmail });
		setDone(true);
	}

	return (
		<AdminModal
			title={`Suspend ${userName}`}
			onClose={onClose}
			success={
				done
					? {
						title: "User Suspended",
						message:
							duration === "Permanent"
								? `${userName} has been suspended permanently.`
								: `${userName} has been suspended for ${duration}.`,
					}
					: null
			}
			footer={
				<>
					<button type="button" onClick={onClose} className={cancelButtonClass}>
						Cancel
					</button>
					<button type="button" onClick={handleSuspend} className={dangerButtonClass}>
						Suspend User
					</button>
				</>
			}
		>
			<div className="flex flex-wrap gap-2" role="group" aria-label="Suspension length">
				{durations.map((option) => (
					<AdminToggleChip
						key={option}
						selected={duration === option}
						onClick={() => setDuration(option)}
					>
						{option}
					</AdminToggleChip>
				))}
			</div>

			<div>
				<div className={fieldClass(attempted && !reason.trim())}>
					<label htmlFor="suspend-reason" className="block text-xs text-gray-500">
						Reason
					</label>
					<input
						id="suspend-reason"
						type="text"
						value={reason}
						onChange={(event) => setReason(event.target.value)}
						placeholder="e.g. Repeated policy violations"
						maxLength={300}
						className="w-full bg-transparent text-sm font-medium text-[#303a36] outline-none"
					/>
				</div>

				{attempted && !reason.trim() && (
					<p className="mt-1 text-xs text-red-500">
						Please provide a reason for the suspension.
					</p>
				)}
			</div>

			<div className="flex flex-wrap gap-2">
				<AdminToggleChip selected={hideNotes} onClick={() => setHideNotes(!hideNotes)}>
					Hide existing notes
				</AdminToggleChip>
				<AdminToggleChip
					selected={notifyByEmail}
					onClick={() => setNotifyByEmail(!notifyByEmail)}
				>
					Notify by email
				</AdminToggleChip>
			</div>
		</AdminModal>
	);
}
