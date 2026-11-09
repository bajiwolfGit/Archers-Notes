
/**
 * File: components/admin/admin-sidebar.tsx
 *
 * Description:
 * Provides the sidebar navigation for the Archer's Notes
 * Admin Dashboard.
 *
 * Features:
 * - Displays the Post Announcements button.
 * - Organizes navigation into Overview and Communication.
 * - Highlights the currently active page.
 * - Displays the number of pending reports.
 * - Displays administrator information at the bottom.
 * - Uses existing SVG icons and application typography.
 */

"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * AdminSidebarProps Interface
 *
 * Defines the callback used to open the
 * Post Announcement modal.
 */
interface AdminSidebarProps {
    onOpenAnnouncement: () => void;
}

/**
 * Navigation Item Interface
 *
 * Defines the information required for each sidebar link.
 */
interface NavigationItem {
    label: string;
    href: string;
    icon: string;
    badge?: number;
}

/**
 * Overview Navigation
 *
 * Contains the main administrative pages.
 *
 * SVG filenames can be adjusted to match
 * the existing assets folder.
 */
const overviewNavigation: NavigationItem[] = [
    {
        label: "Dashboard",
        href: "/admin",
        icon: "/assets/icons/home.svg",
    },
    {
        label: "Reports",
        href: "/admin/reports",
        icon: "/assets/icons/reports.svg",
        badge: 10,
    },
    {
        label: "Users",
        href: "/admin/users",
        icon: "/assets/icons/users.svg",
    },
    {
        label: "Notes",
        href: "/admin/notes",
        icon: "/assets/icons/notes.svg",
    },
    {
        label: "Courses",
        href: "/admin/courses",
        icon: "/assets/icons/courses.svg",
    },
];

/**
 * Communication Navigation
 *
 * Contains announcement-related administration.
 */
const communicationNavigation: NavigationItem[] = [
    {
        label: "Announcements",
        href: "/admin/announcements",
        icon: "/assets/icons/announcements.svg",
    },
];

/**
 * AdminSidebar Component
 *
 * Displays the administrative navigation panel.
 *
 * @param onOpenAnnouncement - Opens the announcement modal.
 * @returns The Admin Dashboard sidebar.
 */
export default function AdminSidebar({
    onOpenAnnouncement,
}: AdminSidebarProps) {
    const pathname = usePathname();

    /**
     * isActive
     *
     * Determines whether a navigation link corresponds
     * to the currently displayed admin page.
     */
    function isActive(href: string) {
        if (href === "/admin") {
            return pathname === "/admin";
        }

        return pathname.startsWith(href);
    }

    /**
     * renderNavigation
     *
     * Generates navigation links using the same styling
     * for both Overview and Communication sections.
     */
    function renderNavigation(items: NavigationItem[]) {
        return items.map((item) => {
            const active = isActive(item.href);

            return (
                <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`flex w-full items-center gap-3 rounded-md px-4 py-3 text-sm font-semibold transition-colors ${
                        active
                            ? "bg-[#E8F7EF] text-[#00A651]"
                            : "text-[#303a36] hover:bg-gray-100"
                    }`}
                >
                    {/* Navigation Icon */}
                    <Image
                        src={item.icon}
                        alt=""
                        width={20}
                        height={20}
                        className="h-5 w-5 shrink-0 object-contain"
                    />

                    {/* Navigation Label */}
                    <span className="flex-1">
                        {item.label}
                    </span>

                    {/* Report Count Badge */}
                    {item.badge !== undefined &&
                        item.badge > 0 && (
                            <span className="flex min-w-6 items-center justify-center rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-semibold text-red-500">
                                {item.badge}
                            </span>
                        )}
                </Link>
            );
        });
    }

    return (
        /*
         * Admin Sidebar Container:
         * Uses a width of 260px to provide enough space
         * for navigation labels and action buttons.
         */
        <aside className="flex min-h-[calc(100vh-73px)] w-65 flex-col border-r border-gray-200 bg-white px-4 py-6">

            {/* Post Announcements Button */}
            <button
                type="button"
                onClick={onOpenAnnouncement}
                className="flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-md bg-[#00A651] px-3 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#008F45]"
            >
                <Image
                    src="/assets/icons/create-post.svg"
                    alt=""
                    width={20}
                    height={20}
                    className="h-5 w-5 shrink-0 object-contain"
                />

                <span>Post Announcements</span>
            </button>

            {/* Header Divider */}
            <hr className="mt-6 mb-5 w-full border-0 border-t border-gray-200" />

            {/* Overview Section */}
            <div>
                {/* Section Label */}
                <p className="mb-3 px-3 text-[11px] font-semibold tracking-wider text-gray-400">
                    OVERVIEW
                </p>

                {/* Overview Navigation */}
                <nav
                    aria-label="Admin overview navigation"
                    className="space-y-1"
                >
                    {renderNavigation(overviewNavigation)}
                </nav>
            </div>

            {/* Communication Section */}
            <div className="mt-7">

                {/* Section Divider */}
                <hr className="mb-6 border-gray-200" />

                {/* Section Label */}
                <p className="mb-3 px-3 text-[11px] font-semibold tracking-wider text-gray-400">
                    COMMUNICATION
                </p>

                {/* Communication Navigation */}
                <nav
                    aria-label="Admin communication navigation"
                    className="space-y-1"
                >
                    {renderNavigation(communicationNavigation)}
                </nav>
            </div>

            {/* Administrator Profile Footer */}
            <div className="mt-auto pt-8">

                {/* Footer Divider */}
                <hr className="mb-4 border-gray-200" />

                {/* Administrator Information */}
                <div className="flex items-center gap-3 rounded-md px-2 py-2">

                    {/* Administrator Profile Icon */}
                    <Image
                        src="/assets/icons/profile.svg"
                        alt=""
                        width={36}
                        height={36}
                        className="h-9 w-9 shrink-0 object-contain"
                    />

                    {/* Administrator Details */}
                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#303a36]">
                            Administrator
                        </p>

                        <p className="text-xs text-gray-500">
                            Admin account
                        </p>
                    </div>
                </div>
            </div>
        </aside>
    );
}