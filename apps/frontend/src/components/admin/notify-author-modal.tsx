
"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

type NotificationType =
    | "warning"
    | "removed"
    | "guidelines"
    | "custom";



interface NotifyAuthorModalProps {
    isOpen: boolean;
    onClose: () => void;
    noteId: number;
    noteTitle: string;
    authorName: string;
    onSend: (notification: {
        noteId: number;
        type: NotificationType;
        message: string;
    }) => void;
}

const templates: Record<NotificationType, string> = {
    warning:
        "Your note has been reported by other users. Please review its content and ensure it follows our community guidelines.",
    removed:
        "Your note has been removed following a moderation review. Please review our community guidelines.",
    guidelines:
        "Please ensure your notes follow the Archer's Notes community guidelines.",
    custom: "",
};

const notificationOptions = [
    {
        value: "warning",
        label: "Content Warning",
        description: "Alert the author about reported content",
    },
    {
        value: "removed",
        label: "Note Removal Notice",
        description: "Explain why a note was removed",
    },
    {
        value: "guidelines",
        label: "Community Guidelines Reminder",
        description: "Remind the author of posting rules",
    },
    {
        value: "custom",
        label: "Custom Message",
        description: "Write a personalized notification",
    },
] as const;

export default function NotifyAuthorModal({
    isOpen,
    onClose,
    noteId,
    noteTitle,
    authorName,
    onSend,
}: NotifyAuthorModalProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);

    const [type, setType] =
        useState<NotificationType>("warning");

    const [message, setMessage] = useState(
        templates.warning
    );

    const [sent, setSent] = useState(false);

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    if (!isOpen || !mounted) return null;

    function handleTypeChange(value: NotificationType) {
        setType(value);
        setMessage(templates[value]);
    }

    function handleSend() {
        if (!message.trim()) return;

        onSend({
        noteId,
        type,
        message: message.trim(),
        });

        setSent(true);
    }

    function handleClose() {
        setSent(false);
        setType("warning");
        setMessage(templates.warning);
        setIsDropdownOpen(false);
        onClose();
    }

    return createPortal(
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40 px-4">
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="notify-author-title"
                className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
            >
                {sent ? (
                    <div className="space-y-4 text-center">
                        <div className="flex justify-center">
                            <Image
                                src="/assets/icons/check.svg"
                                alt=""
                                width={48}
                                height={48}
                                className="h-12 w-12 object-contain"
                            />
                        </div>

                        <h2 className="text-lg font-semibold">
                            Notification Saved
                        </h2>

                        <p className="text-sm text-gray-500">
                            Your notification has been sent to the author successfully.
                        </p>

                        <button
                        type="button"
                        onClick={handleClose}
                        className="w-full rounded-md bg-green-600 py-2 text-sm font-medium text-white"
                        >
                            Done
                        </button>
                    </div>
                ) : (
                <div className="space-y-5">
                    <div className="flex items-center justify-between">
                        <h2
                            id="notify-author-title"
                            className="text-lg font-semibold"
                        >
                            Notify Author
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

                    <p className="text-sm text-gray-500">
                    Send a moderation notification to
                    the author of this note.
                    </p>

                    <div className="rounded-md bg-gray-50 p-3">
                    <p className="text-xs text-gray-500">
                        Note being reviewed
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                        {noteTitle}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                        Author: {authorName}
                    </p>
                    </div>

                    {/* Notification Type Dropdown */}
                    <div ref={dropdownRef} className="relative">
                        <label
                            id="notification-type-label"
                            className="mb-2 block text-sm font-medium text-[#303a36]"
                        >
                            Notification Type
                        </label>

                        {/* Dropdown Trigger */}
                        <button
                            type="button"
                            aria-haspopup="listbox"
                            aria-expanded={isDropdownOpen}
                            aria-labelledby="notification-type-label"
                            onClick={() => setIsDropdownOpen((previous) => !previous)}
                            className="flex w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-3 text-left text-sm text-[#303a36] transition-colors hover:border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#00A651]"
                        >
                            <span>
                                {
                                    notificationOptions.find(
                                        (option) => option.value === type
                                    )?.label
                                }
                            </span>

                            <svg
                                className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
                                    isDropdownOpen ? "rotate-180" : ""
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="m6 9 6 6 6-6"
                                />
                            </svg>
                        </button>

                        {/* Dropdown Options */}
                        {isDropdownOpen && (
                            <div
                                role="listbox"
                                aria-labelledby="notification-type-label"
                                className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-lg border border-gray-200 bg-white p-1.5 shadow-lg"
                            >
                                {notificationOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        role="option"
                                        aria-selected={type === option.value}
                                        onClick={() => {
                                            handleTypeChange(option.value);
                                            setIsDropdownOpen(false);
                                        }}
                                        className={`flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left transition-colors ${
                                            type === option.value
                                                ? "bg-green-50"
                                                : "hover:bg-gray-50"
                                        }`}
                                    >
                                        <div>
                                            <p className="text-sm font-medium text-[#303a36]">
                                                {option.label}
                                            </p>

                                            <p className="mt-0.5 text-xs text-gray-400">
                                                {option.description}
                                            </p>
                                        </div>

                                        {type === option.value && (
                                            <Image
                                                src="/assets/icons/check.svg"
                                                alt=""
                                                width={16}
                                                height={16}
                                                className="ml-3 h-4 w-4 shrink-0 object-contain"
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="notification-message"
                            className="mb-2 block text-sm font-medium"
                        >
                            Message to Author
                        </label>

                        <textarea
                            id="notification-message"
                            value={message}
                            onChange={(event) =>
                            setMessage(event.target.value)
                            }
                            rows={5}
                            maxLength={1000}
                            placeholder="Write a notification..."
                            className="w-full resize-none rounded-md border border-gray-300 p-3 text-sm outline-none focus:border-green-500"
                        />

                        <p className="mt-1 text-right text-xs text-gray-400">
                            {message.length}/1000
                        </p>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="rounded-md border border-gray-300 px-4 py-2 text-sm"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={handleSend}
                            disabled={!message.trim()}
                            className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Send Notification
                        </button>
                    </div>
                </div>
                )}
            </div>
        </div>,
        document.body
    );
}
