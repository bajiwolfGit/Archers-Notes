"use client";

import { createPortal } from "react-dom";

interface DeleteNoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export default function DeleteNoteModal({
    isOpen,
    onClose,
    onConfirm,
}: DeleteNoteModalProps) {
    if (!isOpen || typeof document === "undefined") return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4">
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="delete-note-title"
                className="relative w-full max-w-[500px] rounded-[30px] bg-white px-6 py-6"
            >
                {/* Close */}
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute left-5 top-5 text-xl text-gray-700 hover:opacity-60"
                >
                    ×
                </button>

                {/* Message */}
                <p
                    id="delete-note-title"
                    className="mt-12 text-center text-sm font-semibold"
                >
                    Are you sure you want to delete this note?
                </p>

                {/* Delete Button */}
                <div className="mt-7 flex justify-end">
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="w-[120px] rounded-full bg-[#FF7075] px-6 py-2 text-sm font-medium text-white hover:bg-red-500"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}