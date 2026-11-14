
/**
 * File: components/admin/post-announcement-modal.tsx
 *
 * Description:
 * Allows administrators to create and schedule announcements.
 *
 * Features:
 * - Required title and message validation.
 * - Audience selection by course.
 * - Configurable pin duration.
 * - Immediate or scheduled publishing.
 * - Custom dropdowns.
 * - Confirmation screen.
 * - Full-screen modal using React Portal.
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

export interface Announcement {
    id: number;
    title: string;
    message: string;
    viewers: string[];
    pinDuration: string;
    schedule: string;
    scheduledAt?: string;
}

interface PostAnnouncementModalProps {
    onClose: () => void;
    onPublish: (announcement: Announcement) => void;
}

const viewerOptions = [
    "All users",
    "STSWENG",
    "CSARCH2",
    "STADVDB",
];

const pinOptions = [
    "1 day",
    "3 days",
    "7 days",
    "14 days",
    "30 days",
];

const scheduleOptions = [
    "Post Now",
    "Schedule Later",
];

type DropdownProps = {
    label: string;
    value: string;
    options: string[];
    onChange: (value: string) => void;
};

function CustomDropdown({
    label,
    value,
    options,
    onChange,
}: DropdownProps) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleOutside(event: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(
                    event.target as Node
                )
            ) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleOutside);

        return () =>
            document.removeEventListener(
                "mousedown",
                handleOutside
            );
    }, []);

    return (
        <div ref={containerRef} className="relative">
            <button
                type="button"
                aria-label={label}
                aria-expanded={open}
                aria-haspopup="listbox"
                onClick={() => setOpen(!open)}
                className="flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2.5 text-left transition-colors hover:border-[#00A651]"
            >
                <span className="flex flex-col gap-1">
                    <span className="text-xs text-gray-500">
                        {label}
                    </span>
                    <span className="text-sm font-medium text-[#303a36]">
                        {value}
                    </span>
                </span>

                <svg
                    className={`h-4 w-4 text-gray-500 transition-transform ${
                        open ? "rotate-180" : ""
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                >
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </button>

            {open && (
                <div
                    role="listbox"
                    aria-label={label}
                    className="absolute left-0 right-0 top-full z-30 mt-1 overflow-hidden rounded-lg border border-gray-200 bg-white p-1 shadow-lg"
                >
                    {options.map((option) => (
                        <button
                            key={option}
                            type="button"
                            role="option"
                            aria-selected={value === option}
                            onClick={() => {
                                onChange(option);
                                setOpen(false);
                            }}
                            className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors ${
                                value === option
                                    ? "bg-green-50 text-[#00A651]"
                                    : "text-[#303a36] hover:bg-gray-50"
                            }`}
                        >
                            {option}

                            {value === option && (
                                <Image
                                    src="/assets/icons/check.svg"
                                    alt=""
                                    width={16}
                                    height={16}
                                    className="h-4 w-4 object-contain"
                                />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function PostAnnouncementModal({
    onClose,
    onPublish,
}: PostAnnouncementModalProps) {
    const [mounted, setMounted] = useState(false);
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [viewers, setViewers] = useState<string[]>([
        "All users",
    ]);
    const [pinDuration, setPinDuration] = useState("7 days");
    const [schedule, setSchedule] = useState("Post Now");
    const [publishDate, setPublishDate] = useState("");
    const [publishTime, setPublishTime] = useState("");
    const [attempted, setAttempted] = useState(false);
    const [published, setPublished] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape") {
                onClose();
            }
        }

        document.addEventListener("keydown", handleEscape);

        return () =>
            document.removeEventListener(
                "keydown",
                handleEscape
            );
    }, [onClose]);

    function toggleViewer(viewer: string) {
        if (viewer === "All users") {
            setViewers(["All users"]);
            return;
        }

        setViewers((previous) => {
            const selected = previous.filter(
                (item) => item !== "All users"
            );

            return selected.includes(viewer)
                ? selected.filter((item) => item !== viewer)
                : [...selected, viewer];
        });
    }

    function handlePublish() {
        setAttempted(true);
        setError("");

        if (!title.trim() || !message.trim()) return;
        if (viewers.length === 0) return;

        let scheduledAt: string | undefined;

        if (schedule === "Schedule Later") {
            if (!publishDate || !publishTime) return;

            const date = new Date(
                `${publishDate}T${publishTime}`
            );

            if (
                Number.isNaN(date.getTime()) ||
                date.getTime() <= Date.now()
            ) {
                setError(
                    "Please select a future date and time."
                );
                return;
            }

            scheduledAt = date.toISOString();
        }

        const announcement: Announcement = {
            id: Date.now(),
            title: title.trim(),
            message: message.trim(),
            viewers,
            pinDuration,
            schedule,
            ...(scheduledAt ? { scheduledAt } : {}),
        };

        onPublish(announcement);
        setPublished(true);
    }

    if (!mounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-black/60 px-4 py-6">
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="announcement-modal-title"
                className="my-auto w-full max-w-[650px] rounded-3xl bg-white px-8 py-7 shadow-xl"
            >
                {published ? (
                    <div className="space-y-5 py-5 text-center">
                        <div className="flex justify-center">
                            <Image
                                src="/assets/icons/check.svg"
                                alt=""
                                width={48}
                                height={48}
                            />
                        </div>

                        <h2
                            id="announcement-modal-title"
                            className="text-lg font-semibold text-[#303a36]"
                        >
                            {schedule === "Post Now"
                                ? "Announcement Published"
                                : "Announcement Scheduled"}
                        </h2>

                        <p className="text-sm text-gray-500">
                            {schedule === "Post Now"
                                ? "Your announcement has been published successfully."
                                : "Your announcement has been scheduled successfully."}
                        </p>

                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full rounded-md bg-[#00A651] py-2.5 text-sm font-semibold text-white hover:bg-[#008F45]"
                        >
                            Done
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div className="mb-6 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    aria-label="Close announcement modal"
                                    className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-gray-100"
                                >
                                    <Image
                                        src="/assets/icons/exit.svg"
                                        alt=""
                                        width={16}
                                        height={16}
                                    />
                                </button>

                                <h2
                                    id="announcement-modal-title"
                                    className="text-base font-semibold text-[#303a36]"
                                >
                                    Post Announcement
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={handlePublish}
                                className="rounded-full bg-[#00A651] px-6 py-2 text-sm font-semibold text-white hover:bg-[#008F45]"
                            >
                                {schedule === "Post Now"
                                    ? "Publish"
                                    : "Schedule"}
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Title */}
                            <div>
                                <div className={`rounded-md border px-3 py-2 ${
                                    attempted && !title.trim()
                                        ? "border-red-400"
                                        : "border-gray-300"
                                }`}>
                                    <label
                                        htmlFor="announcement-title"
                                        className="block text-xs text-gray-500"
                                    >
                                        Title
                                    </label>

                                    <input
                                        id="announcement-title"
                                        value={title}
                                        maxLength={150}
                                        onChange={(event) =>
                                            setTitle(event.target.value)
                                        }
                                        placeholder="Enter announcement title"
                                        className="w-full bg-transparent text-sm text-[#303a36] outline-none"
                                    />
                                </div>

                                {attempted && !title.trim() && (
                                    <p className="mt-1 text-xs text-red-500">
                                        Please enter an announcement title.
                                    </p>
                                )}
                            </div>

                            {/* Message */}
                            <div>
                                <div className={`rounded-md border px-3 py-2 ${
                                    attempted && !message.trim()
                                        ? "border-red-400"
                                        : "border-gray-300"
                                }`}>
                                    <label
                                        htmlFor="announcement-message"
                                        className="block text-xs text-gray-500"
                                    >
                                        Message
                                    </label>

                                    <textarea
                                        id="announcement-message"
                                        value={message}
                                        maxLength={5000}
                                        rows={3}
                                        onChange={(event) =>
                                            setMessage(event.target.value)
                                        }
                                        placeholder="Write your announcement..."
                                        className="w-full resize-none bg-transparent text-sm text-[#303a36] outline-none"
                                    />
                                </div>

                                {attempted && !message.trim() && (
                                    <p className="mt-1 text-xs text-red-500">
                                        Please enter a message.
                                    </p>
                                )}
                            </div>

                            {/* Viewers */}
                            <div className="rounded-md border border-gray-300 p-3">
                                <p className="mb-3 text-xs text-gray-500">
                                    Viewers
                                </p>

                                <div className="flex flex-wrap gap-2">
                                    {viewerOptions.map((viewer) => {
                                        const selected =
                                            viewers.includes(viewer);

                                        return (
                                            <button
                                                key={viewer}
                                                type="button"
                                                aria-pressed={selected}
                                                onClick={() =>
                                                    toggleViewer(viewer)
                                                }
                                                className={`rounded-full px-4 py-1.5 text-xs font-semibold ${
                                                    selected
                                                        ? "bg-[#00A651] text-white"
                                                        : "bg-gray-200 text-[#303a36] hover:bg-gray-300"
                                                }`}
                                            >
                                                {viewer}
                                            </button>
                                        );
                                    })}
                                </div>

                                {attempted && viewers.length === 0 && (
                                    <p className="mt-2 text-xs text-red-500">
                                        Select at least one viewer group.
                                    </p>
                                )}
                            </div>

                            {/* Pin Duration and Schedule */}
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <CustomDropdown
                                    label="Pin Duration"
                                    value={pinDuration}
                                    options={pinOptions}
                                    onChange={setPinDuration}
                                />

                                <CustomDropdown
                                    label="Schedule"
                                    value={schedule}
                                    options={scheduleOptions}
                                    onChange={setSchedule}
                                />
                            </div>

                            {/* Schedule Date and Time */}
                            {schedule === "Schedule Later" && (
                                <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
                                    <p className="text-xs font-medium text-[#303a36]">
                                        Publication Date & Time
                                    </p>

                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        <input
                                            type="date"
                                            aria-label="Publication date"
                                            value={publishDate}
                                            onChange={(event) =>
                                                setPublishDate(event.target.value)
                                            }
                                            className="w-full rounded-md border border-gray-300 bg-white p-2 text-sm"
                                        />

                                        <input
                                            type="time"
                                            aria-label="Publication time"
                                            value={publishTime}
                                            onChange={(event) =>
                                                setPublishTime(event.target.value)
                                            }
                                            className="w-full rounded-md border border-gray-300 bg-white p-2 text-sm"
                                        />
                                    </div>

                                    {attempted &&
                                        (!publishDate || !publishTime) && (
                                            <p className="text-xs text-red-500">
                                                Select a publication date and time.
                                            </p>
                                        )}

                                    {error && (
                                        <p className="text-xs text-red-500">
                                            {error}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>,
        document.body
    );
}