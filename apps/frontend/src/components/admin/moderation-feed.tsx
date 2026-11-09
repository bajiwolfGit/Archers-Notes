
/**
 * File: components/admin/moderation-feed.tsx
 *
 * Description:
 * Displays notes in the moderation feed.
 *
 * Features:
 * - Switches between Flagged, Latest, and Trending tabs.
 * - Displays moderation note cards.
 * - Supports hiding and unhiding notes.
 * - Supports removing notes with confirmation.
 *
 * Currently uses mock data.
 */

"use client";

import { useState } from "react";

import { posts } from "@/data/posts";

import ModerationNoteCard, {
    type ModerationNote,
} from "./moderation-note-card";


/**
 * Mock Moderation Data
 *
 * Converts existing user-created posts into moderation notes.
 * Assigns temporary moderation statuses for testing.
 */
const initialNotes: ModerationNote[] = posts.map((post) => {
    const mockStatuses: Record<number, ModerationNote["status"]> = {
        101: "Flagged",
        102: "Under Review",
        103: "Approved",
        104: "Flagged",
        105: "Hidden",
    };

    return {
        id: post.id,
        author: post.name,
        course: post.course,
        time: post.time,
        title: post.title,
        content: post.content,
        likes: post.likes,
        comments: post.comments,
        attachments: post.images?.length ?? 0,
        status: mockStatuses[post.id] ?? "Approved",
    };
});


/**
 * FeedTab Type
 *
 * Defines the available moderation feed categories.
 */
type FeedTab = "Flagged" | "Latest" | "Trending";

export default function ModerationFeed() {
    // Currently selected moderation tab.
    const [activeTab, setActiveTab] =
        useState<FeedTab>("Flagged");

    // Stores the moderation notes and their current status.
    const [notes, setNotes] =
        useState<ModerationNote[]>(initialNotes);
    
    /**
     * Approve Note
     *
     * Updates the selected note's moderation status
     * to Approved.
     */
    function handleApprove(id: number) {
        setNotes((previous) =>
            previous.map((note) =>
                note.id === id
                    ? {
                        ...note,
                        status: "Approved",
                    }
                    : note
            )
        );
    }

    /**
     * Hide / Unhide Note
     *
     * Toggles a note between Hidden and Approved.
     */
    function handleHide(id: number) {
        setNotes((previous) =>
            previous.map((note) =>
                note.id === id
                    ? {
                          ...note,
                          status:
                              note.status === "Hidden"
                                  ? "Approved"
                                  : "Hidden",
                      }
                    : note
            )
        );
    }

    /**
     * Remove Note
     *
     * Requests confirmation before marking a note as Removed.
     */
    function handleRemove(id: number) {
        const confirmed = window.confirm(
            "Are you sure you want to remove this note?"
        );

        if (!confirmed) return;

        setNotes((previous) =>
            previous.map((note) =>
                note.id === id
                    ? {
                          ...note,
                          status: "Removed",
                      }
                    : note
            )
        );
    }

    /**
     * Filter Notes
     *
     * Flagged: Shows flagged and under-review notes.
     * Latest: Shows all available notes.
     * Trending: Sorts notes by engagement.
     */
    const visibleNotes = [...notes]
        .filter((note) => note.status !== "Removed")
        .filter((note) => {
            if (activeTab === "Flagged") {
                return (
                    note.status === "Flagged" ||
                    note.status === "Under Review"
                );
            }

            return true;
        })
        .sort((a, b) => {
            if (activeTab === "Trending") {
                return (
                    b.likes + b.comments -
                    (a.likes + a.comments)
                );
            }

            return b.id - a.id;
        });

    return (
        <section>
            {/* Moderation Feed Tabs */}
            <div className="grid grid-cols-3 overflow-hidden rounded-md border border-green-600">
                {(
                    ["Flagged", "Latest", "Trending"] as FeedTab[]
                ).map((tab) => (
                    <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveTab(tab)}
                        className={`py-2.5 text-sm font-semibold transition-colors ${
                            activeTab === tab
                                ? "bg-green-600 text-white"
                                : "bg-white text-green-600 hover:bg-green-50"
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Moderation Notes */}
            <div className="mt-5 space-y-4">
                {visibleNotes.length > 0 ? (
                    visibleNotes.map((note) => (
                        <ModerationNoteCard
                            key={note.id}
                            note={note}
                            onApprove={handleApprove}
                            onHide={handleHide}
                            onRemove={handleRemove}
                        />
                    ))
                ) : (
                    <div className="rounded-md border border-gray-200 p-6 text-center text-sm text-gray-500">
                        No notes available.
                    </div>
                )}
            </div>
        </section>
    );
}
