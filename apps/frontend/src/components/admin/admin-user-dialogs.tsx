"use client";

import UserFormModal, { type UserFormValues } from "./user-form-modal";
import SuspendUserModal, { type SuspensionDetails } from "./suspend-user-modal";
import DeleteUserModal, { type DeletionDetails } from "./delete-user-modal";
import ResetPasswordModal from "./reset-password-modal";

import { useAdmin } from "@/context/admin-context";
import { usePosts } from "@/context/posts-context";

import type { AdminUser, SuspensionDuration } from "@/data/admin";

export type AdminUserDialog =
	| { type: "add" }
	| { type: "edit"; user: AdminUser }
	| { type: "suspend"; user: AdminUser }
	| { type: "reset"; user: AdminUser }
	| { type: "delete"; user: AdminUser };

interface AdminUserDialogsProps {
	dialog: AdminUserDialog | null;
	onClose: () => void;
	onDeleted?: () => void;
}

const durationMs: Record<SuspensionDuration, number | null> = {
	"24 hours": 24 * 60 * 60 * 1000,
	"7 days": 7 * 24 * 60 * 60 * 1000,
	"30 days": 30 * 24 * 60 * 60 * 1000,
	Permanent: null,
};

export default function AdminUserDialogs({
	dialog,
	onClose,
	onDeleted,
}: AdminUserDialogsProps) {
	const { users, addUser, updateUser, deleteUser, logAction } = useAdmin();
	const { posts } = usePosts();

	if (!dialog) return null;

	const existingEmails = users.map((user) => user.email);

	function handleAdd(values: UserFormValues) {
		const created = addUser({
			name: values.name,
			email: values.email,
			college: values.college,
			role: values.role,
			courses: values.courses,
			status: "Active",
			joinedAt: new Date().toISOString(),
			following: 0,
			followers: 0,
			savedNotes: 0,
			comments: 0,
		});

		const extras = [
			values.sendInvite ? "invite email sent" : "",
			values.requirePasswordReset ? "password reset required" : "",
		]
			.filter(Boolean)
			.join(", ");

		logAction("Added user", created.name, extras);
	}

	function handleEdit(user: AdminUser, values: UserFormValues) {
		updateUser(user.id, {
			name: values.name,
			email: values.email,
			college: values.college,
			role: values.role,
			courses: values.courses,
		});

		logAction("Edited user", values.name);
	}

	function handleSuspend(user: AdminUser, details: SuspensionDetails) {
		const length = durationMs[details.duration];

		updateUser(user.id, {
			status: "Suspended",
			suspension: {
				duration: details.duration,
				reason: details.reason,
				until: length === null ? null : new Date(Date.now() + length).toISOString(),
			},
		});

		const extras = [
			details.hideNotes ? "notes hidden" : "",
			details.notifyByEmail ? "notified by email" : "",
		]
			.filter(Boolean)
			.join(", ");

		logAction(
			`Suspended user (${details.duration})`,
			user.name,
			extras ? `${details.reason} (${extras})` : details.reason
		);
	}

	function handleDelete(user: AdminUser, details: DeletionDetails) {
		deleteUser(user.id);

		logAction(
			"Deleted user",
			user.name,
			`${details.reason} (${
				details.keepNotesAnonymous ? "notes kept as anonymous" : "notes deleted"
			})`
		);

		onClose();
		onDeleted?.();
	}

	switch (dialog.type) {
		case "add":
			return (
				<UserFormModal
					existingEmails={existingEmails}
					onClose={onClose}
					onSubmit={handleAdd}
				/>
			);

		case "edit":
			return (
				<UserFormModal
					user={dialog.user}
					existingEmails={existingEmails}
					onClose={onClose}
					onSubmit={(values) => handleEdit(dialog.user, values)}
				/>
			);

		case "suspend":
			return (
				<SuspendUserModal
					userName={dialog.user.name}
					onClose={onClose}
					onConfirm={(details) => handleSuspend(dialog.user, details)}
				/>
			);

		case "reset":
			return (
				<ResetPasswordModal
					user={dialog.user}
					onClose={onClose}
					onConfirm={() => logAction("Reset password", dialog.user.name)}
				/>
			);

		case "delete":
			return (
				<DeleteUserModal
					user={dialog.user}
					noteCount={
						posts.filter((post) => post.authorId === dialog.user.id).length
					}
					onClose={onClose}
					onConfirm={(details) => handleDelete(dialog.user, details)}
				/>
			);
	}
}

export function useUnsuspendUser() {
	const { updateUser, logAction } = useAdmin();

	return (user: AdminUser) => {
		updateUser(user.id, { status: "Active", suspension: undefined });
		logAction("Unsuspended user", user.name);
	};
}
