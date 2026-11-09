
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

interface AdminNoteActionsProps {
    noteId: number;
}

type ModerationStatus =
    | "Approved"
    | "Under Review"
    | "Hidden"
    | "Removed";

export default function AdminNoteActions({
    noteId,
}: AdminNoteActionsProps) {
    // Local moderation status for testing.
    const [status, setStatus] =
        useState<ModerationStatus>("Under Review");

    function handleApprove() {
        setStatus("Approved");
    }

    function handleHide() {
        setStatus((previous) =>
            previous === "Hidden" ? "Approved" : "Hidden"
        );
    }

    function handleNotifyAuthor() {
        window.alert(
            "Author notifications will be available once the backend is connected."
        );
    }

    function handleRemove() {
        const confirmed = window.confirm(
            "Are you sure you want to remove this note?"
        );

        if (!confirmed) return;

        setStatus("Removed");
    }

    return (
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
    );
}
