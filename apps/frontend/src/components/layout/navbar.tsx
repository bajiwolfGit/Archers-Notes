"use client";

/**
 * File: components/layout/navbar.tsx
 *
 * Description:
 * Provides the main navigation bar for the Archer's Notes application.
 * Displays the application logo, search bar, notifications button,
 * and user profile navigation.
 *
 * Features:
 * - Displays the Archer's Notes logo with navigation to the main page.
 * - Provides a search input for entering search queries.
 * - Displays a notifications button.
 * - Allows users to navigate to their profile page.
 * - Uses a horizontally centered search bar.
 * - Maintains consistent navigation styling across application pages.
 */

// Next.js component for optimized image rendering.
import Image from "next/image";

// Next.js component for client-side navigation between pages.
import Link from "next/link";

// Import the NotificationsPopup component for displaying notifications.
import NotificationsPopup from "@/components/layout/notifications-popup";

// Import the AdminNotificationsPopup component for displaying admin notifications.
import AdminNotificationsPopup from "@/components/admin/admin-notifications-popup";

interface NavbarProps {
    isAdmin?: boolean;
}
import { useEffect, useState } from "react";

/**
 * Navbar Component
 *
 * Displays the application's primary navigation bar.
 *
 * Organizes the navigation elements into three sections:
 * - Left: Application logo linking to the main page.
 * - Center: Search bar for entering search queries.
 * - Right: Notifications button and user profile link.
 *
 * The navigation bar uses relative positioning to allow
 * the search bar to remain horizontally centered.
 *
 * @returns The application's main navigation bar.
 */
