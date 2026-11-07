
/**
 * File: components/admin/admin-layout.tsx
 *
 * Description:
 * Provides the shared layout for the admin dashboard.
 * Reuses the existing Navbar and application typography.
 */

import type { ReactNode } from "react";

import Navbar from "@/components/layout/navbar";
import AdminSidebar from "./admin-sidebar";

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    return (
        <div className="min-h-screen bg-white">
            {/* Shared application navbar */}
            <div className="sticky top-0 z-50 bg-white">
                <Navbar />
            </div>

            <div className="flex">
                {/* Independently scrollable admin sidebar */}
                <div className="sidebar-scroll sticky top-18.25 h-[calc(100vh-73px)] shrink-0 overflow-y-auto">
                    <AdminSidebar />
                </div>

                {/* Admin page content */}
                <main className="min-w-0 flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}
