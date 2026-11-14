
/**
 * File: components/admin/admin-note-actions.tsx
 *
 * Description:
 * Displays administrative moderation actions for user-created notes.
 *
 * Features:
 * - Approves notes.
 * - Hides and unhides notes.
 * - Provides a placeholder for notifying authors.
 * - Removes notes after confirmation.
 * - Displays moderation actions vertically in the admin panel.
 */

"use client";

import { useState } from "react";

import NotifyAuthorModal from "@/components/admin/notify-author-modal";
import RemoveNoteModal from "@/components/admin/remove-note-modal";

interface AdminNoteActionsProps {
    noteId: number;
    noteTitle: string;
    authorName: string;
}

type ModerationStatus =
    | "Approved"
    | "Under Review"
    | "Hidden"
    | "Removed";

export default function AdminNoteActions({
    noteId,
    noteTitle,
    authorName,
}: AdminNoteActionsProps) {
    // Local moderation status for testing.
    const [status, setStatus] =
        useState<ModerationStatus>("Under Review");
    
    // Controls the Notify Author modal.
    const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);

    // Controls the Remove Note confirmation modal.
    const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);

    // Stores notifications locally for frontend testing.
    const [notifications, setNotifications] = useState<
        {
            noteId: number;
            type: "warning" | "removed" | "guidelines" | "custom";
            message: string;
        }[]
    >([]);

    function handleApprove() {
        setStatus("Approved");
    }

    function handleHide() {
        setStatus((previous) =>
            previous === "Hidden" ? "Approved" : "Hidden"
        );
    }

    function handleNotifyAuthor() {
        setIsNotifyModalOpen(true);
    }

    function handleSendNotification(notification: {
        noteId: number;
        type: "warning" | "removed" | "guidelines" | "custom";
        message: string;
    }) {
        setNotifications((previous) => [
            ...previous,
            notification,
        ]);

        console.log("Notification saved:", notification);
    }

    function handleRemove() {
        setIsRemoveModalOpen(true);
    }

    function handleConfirmRemove() {
        setStatus("Removed");
    }

    return (
        <>
            <div className="flex w-full flex-col gap-2">

                {/* Approve Note */}
                <button
                    type="button"
                    onClick={handleApprove}
                    disabled={
                        status === "Approved" ||
                        status === "Removed"
                    }
                    className="flex w-full items-center justify-center rounded-md bg-[#00A651] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#008F45] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {status === "Approved" ? "Approved" : "Approve Note"}
                </button>

                {/* Hide / Unhide Note */}
                <button
                    type="button"
                    onClick={handleHide}
                    disabled={status === "Removed"}
                    className="flex w-full items-center justify-center rounded-md border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-[#303a36] transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {status === "Hidden" ? "Unhide Note" : "Hide Note"}
                </button>

                {/* Notify Author */}
                <button
                    type="button"
                    onClick={handleNotifyAuthor}
                    disabled={status === "Removed"}
                    className="flex w-full items-center justify-center rounded-md border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-[#303a36] transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Notify Author
                </button>

                {/* Remove Note */}
                <button
                    type="button"
                    onClick={handleRemove}
                    disabled={status === "Removed"}
                    className="flex w-full items-center justify-center rounded-md border border-red-400 bg-white px-4 py-2.5 text-xs font-semibold text-red-500 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {status === "Removed" ? "Removed" : "Remove Note"}
                </button>

            </div>

            <NotifyAuthorModal
                isOpen={isNotifyModalOpen}
                onClose={() => setIsNotifyModalOpen(false)}
                noteId={noteId}
                noteTitle={noteTitle}
                authorName={authorName}
                onSend={handleSendNotification}
            />

            <RemoveNoteModal
                isOpen={isRemoveModalOpen}
                onClose={() => setIsRemoveModalOpen(false)}
                onConfirm={handleConfirmRemove}
                noteTitle={noteTitle}
            />
        </>
    );
}