export default function Navbar({
    isAdmin = false,
}: NavbarProps) {
    const [avatar, setAvatar] = useState<string | null>(null);
    const [isSigningOut, setIsSigningOut] = useState(false);

    async function handleSignOut() {
        try {
            setIsSigningOut(true);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"}/api/auth/sign-out`,
                {
                    method: "POST",
                    credentials: "include",
                }
            );

            if (!response.ok) {
                throw new Error("Failed to sign out.");
            }

            setAvatar(null);

            // Redirect to the landing page.
            window.location.href = "/";
        } catch (error) {
            console.error("Sign-out error:", error);
            alert("Unable to sign out. Please try again.");
            setIsSigningOut(false);
        }
    }

    useEffect(() => {
        async function fetchProfile() {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"}/users/me`,
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );

                if (!response.ok) return;

                const user = await response.json();

                setAvatar(user.avatar_url);
            } catch (error) {
                console.error("Failed to load navbar avatar:", error);
            }
        }

        fetchProfile();
    }, []);

    return (

        /*
         * Navigation Bar Container:
         * Displays the main navigation elements horizontally.
         *
         * Uses a fixed height of 73px and a bottom border
         * to separate the navigation bar from page content.
         *
         * Relative positioning provides the reference
         * for the absolutely positioned search bar.
         */
        <header className="relative flex h-18.25 items-center justify-between border-b border-gray-200 px-6">

            {/*
             * Application Logo:
             * Displays the Archer's Notes logo.
             *
             * Clicking the logo navigates the user
             * to the application's main page.
             */}
            <Link
                href={isAdmin ? "/admin" : "/main"}
                aria-label="Go to home"
            >
                {/* Application logo image. */}
                <Image
                    src="/assets/logo.svg"
                    alt="Archers Notes"
                    width={48}
                    height={48}
                    className="shrink-0"
                />
            </Link>

            {/*
             * Search Bar:
             * Provides an input field for entering search queries.
             *
             * Uses absolute positioning to center the search bar
             * horizontally within the navigation bar.
             *
             * The search bar has a width of 480px, with a
             * responsive maximum width based on available space.
             */}
            <form
                action="/search"
                method="GET"
                role="search"
                className="absolute left-1/2 flex w-120 max-w-[calc(100%-320px)] -translate-x-1/2 items-center gap-3 rounded-[10px] border border-[#E5E7EB] bg-white px-6 py-2"
            >
                <button
                    type="submit"
                    aria-label="Search notes"
                    className="shrink-0"
                >
                    <Image
                        src="/assets/icons/search.svg"
                        alt=""
                        width={20}
                        height={20}
                    />
                </button>

                <input
                    id="site-search"
                    name="q"
                    type="search"
                    autoComplete="off"
                    placeholder="Search"
                    aria-label="Search"
                    required
                    className="w-full bg-transparent text-sm font-semibold text-[#00A651] placeholder:text-[#00A651] outline-none"
                />
            </form>

            {/*
             * Right Navigation Section:
             * Contains the notifications button and
             * the current user's profile navigation.
             *
             * Uses ml-auto to position the elements
             * on the right side of the navigation bar.
             */}
            <div className="ml-auto flex shrink-0 items-center gap-6">

                {/*
                 * Notifications Button:
                 * Displays the notifications icon.
                 *
                 * When clicked, it toggles the visibility of the notifications popup.
                 * The button includes an unread indicator if there are new notifications.
                 *
                 * The NotificationsPopup component handles the display of notifications.
                 * It is rendered conditionally based on the button's state.
                 */}
                {isAdmin ? (
                    <AdminNotificationsPopup />
                ) : (
                    <NotificationsPopup />
                )}

                {/*
                * Profile Dropdown:
                * Opens when the user hovers over the profile icon.
                *
                * Includes:
                * - View Profile
                * - Settings
                * - Sign Out
                *
                * Uses Tailwind's group-hover and group-focus-within
                * utilities without requiring React state.
                */}
                <div className="group relative flex shrink-0 items-center">

                    {/* Profile Icon */}
                    <button
                        type="button"
                        aria-label="Account menu"
                        aria-haspopup="menu"
                        className="flex h-10 w-10 items-center justify-center rounded-full transition-opacity hover:opacity-75"
                    >
                    {/* Default user profile icon. */}
                    {avatar ? (
                        <Image
                            src={avatar}
                            alt="Profile"
                            width={36}
                            height={36}
                            unoptimized
                            className="h-9 w-9 rounded-full object-cover"
                        />
                    ) : (
                        <Image
                            src="/assets/icons/profile.svg"
                            alt="Profile"
                            width={36}
                            height={36}
                            unoptimized
                            className="h-9 w-9 object-contain"
                        />
                    )}
                    </button>

                    {/* Dropdown Menu */}
                    <div
                        className="
                            invisible absolute right-0 top-full z-50
                            w-48 pt-2 opacity-0
                            transition-all duration-150
                            group-hover:visible group-hover:opacity-100
                            group-focus-within:visible group-focus-within:opacity-100
                        "
                    >
                        <div className="rounded-lg border border-gray-200 bg-white p-2 shadow-lg">

                            {/* Regular User Options */}
                            {!isAdmin && (
                                <>
                                    {/* View Profile */}
                                    <Link
                                        href="/profile"
                                        className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-[#343B36] transition-colors hover:bg-gray-100"
                                    >
                                        <Image
                                            src="/assets/icons/users.svg"
                                            alt=""
                                            width={18}
                                            height={18}
                                            className="h-4.5 w-4.5 object-contain"
                                        />
                                        View Profile
                                    </Link>

                                    {/* Settings */}
                                    <Link
                                        href="/settings"
                                        className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-[#343B36] transition-colors hover:bg-gray-100"
                                    >
                                        <Image
                                            src="/assets/icons/settings.svg"
                                            alt=""
                                            width={18}
                                            height={18}
                                            className="h-4.5 w-4.5 object-contain"
                                        />
                                        Settings
                                    </Link>

                                    {/* Divider */}
                                    <div className="my-1 border-t border-gray-200" />
                                </>
                            )}

                            {/* Sign Out - Both User and Admin */}
                            <button
                                type="button"
                                onClick={handleSignOut}
                                disabled={isSigningOut}
                                className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                            >
                                <Image
                                    src="/assets/icons/sign-out.svg"
                                    alt=""
                                    width={18}
                                    height={18}
                                    className="h-4.5 w-4.5 object-contain"
                                />
                                {isSigningOut ? "Signing Out..." : "Sign Out"}
                            </button>

                        </div>
                    </div>
                </div>

            </div>
        </header>
    );
}