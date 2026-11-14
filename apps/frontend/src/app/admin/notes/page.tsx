/**
 * File: app/admin/notes/page.tsx
 *
 * Description:
 * Displays the Admin Notes Directory.
 *
 * Features:
 * - Uses the shared AdminLayout.
 * - Displays searchable and filterable notes.
 * - Provides access to individual note moderation pages.
 */

import AdminLayout from "@/components/admin/admin-layout";
import AdminNotesDirectory from "@/components/admin/admin-notes-directory";

export default function AdminNotesPage() {
    return (
        <AdminLayout>
            <AdminNotesDirectory />
        </AdminLayout>
    );
}