"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import CourseSelector from "./course-selector";
import NotesEditor from "./notes-editor";

import { usePosts } from "@/context/posts-context";
import type { Post } from "@/components/home/post-card";

interface PostNotesModalProps {
    onClose: () => void;
}

export default function PostNotesModal({
    onClose,
}: PostNotesModalProps) {
    const { addPost, addDraft } = usePosts();

    const [title, setTitle] = useState("");
    const [course, setCourse] = useState("");
    const [content, setContent] = useState("");
    const [attachments, setAttachments] = useState<File[]>([]);
    const [resetKey, setResetKey] = useState(0);
    const [error, setError] = useState("");
    const [showCloseConfirm, setShowCloseConfirm] = useState(false);
    const [showClearConfirm, setShowClearConfirm] = useState(false);

    // Prevent background scrolling while modal is open
    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, []);

    useEffect(() => {
        function handleEscape(event: KeyboardEvent) {
            if (event.key !== "Escape") return;

            if (showClearConfirm) {
                setShowClearConfirm(false);
            } else if (showCloseConfirm) {
                setShowCloseConfirm(false);
            } else {
                handleRequestClose();
            }
        }

        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    });

    function handleSaveDraft() {
        const draft = {
            id: Date.now(),
            title: title.trim(),
            course,
            content,
            updatedAt: new Date().toISOString(),
        };

        addDraft(draft);
        onClose();
    }
    
    // Publish Note
    function handlePost() {
        if (!title.trim()) {
            setError("Please enter a title.");
            return;
        }

        if (!course) {
            setError("Please select a course.");
            return;
        }

        const plainText = content
        .replace(/<[^>]*>/g, "")
        .replace(/&nbsp;/g, " ")
        .trim();

        if (!plainText && !content.includes("<img")) {
            setError("Please write something in your notes.");
            return;
        }

        const now = new Date();

        const newPost: Post = {
            id: Date.now(),
            authorId: 1,
            name: "John Doe",
            course,
            time: "Just now",
            title: title.trim(),
            content,
            images: [],
            likes: 0,
            comments: 0,
            createdAt: now.toISOString(),
        };

        try {
            addPost(newPost);
            onClose();
        } catch (error) {
            console.error("Failed to create post:", error);
            setError("Something went wrong while creating your post.");
        }
    }

    // Clear Note
    function handleClear() {
        setShowClearConfirm(true);
    }

    function confirmClear() {
        setTitle("");
        setCourse("");
        setContent("");
        setAttachments([]);
        setError("");
        setResetKey((previous) => previous + 1);

        setShowClearConfirm(false);
    }

    // Close confirmation
    function handleRequestClose() {
        if (showClearConfirm) {
            setShowClearConfirm(false);
            return;
        }

        if (showCloseConfirm) {
            return;
        }

        const hasChanges =
            title.trim() !== "" ||
            course !== "" ||
            content.replace(/<[^>]*>/g, "").trim() !== "" ||
            content.includes("<img") ||
            attachments.length > 0;

        if (hasChanges) {
            setShowCloseConfirm(true);
        } else {
            onClose();
        }
    }

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-3 py-3 sm:px-4 sm:py-6"
            onMouseDown={(event) => {
                if (
                    event.target === event.currentTarget &&
                    !showClearConfirm &&
                    !showCloseConfirm
                ) {
                    handleRequestClose();
                }
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="post-notes-title"
                className="flex max-h-[90dvh] w-full max-w-[850px] flex-col overflow-hidden rounded-[20px] bg-white shadow-xl sm:rounded-[30px]"
            >
                {/* Header */}
                <div className="flex shrink-0 items-center gap-3 px-4 pb-3 pt-4 sm:gap-5 sm:px-6">

                    {/* Close */}
                    <button
                        type="button"
                        onClick={handleRequestClose}
                        aria-label="Close modal"
                        className="flex h-9 w-9 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100"
                    >
                        <Image
                            src="/assets/icons/exit.svg"
                            alt=""
                            width={16}
                            height={16}
                            className="object-contain"
                        />
                    </button>

                    {/* Title */}
                    <h2
                        id="post-notes-title"
                        className="text-xs font-semibold text-gray-900"
                    >
                        Post Notes
                    </h2>

                    <div className="ml-auto flex items-center gap-2">
                        {/* Save Draft */}
                        <button
                            type="button"
                            onClick={handleSaveDraft}
                            className="shrink-0 rounded-full border border-[#00A651] bg-white px-3 py-2 text-xs font-semibold text-[#00A651] transition-colors hover:bg-green-50 sm:min-w-[120px] sm:px-5"
                        >
                            Save Draft
                        </button>
                        
                        {/* Post Button */}
                        <button
                            type="button"
                            onClick={handlePost}
                            className="ml-auto shrink-0 rounded-full bg-[#00A651] px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-green-700 sm:min-w-[120px] sm:px-5"
                        >
                            Post Note
                        </button>
                    </div>
                </div>

                {/* Form */}
                <div className="min-h-0 space-y-3 overflow-y-auto px-5 pb-6 pt-3 sm:px-8 md:px-10">

                {/* Title Input */}
                <div>
                    <label
                    htmlFor="note-title"
                    className="mb-2 block text-sm font-medium text-gray-700"
                    >
                    Title
                    </label>

                    <input
                    id="note-title"
                    type="text"
                    value={title}
                    onChange={(event) => {
                        setTitle(event.target.value);
                        setError("");
                    }}
                    placeholder="Enter note title"
                    maxLength={150}
                    className="w-full rounded-md border border-gray-200 px-4 py-3 text-sm outline-none transition-colors focus:border-[#00A651]"
                    />
                </div>

                {/* Course Selection */}
                <CourseSelector
                    value={course}
                    onChange={(value) => {
                    setCourse(value);
                    setError("");
                    }}
                />

                {/* Notes Editor */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                    Body
                    </label>

                    <NotesEditor
                    content={content}
                    onChange={(value) => {
                        setContent(value);
                        setError("");
                    }}
                    onAttachmentsChange={setAttachments}
                    resetKey={resetKey}
                    />
                </div>

                    {/* Attachments Summary */}
                    {attachments.length > 0 && (
                        <p className="text-xs text-gray-500">
                            {attachments.length} file(s) attached
                        </p>
                    )}

                    {/* Validation Error */}
                    {error && (
                        <p role="alert" className="text-sm text-[#FF5A5F]">
                            {error}
                        </p>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end px-6 pb-5 pt-2">
                    <button
                        type="button"
                        onClick={handleClear}
                        className="flex min-w-[120px] items-center justify-center rounded-full border border-[#FF5A5F] bg-white px-5 py-2 text-xs font-semibold text-[#FF5A5F] transition-colors hover:bg-[#FFF0F0]"
                    >
                        Clear
                    </button>
                </div>
            </div>

            {/* Clear Confirmation Modal */}
            {showClearConfirm && (
                <div className="absolute inset-0 z-[110] flex items-center justify-center rounded-[30px] bg-black/40 px-4">

                    <div
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="clear-confirm-title"
                        aria-describedby="clear-confirm-description"
                        className="w-full max-w-[400px] rounded-2xl bg-white p-6 shadow-xl"
                    >
                        {/* Title */}
                        <h3
                            id="clear-confirm-title"
                            className="text-center text-base font-semibold text-gray-900"
                        >
                            Clear Note?
                        </h3>

                        {/* Description */}
                        <p
                            id="clear-confirm-description"
                            className="mt-3 text-center text-sm text-gray-500"
                        >
                            Are you sure you want to clear this note?
                            All unsaved changes will be lost.
                        </p>

                        {/* Buttons */}
                        <div className="mt-6 flex items-center justify-center gap-3">

                            {/* Cancel */}
                            <button
                                type="button"
                                onClick={() => setShowClearConfirm(false)}
                                className="min-w-[110px] rounded-full border border-gray-300 bg-white px-5 py-2 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                            >
                                Cancel
                            </button>

                            {/* Confirm Clear */}
                            <button
                                type="button"
                                onClick={confirmClear}
                                className="flex min-w-[120px] items-center justify-center rounded-full border border-[#FF5A5F] bg-white px-5 py-2 text-xs font-semibold text-[#FF5A5F] transition-colors hover:bg-[#FFF0F0]"
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Save Draft Confirmation Modal */}
            {showCloseConfirm && (
                <div className="absolute inset-0 z-[120] flex items-center justify-center bg-black/40 px-4">
                    <div
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="save-draft-title"
                        aria-describedby="save-draft-description"
                        className="w-full max-w-[420px] rounded-2xl bg-white p-6 shadow-xl"
                    >
                        {/* Title */}
                        <h3
                            id="save-draft-title"
                            className="text-center text-base font-semibold text-gray-900"
                        >
                            Save as Draft?
                        </h3>

                        {/* Description */}
                        <p
                            id="save-draft-description"
                            className="mt-3 text-center text-sm text-gray-500"
                        >
                            You have unsaved changes. Would you like to save this
                            note as a draft before leaving?
                        </p>

                        {/* Buttons */}
                        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">

                            {/* Discard */}
                            <button
                                type="button"
                                onClick={onClose}
                                className="min-w-[100px] rounded-full border border-[#FF5A5F] bg-white px-4 py-2 text-xs font-semibold text-[#FF5A5F] transition-colors hover:bg-[#FFF0F0]"
                            >
                                Discard
                            </button>

                            {/* Cancel */}
                            <button
                                type="button"
                                onClick={() => setShowCloseConfirm(false)}
                                className="min-w-[100px] rounded-full border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                            >
                                Cancel
                            </button>

                            {/* Save Draft */}
                            <button
                                type="button"
                                onClick={handleSaveDraft}
                                className="min-w-[100px] rounded-full bg-[#00A651] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-green-700"
                            >
                                Save Draft
                            </button>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}