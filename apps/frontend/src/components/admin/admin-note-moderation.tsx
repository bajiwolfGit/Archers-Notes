
/**
 * File: components/admin/admin-note-moderation.tsx
 *
 * Description:
 * Displays moderation reports, internal notes,
 * and administrative actions for a user-created note.
 */

"use client";

import { useState } from "react";

import AdminNoteActions from "@/components/admin/admin-note-actions";

interface AdminNoteModerationProps {
    noteId: number;
    noteTitle: string;
    authorName: string;
    reportCount?: number;
}

export default function AdminNoteModeration({
    noteId,
    noteTitle,
    authorName,
    reportCount = 3,
}: AdminNoteModerationProps) {
    const [internalNote, setInternalNote] = useState("");

    return (
        <aside className="w-full rounded-md border border-gray-200 bg-white p-5">

            {/* Moderation Header */}
            <h2 className="text-sm font-semibold text-[#303a36]">
                Moderation
            </h2>

            {/* Report Status */}
            <div className="mt-3 flex items-center gap-2">
                <span className="rounded-full bg-red-500 px-3 py-1 text-[10px] font-semibold text-white">
                    Reported
                </span>

                <span className="text-xs text-gray-500">
                    {reportCount} reports
                </span>
            </div>

            <hr className="my-4 border-gray-200" />

            {/* Report Reasons */}
            <h3 className="mb-3 text-xs font-semibold text-[#303a36]">
                Report reasons
            </h3>

            <div className="space-y-2">

                {/* Mock Report: Spam */}
                <div className="rounded-md border border-gray-200 p-3">
                    <p className="text-xs font-medium text-[#303a36]">
                        Spam
                    </p>
                    <p className="mt-1 text-[11px] text-gray-400">
                        Reported by 2 users · 2h ago
                    </p>
                </div>

                {/* Mock Report: Copyright */}
                <div className="rounded-md border border-gray-200 p-3">
                    <p className="text-xs font-medium text-[#303a36]">
                        Copyright
                    </p>
                    <p className="mt-1 text-[11px] text-gray-400">
                        Reported by 1 user · 2h ago
                    </p>
                </div>

            </div>

            {/* Internal Moderation Note */}
            <div className="mt-5">
                <label
                    htmlFor="internal-moderation-note"
                    className="mb-2 block text-xs font-semibold text-[#303a36]"
                >
                    Internal note
                </label>

                <textarea
                    id="internal-moderation-note"
                    value={internalNote}
                    onChange={(event) =>
                        setInternalNote(event.target.value)
                    }
                    placeholder="Add a note for other admins..."
                    rows={4}
                    className="w-full resize-none rounded-md border border-gray-200 p-3 text-xs outline-none focus:border-[#00A651]"
                />
            </div>

            <hr className="my-5 border-gray-200" />

            {/* Moderation Actions */}
            <h3 className="mb-3 text-xs font-semibold text-[#303a36]">
                Moderation actions
            </h3>

            <AdminNoteActions
                noteId={noteId}
                noteTitle={noteTitle}
                authorName={authorName}
            />

        </aside>
    );
}
