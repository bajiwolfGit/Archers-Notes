/**
 * File: components/admin/remove-note-modal.tsx
 *
 * Description:
 * Displays a confirmation modal before an administrator
 * removes a user-created note.
 *
 * Features:
 * - Confirms note removal.
 * - Displays the note being removed.
 * - Prevents accidental removal.
 * - Shows a success confirmation.
 * - Uses a React Portal for full-screen coverage.
 */

"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

interface RemoveNoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    noteTitle: string;
}

export default function RemoveNoteModal({
    isOpen,
    onClose,
    onConfirm,
    noteTitle,
}: RemoveNoteModalProps) {
    const [mounted, setMounted] = useState(false);
    const [removed, setRemoved] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!isOpen) return;

        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape") {
                onClose();
            }
        }

        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener(
                "keydown",
                handleEscape
            );
        };
    }, [isOpen, onClose]);

    function handleRemove() {
        onConfirm();
        setRemoved(true);
    }

    function handleClose() {
        setRemoved(false);
        onClose();
    }

    if (!mounted || !isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-black/50 px-4 py-6">
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="remove-note-title"
                className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
            >
                {removed ? (
                    <div className="space-y-4 text-center">

                        {/* Success Icon */}
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
                            Note Removed
                        </h2>

                        <p className="text-sm text-gray-500">
                            The note has been removed successfully.
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
                        <div className="flex items-center justify-between">
                            <h2
                                id="remove-note-title"
                                className="text-lg font-semibold text-[#303a36]"
                            >
                                Remove Note
                            </h2>

                            <button
                                type="button"
                                onClick={handleClose}
                                aria-label="Close modal"
                                className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-100"
                            >
                                <Image
                                    src="/assets/icons/exit.svg"
                                    alt=""
                                    width={20}
                                    height={20}
                                    className="h-5 w-5 object-contain"
                                />
                            </button>
                        </div>

                        {/* Warning Message */}
                        <p className="text-sm leading-relaxed text-gray-500">
                            Are you sure you want to remove this note?
                            This action will remove the note from
                            the platform.
                        </p>

                        {/* Note Information */}
                        <div className="rounded-md border border-red-100 bg-red-50 p-3">
                            <p className="text-xs text-gray-500">
                                Note to be removed
                            </p>

                            <p className="mt-1 text-sm font-semibold text-[#303a36]">
                                {noteTitle}
                            </p>
                        </div>

                        {/* Warning */}
                        <p className="text-xs text-red-500">
                            This action cannot be undone.
                        </p>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="rounded-md border border-gray-300 px-4 py-2.5 text-sm font-medium text-[#303a36] transition-colors hover:bg-gray-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleRemove}
                                className="rounded-md bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-600"
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
