/**
 * File: app/admin/quizzes/page.tsx
 *
 * Description:
 * Displays the Admin Quizzes Directory.
 *
 * Features:
 * - Uses the shared AdminLayout.
 * - Displays searchable and filterable quizzes.
 * - Provides access to individual quiz pages.
 */

import AdminLayout from "@/components/admin/admin-layout";
import AdminQuizzesDirectory from "@/components/admin/admin-quizzes-directory";

export default function AdminQuizzesPage() {
    return (
        <AdminLayout>
            <AdminQuizzesDirectory />
        </AdminLayout>
    );
}
