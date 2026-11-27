/**
 * File: app/admin/quizzes/[id]/page.tsx
 *
 * Description:
 * Displays a quiz and its answer key in the admin workspace.
 *
 * Features:
 * - Retrieves the quiz using the URL ID.
 * - Uses the shared AdminLayout.
 * - Provides unpublish, republish, and remove actions.
 */

import AdminLayout from "@/components/admin/admin-layout";
import AdminQuizPreview from "@/components/admin/admin-quiz-preview";

interface AdminQuizPageProps {
    params: Promise<{ id: string }>;
}

export default async function AdminQuizPage({
    params,
}: AdminQuizPageProps) {
    const { id } = await params;

    return (
        <AdminLayout>
            <AdminQuizPreview quizId={Number(id)} />
        </AdminLayout>
    );
}
