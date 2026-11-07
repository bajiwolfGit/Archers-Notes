
/**
 * File: components/admin/admin-sidebar.tsx
 *
 * Description:
 * Provides navigation for the Archer's Notes Admin Dashboard.
 * Uses SVG icons and styling consistent with the user sidebar.
 */

"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Admin Navigation
 *
 * Defines the admin sidebar navigation links and SVG icons.
 */
const navigation = [
    {
        label: "Dashboard",
        href: "/admin",
        icon: "/assets/icons/admin-home.svg",
    },
    {
        label: "Reports",
        href: "/admin/reports",
        icon: "/assets/icons/reports.svg",
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
        icon: "/assets/icons/admin-courses.svg",
    },
    {
        label: "Announcements",
        href: "/admin/announcements",
        icon: "/assets/icons/announcements.svg",
    },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="flex min-h-[calc(100vh-73px)] w-55.75 flex-col border-r border-gray-200 bg-white px-4 py-6">

            {/* Post Announcements Button */}
            <Link
                href="/admin/announcements"
                className="flex items-center gap-3 rounded bg-green-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-700"
            >
                <Image
                    src="/assets/icons/create-post.svg"
                    alt=""
                    width={20}
                    height={20}
                />

                Post Announcements
            </Link>

            {/* Admin Navigation */}
            <nav className="mt-6 space-y-2 text-sm">
                {navigation.map((item) => {
                    const active =
                        item.href === "/admin"
                            ? pathname === "/admin"
                            : pathname.startsWith(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-4 rounded-md px-4 py-2 font-semibold transition-colors ${
                                active
                                    ? "bg-green-600 text-white"
                                    : "text-[#303a36] hover:bg-gray-100"
                            }`}
                        >
                            <Image
                                src={item.icon}
                                alt=""
                                width={20}
                                height={20}
                                className="h-5 w-5 object-contain"
                            />

                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Admin Status */}
            <div className="mt-auto border-t border-gray-200 pt-5 text-xs text-gray-400">
                Signed in as Admin
            </div>
        </aside>
    );
}
