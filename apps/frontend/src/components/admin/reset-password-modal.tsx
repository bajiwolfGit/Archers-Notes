"use client";

import { useState } from "react";

import AdminModal, { cancelButtonClass, primaryButtonClass } from "./admin-modal";

import type { AdminUser } from "@/data/admin";

interface ResetPasswordModalProps {
	user: AdminUser;
	onClose: () => void;
	onConfirm: () => void;
}

export default function ResetPasswordModal({
	user,
	onClose,
	onConfirm,
}: ResetPasswordModalProps) {
	const [done, setDone] = useState(false);

	return (
		<AdminModal
			title={`Reset ${user.name}'s Password?`}
			onClose={onClose}
			success={
				done
					? {
						title: "Reset Link Sent",
						message: `A password reset link will be sent to ${user.email}.`,
					}
					: null
			}
			footer={
				<>
					<button type="button" onClick={onClose} className={cancelButtonClass}>
						Cancel
					</button>
					<button
						type="button"
						onClick={() => {
							onConfirm();
							setDone(true);
						}}
						className={primaryButtonClass}
					>
						Send Reset Link
					</button>
				</>
			}
		>
			<p className="text-sm text-gray-600">
				{user.name} will receive an email at{" "}
				<span className="font-semibold">{user.email}</span> with a link to set a
				new password. They will be signed out everywhere.
			</p>
		</AdminModal>
	);
}
