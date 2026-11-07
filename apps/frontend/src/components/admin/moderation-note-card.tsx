
/**
 * File: components/admin/moderation-note-card.tsx
 *
 * Description:
 * Displays individual notes in the Admin Dashboard's
 * moderation feed.
 *
 * Features:
 * - Displays author information and note content.
 * - Shows moderation status.
 * - Displays likes, comments, and attachment counts.
 * - Provides Review, Hide/Unhide, and Remove actions.
 * - Uses existing SVG icons and application typography.
 */

import Image from "next/image";
import Link from "next/link";

/**
 * ModerationStatus Type
 *
 * Defines the possible moderation states of a note.
 */
export type ModerationStatus =
    | "Approved"
    | "Under Review"
    | "Flagged"
    | "Hidden"
    | "Removed";

/**
 * ModerationNote Interface
 *
 * Defines the information displayed in each note card.
 */
export interface ModerationNote {
    id: number;
    author: string;
    course: string;
    time: string;
    title: string;
    content: string;
    likes: number;
    comments: number;
    attachments: number;
    status: ModerationStatus;
}

/**
 * ModerationNoteCardProps Interface
 *
 * Defines the required note information and action callbacks.
 */
interface ModerationNoteCardProps {
    note: ModerationNote;
    onHide: (id: number) => void;
    onRemove: (id: number) => void;
}

/**
 * Moderation Status Styles
 *
 * Assigns different colors based on moderation status.
 */
const statusStyles: Record<ModerationStatus, string> = {
    Approved: "bg-green-600 text-white",
    "Under Review": "bg-amber-400 text-white",
    Flagged: "bg-red-500 text-white",
    Hidden: "bg-gray-500 text-white",
    Removed: "bg-red-700 text-white",
};

/**
 * ModerationNoteCard Component
 *
 * Displays a note and provides moderation actions.
 */
export default function ModerationNoteCard({
    note,
    onHide,
    onRemove,
}: ModerationNoteCardProps) {
    return (
        <article className="rounded-[10px] border border-gray-200 bg-white p-5">

            {/* Author Information and Moderation Status */}
            <div className="flex items-start justify-between gap-3">

                {/* Author Profile */}
                <div className="flex min-w-0 items-center gap-3">

                    {/* Profile Icon */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100">
                        <Image
                            src="/assets/icons/profile.svg"
                            alt=""
                            width={36}
                            height={36}
                            className="h-9 w-9 object-contain"
                        />
                    </div>

                    {/* Author Details */}
                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[#303a36]">
                            {note.author}
                        </p>

                        <p className="text-xs text-gray-500">
                            {note.course}
                            <span className="mx-2">·</span>
                            {note.time}
                        </p>
                    </div>
                </div>

                {/* Moderation Status */}
                <span
                    className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-semibold ${statusStyles[note.status]}`}
                >
                    {note.status}
                </span>
            </div>

            {/* Note Content */}
            <div className="mt-3 pl-13">

                {/* Note Title */}
                <h3 className="text-sm font-semibold text-[#303a36]">
                    {note.title}
                </h3>

                {/* Note Description */}
                <p className="mt-1 whitespace-pre-wrap wrap-break-word text-sm text-gray-600">
                    {note.content}
                </p>

                {/* Engagement Information */}
                <div className="mt-4 flex flex-wrap items-center gap-5 text-xs text-gray-600">

                    {/* Likes */}
                    <div className="flex items-center gap-2">
                        <Image
                            src="/assets/icons/heart.svg"
                            alt=""
                            width={18}
                            height={18}
                            className="h-4.5 w-4.5 object-contain"
                        />

                        <span>{note.likes}</span>
                    </div>

                    {/* Comments */}
                    <div className="flex items-center gap-2">
                        <Image
                            src="/assets/icons/comment.svg"
                            alt=""
                            width={18}
                            height={18}
                            className="h-4.5 w-4.5 object-contain"
                        />

                        <span>{note.comments}</span>
                    </div>

                    {/* Attachment Count - No Icon */}
                    <div className="flex items-center text-xs text-gray-600">
                        <span>
                            {note.attachments} attachments
                        </span>
                    </div>
                </div>

                {/* Moderation Action Buttons */}
                <div className="mt-4 flex flex-wrap items-center gap-2">

                    {/* Review Note */}
                    <Link
                        href={`/posts/${note.id}`}
                        className="rounded-full bg-green-600 px-5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-green-700"
                    >
                        Review
                    </Link>

                    {/* Hide / Unhide Note */}
                    <button
                        type="button"
                        onClick={() => onHide(note.id)}
                        disabled={note.status === "Removed"}
                        className="rounded-full border border-green-600 px-5 py-1.5 text-xs font-semibold text-green-600 transition-colors hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        {note.status === "Hidden"
                            ? "Unhide"
                            : "Hide"}
                    </button>

                    {/* Remove Note */}
                    <button
                        type="button"
                        onClick={() => onRemove(note.id)}
                        disabled={note.status === "Removed"}
                        className="rounded-full border border-red-400 px-5 py-1.5 text-xs font-semibold text-red-500 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Remove
                    </button>
                </div>
            </div>
        </article>
    );
}
