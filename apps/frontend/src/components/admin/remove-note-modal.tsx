
/**
 * File: components/admin/remove-note-modal.tsx
 *
 * Description:
 * Displays moderation options for hiding or permanently
 * deleting a user-created note.
 *
 * Features:
 * - Hide or permanently delete notes.
 * - Displays note information.
 * - Requires a moderation reason.
 * - Supports notifying the author.
 * - Supports closing linked reports.
 * - Requires DELETE confirmation for permanent removal.
 * - Uses React Portal for full-screen coverage.
 */

"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

export type RemovalMode = "hide" | "delete";

export interface RemovalDetails {
    mode: RemovalMode;
    reason: string;
    notifyAuthor: boolean;
    closeReports: boolean;
}

interface RemoveNoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (details: RemovalDetails) => void;
    noteTitle: string;
    authorName?: string;
    likes?: number;
    comments?: number;
}

export default function RemoveNoteModal({
    isOpen,
    onClose,
    onConfirm,
    noteTitle,
    authorName,
    likes = 0,
    comments = 0,
}: RemoveNoteModalProps) {
    const [mounted, setMounted] = useState(false);
    const [removed, setRemoved] = useState(false);

    const [removalMode, setRemovalMode] =
        useState<RemovalMode>("hide");

    const [reason, setReason] = useState("");
    const [notifyAuthor, setNotifyAuthor] = useState(true);
    const [closeReports, setCloseReports] = useState(false);
    const [confirmation, setConfirmation] = useState("");
    const [attempted, setAttempted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!isOpen) return;

        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape") {
                handleClose();
            }
        }

        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener(
                "keydown",
                handleEscape
            );
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    function handleClose() {
        setRemoved(false);
        setRemovalMode("hide");
        setReason("");
        setNotifyAuthor(true);
        setCloseReports(false);
        setConfirmation("");
        setAttempted(false);
        onClose();
    }

    function handleRemove() {
        setAttempted(true);

        if (!reason.trim()) return;

        if (
            removalMode === "delete" &&
            confirmation !== "DELETE"
        ) {
            return;
        }

        onConfirm({
            mode: removalMode,
            reason: reason.trim(),
            notifyAuthor,
            closeReports,
        });

        setRemoved(true);
    }

    if (!mounted || !isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-black/50 px-4 py-6">
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="remove-note-title"
                className="my-auto w-full max-w-[560px] rounded-[28px] bg-white px-7 py-7 shadow-xl"
            >
                {removed ? (
                    <div className="space-y-5 py-3 text-center">
                        <div className="flex justify-center">
                            <Image
                                src="/assets/icons/check.svg"
                                alt=""
                                width={48}
                                height={48}
                                className="h-12 w-12 object-contain"
                            />
                        </div>

                        <h2
                            id="remove-note-title"
                            className="text-lg font-semibold text-[#303a36]"
                        >
                            {removalMode === "hide"
                                ? "Note Hidden"
                                : "Note Removed"}
                        </h2>

                        <p className="text-sm text-gray-500">
                            {removalMode === "hide"
                                ? "The note has been hidden successfully."
                                : "The note has been removed permanently."}
                        </p>

                        <button
                            type="button"
                            onClick={handleClose}
                            className="w-full rounded-md bg-[#00A651] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#008F45]"
                        >
                            Done
                        </button>
                    </div>
                ) : (
                    <div className="space-y-5">

                        {/* Modal Header */}
                        <div className="flex items-center gap-3">
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

                            <h2
                                id="remove-note-title"
                                className="text-base font-semibold text-[#303a36]"
                            >
                                Remove {noteTitle}
                            </h2>
                        </div>

                        {/* Note Information */}
                        <div className="rounded-md border border-gray-300 px-3 py-2.5">
                            <p className="text-sm font-semibold text-[#303a36]">
                                {noteTitle}
                            </p>

                            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-400">
                                {authorName && (
                                    <span>by {authorName}</span>
                                )}

                                <span>{likes} likes</span>
                                <span>{comments} comments</span>
                            </div>
                        </div>

                        {/* Removal Mode */}
                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setRemovalMode("hide");
                                    setConfirmation("");
                                }}
                                aria-pressed={removalMode === "hide"}
                                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                                    removalMode === "hide"
                                        ? "bg-[#00A651] text-white"
                                        : "bg-gray-100 text-[#303a36] hover:bg-gray-200"
                                }`}
                            >
                                Hide (can restore)
                            </button>

                            <button
                                type="button"
                                onClick={() => setRemovalMode("delete")}
                                aria-pressed={removalMode === "delete"}
                                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                                    removalMode === "delete"
                                        ? "bg-red-500 text-white"
                                        : "bg-gray-100 text-[#303a36] hover:bg-gray-200"
                                }`}
                            >
                                Delete Permanently
                            </button>
                        </div>

                        {/* Removal Reason */}
                        <div>
                            <div className={`rounded-md border px-3 py-2 ${
                                attempted && !reason.trim()
                                    ? "border-red-400"
                                    : "border-gray-300"
                            }`}>
                                <label
                                    htmlFor="removal-reason"
                                    className="block text-xs text-gray-500"
                                >
                                    Reason (logged)
                                </label>

                                <input
                                    id="removal-reason"
                                    type="text"
                                    value={reason}
                                    onChange={(event) =>
                                        setReason(event.target.value)
                                    }
                                    placeholder="Enter reason for removal"
                                    maxLength={500}
                                    className="w-full bg-transparent text-sm font-medium text-[#303a36] outline-none"
                                />
                            </div>

                            {attempted && !reason.trim() && (
                                <p className="mt-1 text-xs text-red-500">
                                    Please provide a removal reason.
                                </p>
                            )}
                        </div>

                        {/* Additional Actions */}
                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() =>
                                    setNotifyAuthor((previous) => !previous)
                                }
                                aria-pressed={notifyAuthor}
                                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                                    notifyAuthor
                                        ? "bg-[#00A651] text-white"
                                        : "bg-gray-100 text-[#303a36] hover:bg-gray-200"
                                }`}
                            >
                                Notify author
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setCloseReports((previous) => !previous)
                                }
                                aria-pressed={closeReports}
                                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                                    closeReports
                                        ? "bg-[#00A651] text-white"
                                        : "bg-gray-100 text-[#303a36] hover:bg-gray-200"
                                }`}
                            >
                                Close linked reports
                            </button>
                        </div>

                        {/* Permanent Delete Confirmation */}
                        {removalMode === "delete" && (
                            <div>
                                <div className={`rounded-md border px-3 py-2 ${
                                    attempted &&
                                    confirmation !== "DELETE"
                                        ? "border-red-400"
                                        : "border-gray-300"
                                }`}>
                                    <label
                                        htmlFor="delete-confirmation"
                                        className="block text-xs text-gray-500"
                                    >
                                        Type DELETE to confirm
                                    </label>

                                    <input
                                        id="delete-confirmation"
                                        type="text"
                                        value={confirmation}
                                        onChange={(event) =>
                                            setConfirmation(event.target.value)
                                        }
                                        placeholder="DELETE"
                                        autoComplete="off"
                                        className="w-full bg-transparent text-sm font-medium text-[#303a36] outline-none"
                                    />
                                </div>

                                {attempted &&
                                    confirmation !== "DELETE" && (
                                        <p className="mt-1 text-xs text-red-500">
                                            Type DELETE exactly to confirm permanent removal.
                                        </p>
                                    )}
                            </div>
                        )}

                        {/* Footer Actions */}
                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="rounded-full border border-gray-300 px-5 py-2 text-xs font-semibold text-[#303a36] transition-colors hover:bg-gray-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleRemove}
                                className="rounded-full bg-red-600 px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-700"
                            >
                                Remove Note
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
}
