"use client";

import { useState } from "react";
import MainLayout from "@/components/layout/main-layout";
import { usePosts } from "@/context/posts-context";
import type { Draft } from "@/context/posts-context";

export default function DraftsPage() {
    return (
        <MainLayout>
            <DraftsContent />
        </MainLayout>
    );
}

function DraftsContent() {
    const { drafts, deleteDraft, openEditDraft } = usePosts();

    const [draftToDelete, setDraftToDelete] = useState<Draft | null>(null);

    const sortedDrafts = [...drafts].sort(
        (a, b) =>
            new Date(b.updatedAt).getTime() -
            new Date(a.updatedAt).getTime()
    );

    return (
        <div className="mx-auto w-full max-w-[850px] px-6 py-8">

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-gray-900">
                    Drafts
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                    Your unpublished notes
                </p>
            </div>

            {/* Empty State */}
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
                <div className="space-y-4">
                    {sortedDrafts.map((draft) => (
                        <div
                            key={draft.id}
                            className="rounded-xl border border-gray-200 bg-white p-6"
                        >
                            {/* Draft Header */}
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-base font-semibold text-gray-900">
                                        {draft.title || "Untitled Draft"}
                                    </h2>

                                    <p className="mt-1 text-xs text-gray-500">
                                        {draft.course || "No course selected"}
                                    </p>
                                </div>

                                <span className="shrink-0 text-xs text-gray-400">
                                    {new Date(draft.updatedAt).toLocaleDateString()}
                                </span>
                            </div>

                            {/* Draft Preview */}
                            <p className="mt-4 line-clamp-3 whitespace-pre-line text-sm text-gray-600">
                                {draft.content
                                    .replace(/<[^>]*>/g, " ")
                                    .replace(/&nbsp;/g, " ")
                                    .trim() || "No content yet"}
                            </p>

                            {/* Actions */}
                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setDraftToDelete(draft)}
                                    className="rounded-full border border-[#FF5A5F] px-5 py-2 text-xs font-semibold text-[#FF5A5F] hover:bg-[#FFF0F0]"
                                >
                                    Delete
                                </button>

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

            {/* Delete Confirmation */}
            {draftToDelete && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 px-4">
                    <div
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="delete-draft-title"
                        className="w-full max-w-[400px] rounded-2xl bg-white p-6 shadow-xl"
                    >
                        <h2
                            id="delete-draft-title"
                            className="text-center text-base font-semibold text-gray-900"
                        >
                            Delete Draft?
                        </h2>

                        <p className="mt-3 text-center text-sm text-gray-500">
                            Are you sure you want to delete this draft?
                            This action cannot be undone.
                        </p>

                        <div className="mt-6 flex justify-center gap-3">
                            <button
                                type="button"
                                onClick={() => setDraftToDelete(null)}
                                className="min-w-[110px] rounded-full border border-gray-300 px-5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>

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