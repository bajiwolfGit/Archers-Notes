/**
 * File: components/admin/admin-notes-directory.tsx
 *
 * Description:
 * Displays a searchable and filterable directory of notes
 * for administrators.
 *
 * Features:
 * - Search notes by title or author.
 * - Filter notes by course and moderation status.
 * - Sort notes by date or likes.
 * - Open individual notes for moderation.
 * - Notify authors, hide, restore, and remove notes.
 */

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

import NotifyAuthorModal from "@/components/admin/notify-author-modal";

import RemoveNoteModal, {
    type RemovalDetails,
} from "@/components/admin/remove-note-modal";

import { posts } from "@/data/posts";

type NoteStatus =
    | "Reported"
    | "Live"
    | "In Review"
    | "Hidden"
    | "Removed";

type SortOption = "Latest" | "Oldest" | "Most Liked";

interface DirectoryNote {
    id: number;
    title: string;
    author: string;
    course: string;
    posted: string;
    createdAt: string;
    likes: number;
    status: NoteStatus;
}

const initialNotes: DirectoryNote[] = posts.map((post) => ({
    id: post.id,
    title: post.title,
    author: post.name,
    course: post.course,
    posted: post.time,
    createdAt: post.createdAt ?? "",
    likes: post.likes ?? 0,
    status:
        post.id === 104 || post.id === 101
            ? "Reported"
            : post.id === 102
              ? "In Review"
              : "Live",
}));

const statusStyles: Record<NoteStatus, string> = {
    Reported: "bg-red-100 text-red-600",
    Live: "bg-green-100 text-green-700",
    "In Review": "bg-amber-100 text-amber-700",
    Hidden: "bg-gray-200 text-gray-700",
    Removed: "bg-red-200 text-red-700",
};


/**
 * Reusable dropdown based on the Notify Author modal.
 * Uses consistent chevron styling and highlights selected options.
 */

interface FilterDropdownProps {
    label: string;
    value: string;
    options: {
        value: string;
        label: string;
    }[];
    onChange: (value: string) => void;
}

