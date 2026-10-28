/**
 * File: components/posts/post-comments.tsx
 *
 * Description:
 * Manages the comments section of a post in the Archer's Notes
 * application.
 *
 * Allows users to create comments, reply to existing comments,
 * like comments, collapse replies, share comments, report
 * comments, and preview attached images.
 *
 * Features:
 * - Displays existing comments and their replies.
 * - Allows users to submit new comments with attachments.
 * - Supports liking and unliking comments.
 * - Supports replying to existing comments.
 * - Allows users to expand or collapse comment replies.
 * - Manages individual comment action menus.
 * - Closes comment menus when clicking outside.
 * - Supports sharing and reporting comments.
 * - Displays attached images in an image preview.
 * - Notifies the parent component when the comment count changes.
 */

"use client";

// React hooks for managing component state and side effects.
import { useEffect, useState } from "react";

// React mouse event type for handling image clicks.
import type { MouseEvent as ReactMouseEvent } from "react";

// Component responsible for displaying an individual comment.
// Also imports the Comment type used to represent comment data.
import CommentItem, {
    type Comment,
} from "@/components/posts/comment-item";

// Component responsible for creating new comments.
// Also imports the attachment type used by the comment editor.
import CommentEditor, {
    type CommentAttachment,
} from "@/components/posts/comment-editor";

// Reusable component for previewing images.
import ImagePreview from "@/components/ui/image-preview";

/**
 * PostCommentsProps Interface
 *
 * Defines the properties required by the PostComments component.
 *
 * @property onShare - Callback function for sharing a comment.
 *                     Receives the ID of the selected comment.
 *
 * @property onReport - Callback function for opening the
 *                      report interface.
 *
 * @property onCommentCountChange - Callback function that receives
 *                                  the difference between the current
 *                                  number of top-level comments and
 *                                  the initial number.
 *
 * @property onOpenCommentMenu - Optional callback executed when
 *                               a comment menu is toggled.
 */
interface PostCommentsProps {
    onShare: (commentId: number) => void;
    onReport: () => void;
    onCommentCountChange: (count: number) => void;
    onOpenCommentMenu?: () => void;
}

/**
 * Initial Comments Data
 *
 * Contains predefined comments used to populate the
 * comments section when the component first renders.
 *
 * Each comment includes:
 * - A unique comment ID.
 * - Author information.
 * - HTML-formatted comment content.
 * - Relative posting time.
 * - Number of likes.
 * - An array of replies.
 *
 * Currently uses mock data rather than retrieving
 * comments from a backend or database.
 */
const initialComments: Comment[] = [
    {
        id: 1,
        name: "Carmy Berzatto",
        authorId: 3,
        course: "CCS Student",
        text: "<p>Wow! Thank for this :)</p>",
        time: "15 mins ago",
        likes: 2,
        replies: [
            {
                id: 2,
                authorId: 4,
                name: "Alan Smith",
                course: "CCS Student",
                text: "<p>You're welcome!</p>",
                time: "2 mins ago",
                likes: 0,
                replies: [],
            },
        ],
    },
];

/**
 * PostComments Component
 *
 * Displays and manages the comments section of a post.
 *
 * Maintains local state for comments, liked comments,
 * active replies, collapsed replies, open action menus,
 * and image previews.
 *
 * Delegates individual comment rendering to CommentItem
 * and comment creation to CommentEditor.
 *
 * Communicates sharing, reporting, and comment count
 * changes to the parent component through callbacks.
 *
 * @param onShare - Function called when sharing a comment.
 * @param onReport - Function called when reporting a comment.
 * @param onCommentCountChange - Function called when the number
 *                               of top-level comments changes.
 * @param onOpenCommentMenu - Optional callback for comment menus.
 * @returns The interactive comments section of a post.
 */
