"use client";

import { useState, type ReactNode } from "react";

import { PostsProvider } from "@/context/posts-context";
import { AdminProvider } from "@/context/admin-context";
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
    const [announcementModalOpen, setAnnouncementModalOpen] =
        useState(false);

    const [announcements, setAnnouncements] =
        useState<Announcement[]>([]);

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
            <AdminProvider>
            <div className="min-h-screen bg-white">

                <div className="sticky top-0 z-50 bg-white">
                    <Navbar isAdmin />
                </div>

                <div className="flex">

                    <div className="sidebar-scroll sticky top-18.25 h-[calc(100vh-73px)] shrink-0 overflow-y-auto">
                        <AdminSidebar
                            onOpenAnnouncement={() =>
                                setAnnouncementModalOpen(true)
                            }
                        />
                    </div>

                    <main className="min-w-0 flex-1">
                        {children}
                    </main>
                </div>

                {announcementModalOpen && (
                    <PostAnnouncementModal
                        onClose={() =>
                            setAnnouncementModalOpen(false)
                        }
                        onPublish={handlePublishAnnouncement}
                    />
                )}
            </div>
            </AdminProvider>
        </PostsProvider>
    );
}
