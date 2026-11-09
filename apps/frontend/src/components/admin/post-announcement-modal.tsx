
/**
 * File: components/admin/post-announcement-modal.tsx
 *
 * Description:
 * Provides a modal for administrators to create announcements.
 *
 * Features:
 * - Allows administrators to enter a title and message.
 * - Supports selecting announcement viewers.
 * - Allows administrators to configure pin duration.
 * - Supports immediate or scheduled publication.
 * - Validates required fields before publishing.
 * - Uses the application's existing typography and styling.
 */

"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

/**
 * Announcement Interface
 *
 * Defines the information collected when publishing
 * an announcement.
 */
export interface Announcement {
    id: number;
    title: string;
    message: string;
    viewers: string[];
    pinDuration: string;
    schedule: string;
}

/**
 * PostAnnouncementModalProps Interface
 *
 * Defines the callbacks for closing and publishing.
 */
interface PostAnnouncementModalProps {
    onClose: () => void;
    onPublish: (announcement: Announcement) => void;
}

/**
 * Available Viewer Groups
 *
 * These are temporary mock course groups.
 */
const viewerOptions = [
    "All users",
    "STSWENG",
    "CSARCH2",
    "STADVDB",
];

/**
 * PostAnnouncementModal Component
 *
 * Displays the announcement creation form in a modal.
 */
export default function PostAnnouncementModal({
    onClose,
    onPublish,
}: PostAnnouncementModalProps) {
    // Announcement title.
    const [title, setTitle] = useState("");

    // Announcement message.
    const [message, setMessage] = useState("");

    // Selected viewer groups.
    const [viewers, setViewers] = useState<string[]>([
        "All users",
    ]);

    // Announcement pin duration.
    const [pinDuration, setPinDuration] = useState("7 days");

    // Publication schedule.
    const [schedule, setSchedule] = useState("Post Now");

    // Prevent portal rendering before mounting.
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    /**
     * Toggle Viewer
     *
     * Allows administrators to select or deselect
     * announcement recipients.
     */
    function toggleViewer(viewer: string) {
        if (viewer === "All users") {
            setViewers(["All users"]);
            return;
        }

        setViewers((previous) => {
            const selected = previous.filter(
                (item) => item !== "All users"
            );

            if (selected.includes(viewer)) {
                return selected.filter(
                    (item) => item !== viewer
                );
            }

            return [...selected, viewer];
        });
    }

    /**
     * Handle Publish
     *
     * Validates the announcement and sends its data
     * to the parent component.
     */
    function handlePublish() {
        if (!title.trim() || !message.trim()) {
            alert("Please enter a title and message.");
            return;
        }

        if (viewers.length === 0) {
            alert("Please select at least one viewer group.");
            return;
        }

        const announcement: Announcement = {
            id: Date.now(),
            title: title.trim(),
            message: message.trim(),
            viewers,
            pinDuration,
            schedule,
        };

        onPublish(announcement);
        onClose();
    }

    if (!mounted) return null;

    return createPortal(
        /*
         * Modal Overlay:
         * Covers the entire viewport with a dark backdrop.
         */
        <div
            className="fixed inset-0 z-9999 flex items-center justify-center bg-black/60 px-4"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            {/* Modal Container */}
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="announcement-modal-title"
                className="w-full max-w-162.5 rounded-3xl bg-white px-8 py-7 shadow-xl"
            >
                {/* Modal Header */}
                <div className="mb-6 flex items-center justify-between gap-4">

                    <div className="flex items-center gap-4">
                        {/* Close Button */}
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close announcement modal"
                            className="flex h-6 w-6 shrink-0 items-center justify-center transition-opacity hover:opacity-60"
                        >
                            <Image
                                src="/assets/icons/exit.svg"
                                alt=""
                                width={12}
                                height={12}
                                className="h-3 w-3 object-contain"
                            />
                        </button>

                        <h2
                            id="announcement-modal-title"
                            className="text-base font-semibold text-[#303a36]"
                        >
                            Post Announcement
                        </h2>
                    </div>

                    {/* Publish Button */}
                    <button
                        type="button"
                        onClick={handlePublish}
                        className="rounded-full bg-[#00A651] px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700"
                    >
                        Publish
                    </button>
                </div>

                {/* Announcement Form */}
                <div className="space-y-3">

                    {/* Title */}
                    <div className="rounded-md border border-gray-300 px-3 py-2">
                        <label
                            htmlFor="announcement-title"
                            className="block text-xs text-gray-500"
                        >
                            Title
                        </label>

                        <input
                            id="announcement-title"
                            type="text"
                            value={title}
                            onChange={(event) =>
                                setTitle(event.target.value)
                            }
                            placeholder="Enter announcement title"
                            className="w-full bg-transparent text-sm font-medium text-[#303a36] outline-none"
                        />
                    </div>

                    {/* Message */}
                    <div className="rounded-md border border-gray-300 px-3 py-2">
                        <label
                            htmlFor="announcement-message"
                            className="block text-xs text-gray-500"
                        >
                            Message
                        </label>

                        <textarea
                            id="announcement-message"
                            value={message}
                            onChange={(event) =>
                                setMessage(event.target.value)
                            }
                            placeholder="Write your announcement..."
                            rows={2}
                            className="w-full resize-none bg-transparent text-sm text-[#303a36] outline-none"
                        />
                    </div>

                    {/* Viewers */}
                    <div className="rounded-md border border-gray-300 px-3 py-3">
                        <p className="mb-3 text-xs text-gray-500">
                            Viewers
                        </p>

                        <div className="flex flex-wrap gap-3">
                            {viewerOptions.map((viewer) => {
                                const selected =
                                    viewers.includes(viewer);

                                return (
                                    <button
                                        key={viewer}
                                        type="button"
                                        onClick={() =>
                                            toggleViewer(viewer)
                                        }
                                        aria-pressed={selected}
                                        className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
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
                    </div>

                    {/* Pin Duration and Schedule */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                        {/* Pin Duration */}
                        <div className="rounded-md border border-gray-300 px-3 py-2">
                            <label
                                htmlFor="announcement-pin-duration"
                                className="block text-xs text-gray-500"
                            >
                                Pin Duration
                            </label>

                            <select
                                id="announcement-pin-duration"
                                value={pinDuration}
                                onChange={(event) =>
                                    setPinDuration(event.target.value)
                                }
                                className="w-full bg-transparent text-sm font-medium text-[#303a36] outline-none"
                            >
                                <option value="1 day">1 day</option>
                                <option value="3 days">3 days</option>
                                <option value="7 days">7 days</option>
                                <option value="14 days">14 days</option>
                                <option value="30 days">30 days</option>
                            </select>
                        </div>

                        {/* Schedule */}
                        <div className="rounded-md border border-gray-300 px-3 py-2">
                            <label
                                htmlFor="announcement-schedule"
                                className="block text-xs text-gray-500"
                            >
                                Schedule
                            </label>

                            <select
                                id="announcement-schedule"
                                value={schedule}
                                onChange={(event) =>
                                    setSchedule(event.target.value)
                                }
                                className="w-full bg-transparent text-sm font-medium text-[#303a36] outline-none"
                            >
                                <option value="Post Now">Post Now</option>
                                <option value="Schedule Later">
                                    Schedule Later
                                </option>
                            </select>
                        </div>
                    </div>

                    {/* Future Schedule Information */}
                    {schedule === "Schedule Later" && (
                        <p className="text-xs text-amber-600">
                            Scheduled publishing requires backend
                            integration and is not available yet.
                        </p>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}
