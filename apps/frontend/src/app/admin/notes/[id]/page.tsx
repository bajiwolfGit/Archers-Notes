
/**
 * File: app/admin/notes/[id]/page.tsx
 *
 * Description:
 * Displays a user-created note in the admin moderation workspace.
 *
 * Features:
 * - Retrieves the selected note using its URL ID.
 * - Reuses the existing PostDetails component.
 * - Displays moderation reports and actions in a right-side panel.
 * - Uses a responsive two-column layout.
 */

import { notFound } from "next/navigation";

import AdminLayout from "@/components/admin/admin-layout";
import PostDetails from "@/components/posts/post-details";
import AdminNoteModeration from "@/components/admin/admin-note-moderation";

import { posts } from "@/data/posts";

interface AdminNotePageProps {
    params: Promise<{ id: string }>;
}

export default async function AdminNotePage({
    params,
}: AdminNotePageProps) {
    const { id } = await params;

    // Retrieve the user-created note.
    const post = posts.find(
        (item) => item.id === Number(id)
    );

    if (!post) {
        notFound();
    }

    return (
        <AdminLayout>
            {/* Main Content Container */}
            <div className="relative w-full px-6 py-7">

                {/*
                * Admin Note Details:
                * Matches the user-side post details layout.
                * The note is aligned with the navbar search field.
                */}
                <div className="relative left-1/2 w-full max-w-120 -translate-x-[calc(50%+111px)]">

                    <PostDetails
                        post={post}
                        mode="admin"
                    />

                </div>

                {/*
                * Moderation Panel:
                * Matches the positioning of Recent Posts.
                */}
                <div className="fixed right-6 top-22 hidden w-56.25 xl:block">

                    <AdminNoteModeration
                        noteId={post.id}
                        reportCount={3}
                    />

                </div>

            </div>
        </AdminLayout>
    );
}