function FilterDropdown({
    label,
    value,
    options,
    onChange,
}: FilterDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    const selectedOption = options.find(
        (option) => option.value === value
    );

    return (
        <div ref={dropdownRef} className="relative shrink-0">
            {/* Dropdown Trigger */}
            <button
                type="button"
                aria-label={label}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                onClick={() => setIsOpen((previous) => !previous)}
                className="flex min-w-[120px] items-center justify-between gap-4 rounded-full bg-gray-100 px-4 py-2 text-xs font-semibold text-[#303a36] transition-colors hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-[#00A651]"
            >
                <span className="whitespace-nowrap">
                    {label}: {selectedOption?.label}
                </span>

                {/* Same Chevron as Notify Author Modal */}
                <svg
                    className={`h-4 w-4 shrink-0 text-gray-500 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="m6 9 6 6 6-6"
                    />
                </svg>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div
                    role="listbox"
                    aria-label={label}
                    className="absolute left-0 top-full z-30 mt-2 min-w-full overflow-hidden rounded-lg border border-gray-200 bg-white p-1.5 shadow-lg"
                >
                    {options.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            role="option"
                            aria-selected={value === option.value}
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                            className={`flex w-full items-center justify-between gap-3 rounded-md px-3 py-2.5 text-left transition-colors ${
                                value === option.value
                                    ? "bg-green-50"
                                    : "hover:bg-gray-50"
                            }`}
                        >
                            <span className="whitespace-nowrap text-xs font-medium text-[#303a36]">
                                {option.label}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}


export default function AdminNotesDirectory() {
    const [notes, setNotes] =
        useState<DirectoryNote[]>(initialNotes);

    const [search, setSearch] = useState("");
    const [course, setCourse] = useState("All");
    const [status, setStatus] = useState("All");
    const [sort, setSort] = useState<SortOption>("Latest");

    const courses = useMemo(
        () => [
            "All",
            ...Array.from(
                new Set(posts.map((post) => post.course))
            ).sort(),
        ],
        []
    );

    const filteredNotes = useMemo(() => {
        const query = search.trim().toLowerCase();

        return notes
            .filter((note) => {
                const matchesSearch =
                    note.title.toLowerCase().includes(query) ||
                    note.author.toLowerCase().includes(query);

                const matchesCourse =
                    course === "All" || note.course === course;

                const matchesStatus =
                    status === "All" || note.status === status;

                return (
                    matchesSearch &&
                    matchesCourse &&
                    matchesStatus
                );
            })
            .sort((a, b) => {
                if (sort === "Most Liked") {
                    return b.likes - a.likes;
                }

                const aDate = new Date(a.createdAt).getTime();
                const bDate = new Date(b.createdAt).getTime();

                return sort === "Latest"
                    ? bDate - aDate
                    : aDate - bDate;
            });
    }, [notes, search, course, status, sort]);

    // Stores the note selected for author notification.
    const [selectedNote, setSelectedNote] =
        useState<DirectoryNote | null>(null);

    // Stores notifications created by the admin.
    const [, setNotifications] = useState<
        {
            noteId: number;
            type: "warning" | "removed" | "guidelines" | "custom";
            message: string;
        }[]
    >([]);
    
    const [noteToRemove, setNoteToRemove] = useState<DirectoryNote | null>(null);

    function handleConfirmRemove(details: RemovalDetails) {
        if (!noteToRemove) return;

        updateNote(noteToRemove.id, {
            status: details.mode === "hide" ? "Hidden" : "Removed",
        });
    }

    function updateNote(
        noteId: number,
        updates: Partial<DirectoryNote>
    ) {
        setNotes((previous) =>
            previous.map((note) =>
                note.id === noteId
                    ? { ...note, ...updates }
                    : note
            )
        );
    }

    function handleRemove(note: DirectoryNote) {
        setNoteToRemove(note);
    }

    // Opens the Notify Author modal for the selected note.
    function handleNotifyAuthor(note: DirectoryNote) {
        setSelectedNote(note);
    }

    // Stores the notification in local state.
    function handleSendNotification(notification: {
        noteId: number;
        type: "warning" | "removed" | "guidelines" | "custom";
        message: string;
    }) {
        setNotifications((previous) => [
            ...previous,
            notification,
        ]);
    }

    return (
        <>
            <div className="w-full px-6 py-6">
                {/* Page Title */}
                <h1 className="mb-5 text-2xl font-semibold text-[#303a36]">
                    Notes
                </h1>

                {/* Search and Filters */}
                <div className="mb-7 flex flex-wrap items-center gap-2">
                    <div className="min-w-[220px] flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2">
                        <label
                            htmlFor="notes-search"
                            className="block text-[10px] font-medium text-[#00A651]"
                        >
                            Search
                        </label>

                        <input
                            id="notes-search"
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Title or author"
                            className="w-full bg-transparent text-xs text-[#303a36] outline-none placeholder:text-gray-400"
                        />
                    </div>

                    {/* Course Filter */}
                    <FilterDropdown
                        label="Course"
                        value={course}
                        onChange={setCourse}
                        options={courses.map((item) => ({
                            value: item,
                            label: item,
                        }))}
                    />

                    {/* Status Filter */}
                    <FilterDropdown
                        label="Status"
                        value={status}
                        onChange={setStatus}
                        options={[
                            { value: "All", label: "All" },
                            { value: "Reported", label: "Reported" },
                            { value: "Live", label: "Live" },
                            { value: "In Review", label: "In Review" },
                            { value: "Hidden", label: "Hidden" },
                            { value: "Removed", label: "Removed" },
                        ]}
                    />

                    {/* Sort Filter */}
                    <FilterDropdown
                        label="Sort"
                        value={sort}
                        onChange={(value) => setSort(value as SortOption)}
                        options={[
                            { value: "Latest", label: "Latest" },
                            { value: "Oldest", label: "Oldest" },
                            { value: "Most Liked", label: "Most Liked" },
                        ]}
                    />
                </div>

                {/* Notes Table */}
                <div className="w-full overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="border-b border-gray-200 text-xs font-semibold text-[#303a36]">
                                <th className="px-2 py-4">Title</th>
                                <th className="px-2 py-4">Author</th>
                                <th className="px-2 py-4">Course</th>
                                <th className="px-2 py-4">Posted</th>
                                <th className="px-2 py-4">Likes</th>
                                <th className="px-2 py-4">Status</th>
                                <th className="px-2 py-4 text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredNotes.map((note) => (
                                <tr
                                    key={note.id}
                                    className="border-b border-gray-100 text-xs text-[#303a36] transition-colors hover:bg-gray-50"
                                >
                                    <td className="px-2 py-4">
                                        <Link
                                            href={`/admin/notes/${note.id}`}
                                            className="font-semibold hover:text-[#00A651]"
                                        >
                                            {note.title}
                                        </Link>
                                    </td>

                                    <td className="px-2 py-4">
                                        {note.author}
                                    </td>

                                    <td className="px-2 py-4">
                                        {note.course}
                                    </td>

                                    <td className="px-2 py-4">
                                        {note.posted}
                                    </td>

                                    <td className="px-2 py-4">
                                        {note.likes}
                                    </td>

                                    <td className="px-2 py-4">
                                        <span
                                            className={`inline-flex min-w-[70px] justify-center rounded-full px-3 py-1 text-[10px] font-semibold ${statusStyles[note.status]}`}
                                        >
                                            {note.status}
                                        </span>
                                    </td>

                                    <td className="px-2 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/notes/${note.id}`}
                                                className="rounded-md border border-gray-200 px-2 py-1.5 hover:bg-gray-100"
                                            >
                                                Open
                                            </Link>

                                            {/* Notify Author */}
                                            <button
                                                type="button"
                                                onClick={() => handleNotifyAuthor(note)}
                                                disabled={note.status === "Removed"}
                                                className="rounded-md border border-gray-200 px-2 py-1.5 text-xs font-medium text-[#303a36] transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                                            >
                                                Notify Author
                                            </button>

                                            {note.status === "Hidden" ? (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        updateNote(note.id, {
                                                            status: "Live",
                                                        })
                                                    }
                                                    className="rounded-md border border-green-200 px-2 py-1.5 text-green-700 hover:bg-green-50"
                                                >
                                                    Restore
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        updateNote(note.id, {
                                                            status: "Hidden",
                                                        })
                                                    }
                                                    disabled={note.status === "Removed"}
                                                    className="rounded-md border border-gray-200 px-2 py-1.5 hover:bg-gray-100 disabled:opacity-40"
                                                >
                                                    Hide
                                                </button>
                                            )}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemove(note)
                                                }
                                                disabled={note.status === "Removed"}
                                                className="rounded-md border border-red-200 px-2 py-1.5 text-red-500 hover:bg-red-50 disabled:opacity-40"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredNotes.length === 0 && (
                        <div className="py-12 text-center text-sm text-gray-500">
                            No notes match your search or filters.
                        </div>
                    )}
                </div>

                <p className="mt-4 text-xs text-gray-400">
                    {filteredNotes.length} notes found
                </p>
            </div>

            {/* Notify Author Modal */}
            {selectedNote && (
                <NotifyAuthorModal
                    isOpen={true}
                    onClose={() => setSelectedNote(null)}
                    noteId={selectedNote.id}
                    noteTitle={selectedNote.title}
                    authorName={selectedNote.author}
                    onSend={handleSendNotification}
                />
            )}

            {/* Remove Note Modal */}
            {noteToRemove && (
                <RemoveNoteModal
                    isOpen={true}
                    onClose={() => setNoteToRemove(null)}
                    onConfirm={handleConfirmRemove}
                    noteTitle={noteToRemove.title}
                    authorName={noteToRemove.author}
                    likes={noteToRemove.likes}
                    comments={
                        posts.find(
                            (post) => post.id === noteToRemove.id
                        )?.comments ?? 0
                    }
                />
            )}
        </>
    );
}