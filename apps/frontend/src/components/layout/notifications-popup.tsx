
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface Notification {
    id: number;
    message: string;
    time: string;
    isRead: boolean;
}

const initialNotifications: Notification[] = [
    {
        id: 1,
        message: "Jane Doe commented on your note.",
        time: "5 minutes ago",
        isRead: false,
    },
    {
        id: 2,
        message: "Alan Smith liked your note.",
        time: "20 minutes ago",
        isRead: false,
    },
];

export default function NotificationsPopup() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] =
        useState(initialNotifications);

    const containerRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter(
        (notification) => !notification.isRead
    ).length;

    // Close when clicking outside the popup.
    useEffect(() => {
        function handleOutsideClick(event: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(
                    event.target as Node
                )
            ) {
                setIsOpen(false);
            }
        }

        document.addEventListener(
            "mousedown",
            handleOutsideClick
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );
        };
    }, []);

    function markAllAsRead() {
        setNotifications((previous) =>
            previous.map((notification) => ({
                ...notification,
                isRead: true,
            }))
        );
    }

    return (
        <div ref={containerRef} className="relative">
            {/* Notification Button */}
            <button
                type="button"
                aria-label="Notifications"
                aria-expanded={isOpen}
                aria-controls="notifications-panel"
                onClick={() => setIsOpen((prev) => !prev)}
                className="relative flex h-9 w-9 items-center justify-center"
            >
                <Image
                    src="/assets/icons/notification.svg"
                    alt=""
                    width={20}
                    height={20}
                    className="h-5 w-5 object-contain"
                />

                {/* Unread Indicator */}
                {unreadCount > 0 && (
                    <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-[#00A651]" />
                )}
            </button>

            {/* Notification Popup */}
            {isOpen && (
                <div
                    id="notifications-panel"
                    className="absolute right-0 top-full z-50 mt-3 w-85 rounded-lg border border-gray-200 bg-white shadow-lg"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
                        <h2 className="text-sm font-semibold text-[#343B36]">
                            Notifications
                        </h2>

                        {unreadCount > 0 && (
                            <span className="rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-[#00A651]">
                                {unreadCount} new
                            </span>
                        )}
                    </div>

                    {/* Notification List */}
                    <div className="max-h-87.5 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="px-5 py-10 text-center text-sm text-gray-500">
                                No notifications yet.
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className="flex items-start gap-3 border-b border-gray-100 px-5 py-4 last:border-b-0"
                                >
                                    {/* Unread Dot */}
                                    <span
                                        className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                                            notification.isRead
                                                ? "bg-transparent"
                                                : "bg-[#00A651]"
                                        }`}
                                    />

                                    <div className="flex-1">
                                        <p className="text-sm text-[#343B36]">
                                            {notification.message}
                                        </p>

                                        <p className="mt-1 text-xs text-gray-400">
                                            {notification.time}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="border-t border-gray-200 px-5 py-3">
                            <button
                                type="button"
                                onClick={markAllAsRead}
                                disabled={unreadCount === 0}
                                className="w-full text-center text-xs font-semibold text-[#00A651] hover:underline disabled:cursor-default disabled:opacity-50"
                            >
                                Mark all as read
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