export default function PostComments({
    onShare,
    onReport,
    onCommentCountChange,
    onOpenCommentMenu,
}: PostCommentsProps) {

    /**
     * Comments State
     *
     * Stores the current list of top-level comments,
     * including their nested replies and attachments.
     *
     * Initially populated using the mock comments data.
     */
    const [comments, setComments] = useState<Comment[]>(initialComments);

    /**
     * Liked Comments State
     *
     * Stores the IDs of comments liked by the current user.
     *
     * A Set is used to efficiently check whether a
     * comment has been liked.
     *
     * Initially contains no liked comment IDs.
     */
    const [likedComments, setLikedComments] = useState<Set<number>>(
        () => new Set()
    );

    /**
     * Reply State
     *
     * replyingTo:
     * Stores the ID of the comment currently being replied to.
     * A null value indicates that no reply editor is active.
     *
     * replyText:
     * Stores the text entered into the active reply editor.
     */
    const [replyingTo, setReplyingTo] = useState<number | null>(null);
    const [replyText, setReplyText] = useState("");

    /**
     * Collapsed Replies State
     *
     * Stores the IDs of comments whose replies
     * are currently collapsed.
     *
     * Uses a Set to track multiple collapsed
     * comment threads independently.
     */
    const [collapsedReplies, setCollapsedReplies] = useState<Set<number>>(
        () => new Set()
    );

    /**
     * Open Comment Menu State
     *
     * Stores the ID of the comment whose action
     * menu is currently open.
     *
     * A null value indicates that all comment
     * action menus are closed.
     */
    const [openCommentMenu, setOpenCommentMenu] = useState<number | null>(
        null
    );

    /**
     * Comment Image Preview State
     *
     * Stores the information required to display
     * an image preview.
     *
     * images:
     * Array of image URLs available in the preview.
     *
     * initialIndex:
     * Index of the image initially displayed.
     *
     * A null value indicates that the image
     * preview is currently closed.
     */
    const [commentImagePreview, setCommentImagePreview] = useState<{
        images: string[];
        initialIndex: number;
    } | null>(null);

    /**
     * Comment Count Effect
     *
     * Notifies the parent component whenever the
     * comments array changes.
     *
     * Calculates the difference between the current
     * number of top-level comments and the initial
     * number of top-level comments.
     *
     * This allows the parent component to update
     * its displayed comment count.
     *
     * Note:
     * Nested replies are not included in this calculation.
     */
    useEffect(() => {
        onCommentCountChange(comments.length - initialComments.length);
    }, [comments, onCommentCountChange]);

    /**
     * Click Outside Effect
     *
     * Registers a document-level mouse event listener
     * to detect clicks outside comment action menus.
     *
     * If the clicked element is not inside an element
     * containing the data-comment-menu attribute,
     * the currently open comment menu is closed.
     *
     * The event listener is removed when the
     * component unmounts.
     */
    useEffect(() => {

        /**
         * handleClickOutside
         *
         * Determines whether a mouse click occurred
         * outside a comment action menu.
         *
         * @param event - Native mouse event.
         * @returns void
         */
        function handleClickOutside(event: MouseEvent) {
            const target = event.target;

            // Ignore events whose targets are not HTML elements.
            if (!(target instanceof HTMLElement)) return;

            // Close the menu when clicking outside its container.
            if (!target.closest("[data-comment-menu]")) {
                setOpenCommentMenu(null);
            }
        }

        // Listen for mouse clicks anywhere in the document.
        document.addEventListener("mousedown", handleClickOutside);

        // Remove the event listener when the component unmounts.
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    /**
     * handleComment
     *
     * Creates a new top-level comment using the
     * submitted HTML content and attachments.
     *
     * Generates a timestamp-based ID and assigns
     * mock information for the current user.
     *
     * The new comment is appended to the
     * existing comments array.
     *
     * @param html - HTML-formatted comment content.
     * @param attachments - Files attached to the comment.
     * @returns void
     */
    function handleComment(
        html: string,
        attachments: CommentAttachment[]
    ) {
        setComments((previous) => [
            ...previous,
            {
                id: Date.now(),
                authorId: 1,
                name: "You",
                course: "CCS Student",
                text: html,
                time: "Just now",
                likes: 0,
                replies: [],
                attachments,
            },
        ]);
    }

    /**
     * handleLikeComment
     *
     * Toggles the current user's liked state
     * for a specific comment.
     *
     * If the comment ID already exists in the
     * likedComments Set, it is removed.
     *
     * Otherwise, the comment ID is added.
     *
     * A new Set is created to ensure React
     * detects the state update.
     *
     * @param commentId - ID of the comment being liked or unliked.
     * @returns void
     */
    function handleLikeComment(commentId: number) {
        setLikedComments((previous) => {

            // Create a new Set to avoid mutating existing state.
            const updated = new Set(previous);

            // Toggle whether the comment is liked.
            if (updated.has(commentId)) {
                updated.delete(commentId);
            } else {
                updated.add(commentId);
            }

            return updated;
        });
    }

    /**
     * handleReply
     *
     * Adds a reply to an existing top-level comment.
     *
     * Prevents empty or whitespace-only replies
     * from being submitted.
     *
     * Searches for the matching comment ID and
     * appends a new reply to its replies array.
     *
     * The submitted reply text is escaped before
     * being wrapped in an HTML paragraph.
     *
     * This prevents user-entered HTML characters
     * from being interpreted as HTML markup.
     *
     * @param commentId - ID of the comment receiving the reply.
     * @param text - Plain-text content of the reply.
     * @returns void
     */
    function handleReply(commentId: number, text: string) {

        // Prevent empty or whitespace-only replies.
        if (!text.trim()) return;

        // Update the matching top-level comment.
        setComments((previous) =>
            previous.map((comment) => {

                // Leave unrelated comments unchanged.
                if (comment.id !== commentId) return comment;

                return {
                    ...comment,
                    
                    replies: [
                        ...comment.replies,
                        {
                            id: Date.now(),
                            authorId: 1,
                            name: "You",
                            course: "CCS Student",
                            text: `<p>${text
                                .trim()
                                .replaceAll("&", "&amp;")
                                .replaceAll("<", "&lt;")
                                .replaceAll(">", "&gt;")}</p>`,
                            time: "Just now",
                            likes: 0,
                            replies: [],
                        },
                    ],
                };
            })
        );
    }

    /**
     * toggleReplies
     *
     * Expands or collapses the replies associated
     * with a specific comment.
     *
     * If the comment ID is already in the
     * collapsedReplies Set, it is removed.
     *
     * Otherwise, the comment ID is added.
     *
     * @param commentId - ID of the comment whose replies are toggled.
     * @returns void
     */
    function toggleReplies(commentId: number) {
        setCollapsedReplies((previous) => {

            // Create a new Set to preserve state immutability.
            const updated = new Set(previous);

            // Toggle the comment's collapsed state.
            if (updated.has(commentId)) {
                updated.delete(commentId);
            } else {
                updated.add(commentId);
            }

            return updated;
        });
    }

    /**
     * handleCommentImageClick
     *
     * Handles clicks on images inside a comment.
     *
     * Checks whether the clicked element is an image.
     * If so, retrieves all images inside the clicked
     * comment's image container.
     *
     * Determines which image was clicked and opens
     * the image preview at the corresponding index.
     *
     * @param event - React mouse event from the image container.
     * @returns void
     */
    function handleCommentImageClick(
        event: ReactMouseEvent<HTMLDivElement>
    ) {
        const target = event.target;

        // Ignore clicks that are not directly on an image.
        if (!(target instanceof HTMLImageElement)) return;

        // Retrieve all images within the clicked container.
        const images = Array.from(
            event.currentTarget.querySelectorAll("img")
        );

        // Determine the index of the clicked image.
        const initialIndex = images.indexOf(target);

        // Ignore the event if the clicked image is not found.
        if (initialIndex === -1) return;

        // Open the image preview with the selected image.
        setCommentImagePreview({
            images: images.map((image) => image.src),
            initialIndex,
        });
    }

    return (
        <>
            {/*
             * Comment Editor:
             * Displays the interface for creating new comments.
             *
             * When a comment is submitted, CommentEditor
             * passes its HTML content and attachments
             * to handleComment.
             */}
            <CommentEditor onSubmit={handleComment} />

            {/*
             * Comments List:
             * Displays all top-level comments.
             *
             * Each comment is rendered through CommentItem,
             * which receives the comment's data, current
             * interaction states, and event handlers.
             */}
            <div className="mt-7 space-y-7">
                {comments.map((item) => (
                    <CommentItem
                        key={item.id}

                        // Current comment data.
                        comment={item}

                        // Whether the current user has liked this comment.
                        isLiked={likedComments.has(item.id)}

                        // Whether this comment's replies are collapsed.
                        isCollapsed={collapsedReplies.has(item.id)}

                        // Whether this comment's reply editor is active.
                        isReplying={replyingTo === item.id}

                        // Current reply input text.
                        replyText={replyText}

                        // Whether this comment's action menu is open.
                        isMenuOpen={openCommentMenu === item.id}

                        // Toggle the comment's liked state.
                        onLike={handleLikeComment}

                        // Open or close the reply editor for this comment.
                        onToggleReply={(commentId) => {
                            setReplyingTo((previous) =>
                                previous === commentId ? null : commentId
                            );
                        }}

                        // Expand or collapse this comment's replies.
                        onToggleCollapse={toggleReplies}

                        // Update the current reply text.
                        onReplyTextChange={setReplyText}

                        // Submit a reply and reset the reply editor.
                        onSubmitReply={(commentId) => {
                            handleReply(commentId, replyText);
                            setReplyText("");
                            setReplyingTo(null);
                        }}

                        // Forward comment sharing to the parent component.
                        onShare={onShare}

                        // Toggle the comment's action menu.
                        onToggleMenu={(commentId) => {
                            onOpenCommentMenu?.();

                            setOpenCommentMenu((previous) =>
                                previous === commentId ? null : commentId
                            );
                        }}

                        // Close the menu and open the report interface.
                        onReport={() => {
                            setOpenCommentMenu(null);
                            onReport();
                        }}

                        // Open the image preview when an image is clicked.
                        onImageClick={handleCommentImageClick}
                    />
                ))}
            </div>

            {/*
             * Comment Image Preview:
             * Displays the image preview only when
             * commentImagePreview contains image data.
             *
             * Receives the image URLs and the index
             * of the image initially selected.
             *
             * Closing the preview resets its state to null.
             */}
            {commentImagePreview !== null && (
                <ImagePreview
                    images={commentImagePreview.images}
                    initialIndex={commentImagePreview.initialIndex}
                    alt="Comment attachment"
                    onClose={() => setCommentImagePreview(null)}
                />
            )}
        </>
    );
}