
/**
 * File: components/admin/admin-layout.tsx
 *
 * Description:
 * Provides the shared layout for the Admin Dashboard.
 *
 * Features:
 * - Reuses the application's existing Navbar.
 * - Displays an independently scrollable admin sidebar.
 * - Manages the Post Announcement modal.
 * - Stores published announcements in local React state.
 */

"use client";

import { useState, type ReactNode } from "react";

import { PostsProvider } from "@/context/posts-context";
import Navbar from "@/components/layout/navbar";
import AdminSidebar from "./admin-sidebar";

import PostAnnouncementModal, {
    type Announcement,
} from "./post-announcement-modal";

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({
    children,
}: AdminLayoutProps) {
    // Controls the announcement modal.
    const [announcementModalOpen, setAnnouncementModalOpen] =
        useState(false);

    // Stores announcements during the current session.
    const [announcements, setAnnouncements] =
        useState<Announcement[]>([]);

    /**
     * Handle Publish Announcement
     *
     * Adds the announcement to local state.
     */
    function handlePublishAnnouncement(
        announcement: Announcement
    ) {
        setAnnouncements((previous) => [
            announcement,
            ...previous,
        ]);

        console.log(
            "Announcement saved locally:",
            announcement
        );
    }

    return (
        <PostsProvider>
            <div className="min-h-screen bg-white">

                {/* Shared Navbar */}
                <div className="sticky top-0 z-50 bg-white">
                    <Navbar />
                </div>

                {/* Admin Layout */}
                <div className="flex">

                    {/* Admin Sidebar */}
                    <div className="sidebar-scroll sticky top-18.25 h-[calc(100vh-73px)] shrink-0 overflow-y-auto">
                        <AdminSidebar
                            onOpenAnnouncement={() =>
                                setAnnouncementModalOpen(true)
                            }
                        />
                    </div>

                    {/* Main Content */}
                    <main className="min-w-0 flex-1">
                        {children}
                    </main>
                </div>

                {/* Announcement Modal */}
                {announcementModalOpen && (
                    <PostAnnouncementModal
                        onClose={() =>
                            setAnnouncementModalOpen(false)
                        }
                        onPublish={handlePublishAnnouncement}
                    />
                )}
            </div>
        </PostsProvider>
    );
}
