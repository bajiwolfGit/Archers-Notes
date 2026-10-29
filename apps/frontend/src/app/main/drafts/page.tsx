/**
 * File: app/drafts/page.tsx
 *
 * Description:
 * Manages the Drafts page of the Archer's Notes application.
 * Displays unpublished notes saved by the user and allows them
 * to edit or permanently delete their drafts.
 *
 * Features:
 * - Displays all saved drafts in descending order of modification.
 * - Shows draft titles, courses, content previews, and update dates.
 * - Provides an empty state when no drafts are available.
 * - Allows users to reopen drafts for editing.
 * - Provides a confirmation dialog before deleting a draft.
 *
 * Dependencies:
 * - React for state management.
 * - MainLayout for the application's shared layout.
 * - PostsContext for accessing and managing saved drafts.
 */

"use client";

// React hook for managing local component state.
import { useState } from "react";

// Shared application layout containing the navigation bar and sidebar.
import MainLayout from "@/components/layout/main-layout";

// Custom context hook for accessing drafts and draft management functions.
import { usePosts } from "@/context/posts-context";

// TypeScript type defining the structure of a saved draft.
import type { Draft } from "@/context/posts-context";

/**
 * DraftsPage Component
 *
 * Serves as the main entry point for the Drafts page.
 * Wraps the draft management interface inside the application's
 * shared layout to maintain consistent navigation and styling.
 *
 * @returns The Drafts page wrapped in MainLayout.
 */
export default function DraftsPage() {
    return (
        <MainLayout>
            <DraftsContent />
        </MainLayout>
    );
}

/**
 * DraftsContent Component
 *
 * Handles the display and management of the user's saved drafts.
 * Retrieves draft information from PostsContext and provides
 * functionality for editing and deleting drafts.
 *
 * @returns The draft list, empty state, and deletion confirmation dialog.
 */
function DraftsContent() {

    // Retrieve saved drafts and draft management functions from PostsContext.
    const { drafts, deleteDraft, openEditDraft } = usePosts();

    // Stores the draft selected for deletion.
    // A null value indicates that the confirmation dialog is closed.
    const [draftToDelete, setDraftToDelete] = useState<Draft | null>(null);

    /**
     * Sort drafts by their most recent modification date.
     *
     * Creates a copy of the drafts array to avoid modifying
     * the original array stored in PostsContext.
     *
     * Drafts with the latest updatedAt timestamp appear first.
     */
    const sortedDrafts = [...drafts].sort(
        (a, b) =>
            new Date(b.updatedAt).getTime() -
            new Date(a.updatedAt).getTime()
    );

    return (
        <div className="mx-auto w-full max-w-[850px] px-6 py-8">

            {/* Page Header: Displays the page title and description. */}
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-gray-900">
                    Drafts
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                    Your unpublished notes
                </p>
            </div>

            {/*
             * Empty State:
             * Displayed when the user has no saved drafts.
             * Provides a message explaining where future drafts will appear.
             */}
            {sortedDrafts.length === 0 ? (
                <div className="rounded-xl border border-gray-200 bg-white px-6 py-16 text-center">
                    <h2 className="text-base font-semibold text-gray-900">
                        No drafts yet
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                        Notes you save as drafts will appear here.
                    </p>
                </div>
            ) : (
                    
                /*
                 * Draft List:
                 * Displays all saved drafts when at least one draft exists.
                 * Each draft is rendered as an individual card.
                 */
                <div className="space-y-4">
                    {sortedDrafts.map((draft) => (
                        <div
                            key={draft.id}
                            className="rounded-xl border border-gray-200 bg-white p-6"
                        >
                            {/*
                             * Draft Header:
                             * Displays the draft title, associated course,
                             * and date of the most recent modification.
                             *
                             * Default values are displayed when the title
                             * or course information is unavailable.
                             */}
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-base font-semibold text-gray-900">
                                        {draft.title || "Untitled Draft"}
                                    </h2>

                                    <p className="mt-1 text-xs text-gray-500">
                                        {draft.course || "No course selected"}
                                    </p>
                                </div>

                                {/* Format the last modification date for display. */}
                                <span className="shrink-0 text-xs text-gray-400">
                                    {new Date(draft.updatedAt).toLocaleDateString()}
                                </span>
                            </div>

                            {/*
                             * Draft Preview:
                             * Displays a shortened preview of the draft content.
                             *
                             * Removes HTML tags and non-breaking space entities
                             * before displaying the text.
                             *
                             * The line-clamp-3 class limits the preview
                             * to a maximum of three visible lines.
                             */}
                            <p className="mt-4 line-clamp-3 whitespace-pre-line text-sm text-gray-600">
                                {draft.content
                                    .replace(/<[^>]*>/g, " ")
                                    .replace(/&nbsp;/g, " ")
                                    .trim() || "No content yet"}
                            </p>

                            {/*
                             * Draft Actions:
                             * Provides buttons for deleting or editing a draft.
                             */}
                            <div className="mt-6 flex justify-end gap-3">

                                {/*
                                 * Delete Button:
                                 * Stores the selected draft in draftToDelete,
                                 * triggering the deletion confirmation dialog.
                                 */}
                                <button
                                    type="button"
                                    onClick={() => setDraftToDelete(draft)}
                                    className="rounded-full border border-[#FF5A5F] px-5 py-2 text-xs font-semibold text-[#FF5A5F] hover:bg-[#FFF0F0]"
                                >
                                    Delete
                                </button>

                                {/*
                                 * Edit Draft Button:
                                 * Opens the selected draft in the note editor
                                 * through the openEditDraft context function.
                                 */}
                                <button
                                    type="button"
                                    onClick={() => openEditDraft(draft)}
                                    className="rounded-full bg-[#00A651] px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-green-700"
                                >
                                    Edit Draft
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/*
             * Delete Confirmation Dialog:
             * Appears only when a draft has been selected for deletion.
             *
             * Requires the user to confirm or cancel the operation
             * before permanently removing the selected draft.
             */}
            {draftToDelete && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 px-4">
                    <div
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="delete-draft-title"
                        className="w-full max-w-[400px] rounded-2xl bg-white p-6 shadow-xl"
                    >
                        {/* Dialog Title */}
                        <h2
                            id="delete-draft-title"
                            className="text-center text-base font-semibold text-gray-900"
                        >
                            Delete Draft?
                        </h2>

                        {/* Warning that draft deletion cannot be undone. */}
                        <p className="mt-3 text-center text-sm text-gray-500">
                            Are you sure you want to delete this draft?
                            This action cannot be undone.
                        </p>

                        {/* Dialog Action Buttons */}
                        <div className="mt-6 flex justify-center gap-3">

                            {/*
                             * Cancel Button:
                             * Clears the selected draft and closes
                             * the dialog without deleting anything.
                             */}
                            <button
                                type="button"
                                onClick={() => setDraftToDelete(null)}
                                className="min-w-[110px] rounded-full border border-gray-300 px-5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>

                            {/*
                             * Confirm Delete Button:
                             * Removes the selected draft using deleteDraft()
                             * and closes the confirmation dialog afterward.
                             */}
                            <button
                                type="button"
                                onClick={() => {
                                    deleteDraft(draftToDelete.id);
                                    setDraftToDelete(null);
                                }}
                                className="min-w-[110px] rounded-full bg-[#FF5A5F] px-5 py-2 text-xs font-semibold text-white hover:bg-[#E84D52]"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}