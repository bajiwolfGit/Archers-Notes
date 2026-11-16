
/**
 * File: components/profile/follow-list-modal.tsx
 *
 * Description:
 * Displays a modal containing the user's Following and Followers lists.
 *
 * Features:
 * - Switches between Following and Followers tabs.
 * - Displays user avatars, names, and course information.
 * - Allows users to follow or unfollow accounts.
 * - Navigates to individual user profiles.
 * - Closes when clicking outside the modal or pressing Escape.
 * - Provides an independently scrollable user list.
 *
 * Note:
 * Uses mock data and local React state until backend integration.
 */

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createPortal } from "react-dom";

type FollowTab = "following" | "followers";

interface FollowUser {
    id: number;
    name: string;
    course: string;
    avatar: string;
}

interface FollowListModalProps {
    initialTab: FollowTab;
    followingIds: number[];
    followerIds: number[];
    onToggleFollow: (userId: number) => void;
    onClose: () => void;
}

// Mock users for the Following list.
const initialFollowing: FollowUser[] = [
    {
        id: 2,
        name: "Jane Doe",
        course: "COB Student",
        avatar: "/assets/icons/profile.svg",
    },
    {
        id: 3,
        name: "Carmy Berzatto",
        course: "CCS Student",
        avatar: "/assets/icons/profile.svg",
    },
];

// Mock users for the Followers list.
const initialFollowers: FollowUser[] = [
    {
        id: 2,
        name: "Jane Doe",
        course: "COB Student",
        avatar: "/assets/icons/profile.svg",
    },
    {
        id: 3,
        name: "Carmy Berzatto",
        course: "CCS Student",
        avatar: "/assets/icons/profile.svg",
    },
    {
        id: 4,
        name: "Alan Smith",
        course: "CCS Student",
        avatar: "/assets/icons/profile.svg",
    },
];

export default function FollowListModal({
    initialTab,
    followingIds,
    followerIds,
    onToggleFollow,
    onClose,
}: FollowListModalProps) {
    // Controls the currently selected tab.
    const [activeTab, setActiveTab] = useState<FollowTab>(initialTab);

    // Ensures the portal only renders after mounting.
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Close the modal when Escape is pressed.
    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                onClose();
            }
        }

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    // Prevent background scrolling while the modal is open.
    useEffect(() => {
        const previousOverflow = document.body.style.overflow;

        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, []);

    // Select the users displayed in the active tab.
    // The following list reflects local follow/unfollow changes.
    const allUsers = Array.from(
        new Map(
            [...initialFollowing, ...initialFollowers].map((user) => [
                user.id,
                user,
            ])
        ).values()
    );

    const displayedUsers =
        activeTab === "following"
            ? allUsers.filter((user) => followingIds.includes(user.id))
            : allUsers.filter((user) => followerIds.includes(user.id));

    if (!mounted) {
        return null;
    }

    return createPortal(
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4"
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
                aria-labelledby="follow-list-title"
                className="flex w-full max-w-[440px] flex-col overflow-hidden rounded-xl bg-white shadow-xl"
            >
                {/* Modal Header */}
                <div className="relative flex items-center justify-center border-b border-gray-200 px-6 py-5">
                    <h2
                        id="follow-list-title"
                        className="text-base font-semibold text-[#343B36]"
                    >
                        Connections
                    </h2>

                    {/* Close Button */}
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close connections"
                        className="absolute right-5 flex h-7 w-7 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100"
                    >
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Following / Followers Tabs */}
                <div className="flex border-b border-gray-200">
                    <button
                        type="button"
                        onClick={() => setActiveTab("following")}
                        className={`relative flex-1 py-4 text-sm transition ${
                            activeTab === "following"
                                ? "font-semibold text-[#00A651]"
                                : "font-medium text-gray-500 hover:text-[#343B36]"
                        }`}
                    >
                        Following

                        {activeTab === "following" && (
                            <span className="absolute bottom-0 left-0 h-[2px] w-full bg-[#00A651]" />
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab("followers")}
                        className={`relative flex-1 py-4 text-sm transition ${
                            activeTab === "followers"
                                ? "font-semibold text-[#00A651]"
                                : "font-medium text-gray-500 hover:text-[#343B36]"
                        }`}
                    >
                        Followers

                        {activeTab === "followers" && (
                            <span className="absolute bottom-0 left-0 h-[2px] w-full bg-[#00A651]" />
                        )}
                    </button>
                </div>

                {/* User List */}
                <div className="max-h-[360px] min-h-[180px] overflow-y-auto px-5 py-3">
                    {displayedUsers.length === 0 ? (
                        <div className="flex min-h-[160px] items-center justify-center">
                            <p className="text-sm text-gray-500">
                                {activeTab === "following"
                                    ? "You are not following anyone yet."
                                    : "No followers yet."}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {displayedUsers.map((user) => {
                                const isFollowing = followingIds.includes(
                                    user.id
                                );

                                return (
                                    <div
                                        key={user.id}
                                        className="flex items-center justify-between gap-3 rounded-lg px-2 py-3 transition hover:bg-gray-50"
                                    >
                                        {/* User Profile */}
                                        <Link
                                            href={
                                                user.id === 1
                                                    ? "/profile"
                                                    : `/profile/${user.id}`
                                            }
                                            onClick={onClose}
                                            className="flex min-w-0 flex-1 items-center gap-3"
                                        >
                                            <Image
                                                src={user.avatar}
                                                alt=""
                                                width={42}
                                                height={42}
                                                className="h-[42px] w-[42px] shrink-0 rounded-full object-cover"
                                            />

                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-semibold text-[#343B36]">
                                                    {user.name}
                                                </p>

                                                <p className="mt-1 truncate text-xs text-gray-500">
                                                    {user.course}
                                                </p>
                                            </div>
                                        </Link>

                                        {/* Follow / Unfollow Button */}
                                        <button
                                            type="button"
                                            onClick={() => onToggleFollow(user.id)}
                                            aria-label={
                                                isFollowing
                                                    ? `Unfollow ${user.name}`
                                                    : `Follow ${user.name}`
                                            }
                                            className={`min-w-[100px] shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition ${
                                                isFollowing
                                                    ? "border-[#343B36] bg-white text-[#343B36] hover:bg-gray-100"
                                                    : "border-[#00A651] bg-[#00A651] text-white hover:bg-[#008F45]"
                                            }`}
                                        >
                                            {isFollowing
                                                ? "Following"
                                                : "Follow"}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}
