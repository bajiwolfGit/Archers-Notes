/**
 * File: components/posts/post-notes-modal.tsx
 *
 * Description:
 * Provides the create/edit note dialog, including draft saving, course
 * selection, rich-text content, image management, validation, and
 * confirmation dialogs for clearing or leaving with unsaved changes.
 *
 * Features:
 * - Creates new posts, edits existing posts, and saves drafts.
 * - Extracts embedded image URLs from rich-text HTML.
 * - Validates required fields before publishing.
 * - Prevents background scrolling and supports Escape-key dismissal.
 * - Confirms clearing content and leaving with unsaved changes.
 */

"use client";

// React hooks for managing modal state and browser event effects.
import { useEffect, useState } from "react";

// Next.js image component for icons and existing image previews.
import Image from "next/image";


// Dropdown for selecting the course associated with a note.
import CourseSelector from "./course-selector";

// Rich-text editor for note content and attachments.
import NotesEditor from "./notes-editor";


// Shared post/draft actions and the Draft data type.
import { usePosts, type Draft } from "@/context/posts-context";

// Post data type used when publishing or updating a note.
import type { Post } from "@/components/home/post-card";

/**
 * Properties passed from the layout to the note editor dialog.
 * @property onClose - Closes the dialog and resets editing selection upstream.
 * @property editingPost - Existing post to edit, if any.
 * @property editingDraft - Saved draft to resume, if any.
 */
interface PostNotesModalProps {
    onClose: () => void;
    editingPost?: Post | null;
    editingDraft?: Draft | null;
}

/**
 * PostNotesModal
 * Renders the note creation/editing workflow and its confirmation dialogs.
 * @returns The editor dialog and conditional confirmation overlays.
 */
export default function PostNotesModal({
    onClose,
    editingPost = null,
    editingDraft = null,
}: PostNotesModalProps) {

    // Access shared actions for publishing, updating, and managing drafts.
    const { addPost, addDraft, updatePost, deleteDraft } = usePosts();

    // Distinguish editing an existing post from creating a post or resuming a draft.
    const isEditing = editingPost !== null;

    // Note title, initialized from the selected post or draft.
    const [title, setTitle] = useState(
        editingPost?.title ?? editingDraft?.title ?? ""
    );

    // Selected course, initialized from the selected post or draft.
    const [course, setCourse] = useState(
        editingPost?.course ?? editingDraft?.course ?? ""
    );

    // Rich-text HTML content, initialized from the selected post or draft.
    const [content, setContent] = useState(
        editingPost?.content ?? editingDraft?.content ?? ""
    );

    // Files currently attached through the editor.
    const [attachments, setAttachments] = useState<File[]>([]);

    // Previously published image URLs retained while editing a post.
    const [existingImages, setExistingImages] = useState<string[]>(
        editingPost?.images ?? []
    );
    
    // Incremented when clearing the form to reset the nested rich-text editor.
    const [resetKey, setResetKey] = useState(0);

    // Validation or publishing error shown beneath the form.
    const [error, setError] = useState("");

    // Controls the confirmation prompt for unsaved changes on close.
    const [showCloseConfirm, setShowCloseConfirm] = useState(false);

    // Controls the confirmation prompt before clearing the editor.
    const [showClearConfirm, setShowClearConfirm] = useState(false);

    // Prevent background scrolling while modal is open
    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, []);

    // Handle Escape: dismiss a confirmation first, otherwise request editor closure.
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

    /** Save current form values as a draft, preserving the draft ID when editing. */
    function handleSaveDraft() {
        const draft: Draft = {
            id: editingDraft?.id ?? Date.now(),
            title: title.trim(),
            course,
            content,
            updatedAt: new Date().toISOString(),
        };

        addDraft(draft);
        onClose();
    }
    
    // Update an existing post
    /** Validate and update an existing post, preserving retained images. */
    function handleUpdatePost() {
        if (!editingPost) return;

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

        // Extract newly inserted images
        const container = document.createElement("div");
        container.innerHTML = content;

        const images = Array.from(container.querySelectorAll("img"));

        const newImageUrls = images
            .map((image) => image.getAttribute("src"))
            .filter((src): src is string => src !== null);

        // Remove images from the text content
        images.forEach((image) => image.remove());

        // Preserve existing images and add new ones
        const updatedPost: Post = {
            ...editingPost,
            title: title.trim(),
            course,
            content: container.innerHTML,
            images: [...existingImages, ...newImageUrls],
        };

        updatePost(updatedPost);
        onClose();
    }

    // Publish Note
    /** Validate and publish a new post; remove its source draft if applicable. */
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

        // Separate images from the editor content
        const container = document.createElement("div");
        container.innerHTML = content;

        const images = Array.from(container.querySelectorAll("img"));

        const imageUrls = images
            .map((image) => image.getAttribute("src"))
            .filter((src): src is string => src !== null);

        // Remove images from the text content
        images.forEach((image) => image.remove());

        const textContent = container.innerHTML;
        
        const now = new Date();

        const newPost: Post = {
            id: Date.now(),
            authorId: 1,
            name: "John Doe",
            course,
            time: "Just now",
            title: title.trim(),
            content: textContent,
            images: imageUrls,
            likes: 0,
            comments: 0,
            createdAt: now.toISOString(),
        };

        try {
            addPost(newPost);

            // Remove the draft after publishing it
            if (editingDraft) {
                deleteDraft(editingDraft.id);
            }
            
            onClose();
        } catch (error) {
            console.error("Failed to create post:", error);
            setError("Something went wrong while creating your post.");
        }
    }

    // Clear Note
    /** Request confirmation before clearing the form. */
    function handleClear() {
        setShowClearConfirm(true);
    }

    /** Reset form values, attachment state, and the nested editor. */
    function confirmClear() {
        setTitle("");
        setCourse("");
        setContent("");
        setAttachments([]);
        setExistingImages([]);
        setError("");
        setResetKey((previous) => previous + 1);

        setShowClearConfirm(false);
    }

    // Close confirmation
    /** Close immediately if unchanged, or ask how to handle unsaved changes. */
    function handleRequestClose() {
        if (showClearConfirm) {
            setShowClearConfirm(false);
            return;
        }

        if (showCloseConfirm) {
            return;
        }

        const hasChanges = isEditing && editingPost
            ? title !== editingPost.title ||
                course !== editingPost.course ||
                content !== editingPost.content ||
                attachments.length > 0 ||
                existingImages.length !== (editingPost.images?.length ?? 0) ||
                existingImages.some(
                (image, index) => image !== editingPost.images?.[index]
            )
            : title.trim() !== "" ||
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

    // Modal backdrop: clicking outside the dialog requests closure.
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
                {/* Header: close control, editor mode title, and save/publish actions. */}
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
                        {isEditing ? "Edit Post" : "Post Notes"}
                    </h2>

                    <div className="ml-auto flex items-center gap-2">
                        {/* Save Draft — only when creating */}
                        {!isEditing && (
                            <button
                                type="button"
                                onClick={handleSaveDraft}
                                className="shrink-0 rounded-full border border-[#00A651] bg-white px-3 py-2 text-xs font-semibold text-[#00A651] transition-colors hover:bg-green-50 sm:min-w-[120px] sm:px-5"
                            >
                                Save Draft
                            </button>
                        )}

                        {/* Post / Save Changes */}
                        <button
                            type="button"
                            onClick={isEditing ? handleUpdatePost : handlePost}
                            className="ml-auto shrink-0 rounded-full bg-[#00A651] px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-green-700 sm:min-w-[120px] sm:px-5"
                        >
                            {isEditing ? "Save Changes" : "Post Note"}
                        </button>
                    </div>
                </div>

                {/* Form: note title, course, rich text, images, and validation. */}
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

                    {/* Existing Post Images: allow removal of previously attached images. */}
                    {isEditing && existingImages.length > 0 && (
                        <div className="space-y-3">
                            <p className="text-sm font-medium text-gray-700">
                                Existing Images
                            </p>

                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                {existingImages.map((image, index) => (
                                    <div
                                        key={`${image}-${index}`}
                                        className="relative overflow-hidden rounded-md border border-gray-200 bg-gray-50"
                                    >
                                        <div className="relative h-32 w-full">
                                            <Image
                                                src={image}
                                                alt={`Existing image ${index + 1}`}
                                                fill
                                                unoptimized
                                                className="object-contain"
                                            />
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setExistingImages((previous) =>
                                                    previous.filter((_, i) => i !== index)
                                                );
                                            }}
                                            aria-label={`Remove image ${index + 1}`}
                                            className="absolute right-2 top-2 rounded-full bg-white px-2 py-1 text-xs font-medium text-red-500 shadow hover:bg-red-50"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                        
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
                            {isEditing ? "Save Changes?" : "Save as Draft?"}
                        </h3>

                        {/* Description */}
                        <p
                            id="save-draft-description"
                            className="mt-3 text-center text-sm text-gray-500"
                        >
                            {isEditing
                                ? "You have unsaved changes. Would you like to save your changes before leaving?"
                                : "You have unsaved changes. Would you like to save this note as a draft before leaving?"}
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
                                onClick={isEditing ? handleUpdatePost : handleSaveDraft}
                                className="min-w-[100px] rounded-full bg-[#00A651] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-green-700"
                            >
                                {isEditing ? "Save Changes" : "Save Draft"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}