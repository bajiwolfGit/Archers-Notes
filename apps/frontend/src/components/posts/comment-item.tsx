/**
 * File: components/posts/comment-item.tsx
 *
 * Description:
 * Provides a reusable component for displaying individual
 * comments in the Archer's Notes application.
 *
 * Displays comment author information, HTML-formatted content,
 * attachments, engagement statistics, and interaction controls.
 *
 * Features:
 * - Displays the comment author's profile information.
 * - Supports navigation to the author's profile page.
 * - Renders sanitized HTML comment content.
 * - Displays file attachments associated with comments.
 * - Allows users to like and unlike comments.
 * - Displays the number of replies.
 * - Supports sharing individual comments.
 * - Provides a dropdown menu for reporting comments.
 * - Displays nested replies through CommentReplies.
 * - Supports opening image previews from comment content.
 * - Uses callback functions to communicate interactions
 *   to the parent component.
 */

"use client";

// React mouse event type used for handling clicks on comment images.
import type { MouseEvent } from "react";

// Next.js component for optimized image rendering.
import Image from "next/image";

// Next.js component for client-side navigation.
import Link from "next/link";

// Library for sanitizing HTML content before rendering.
import DOMPurify from "isomorphic-dompurify";


// Component responsible for displaying and managing comment replies.
import CommentReplies from "@/components/posts/comment-replies";

// Type representing files attached through the comment editor.
import type { CommentAttachment } from "@/components/posts/comment-editor";

/**
 * Comment Interface
 *
 * Defines the structure of a comment object.
 *
 * @property id - Unique identifier of the comment.
 * @property authorId - Unique identifier of the comment author.
 * @property name - Display name of the author.
 * @property course - Course or academic information of the author.
 * @property text - HTML-formatted comment content.
 * @property time - Relative time when the comment was posted.
 * @property likes - Number of likes received by the comment.
 * @property replies - Array of replies associated with the comment.
 * @property attachments - Optional array of attached files.
 *
 * The recursive replies property allows comments
 * to contain other Comment objects as replies.
 *
 * This interface is exported so it can be reused
 * by other components, such as PostComments.
 */
export interface Comment {
    id: number;
    authorId: number;
    name: string;
    course: string;
    text: string;
    time: string;
    likes: number;
    replies: Comment[];
    attachments?: CommentAttachment[];
}

/**
 * CommentItemProps Interface
 *
 * Defines the properties required by the CommentItem component.
 *
 * Comment Data:
 * @property comment - Comment object containing the information
 *                     displayed by the component.
 *
 * Interaction States:
 * @property isLiked - Whether the current user has liked the comment.
 * @property isCollapsed - Whether the comment's replies are hidden.
 * @property isReplying - Whether the reply input is visible.
 * @property replyText - Current text entered into the reply input.
 * @property isMenuOpen - Whether the comment's options menu is open.
 *
 * Callback Functions:
 * @property onLike - Toggles the liked state of a comment.
 * @property onToggleReply - Opens or closes the reply input.
 * @property onToggleCollapse - Expands or collapses replies.
 * @property onReplyTextChange - Updates the reply input text.
 * @property onSubmitReply - Submits a reply to the comment.
 * @property onShare - Initiates sharing for the comment.
 * @property onToggleMenu - Opens or closes the comment options menu.
 * @property onReport - Initiates the reporting process.
 * @property onImageClick - Handles clicks on images within the comment.
 */
interface CommentItemProps {
    comment: Comment;
    isLiked: boolean;
    isCollapsed: boolean;
    isReplying: boolean;
    replyText: string;
    isMenuOpen: boolean;

    onLike: (commentId: number) => void;
    onToggleReply: (commentId: number) => void;
    onToggleCollapse: (commentId: number) => void;
    onReplyTextChange: (text: string) => void;
    onSubmitReply: (commentId: number) => void;
    onShare: (commentId: number) => void;
    onToggleMenu: (commentId: number) => void;
    onReport: () => void;
    onImageClick: (event: MouseEvent<HTMLDivElement>) => void;
}

/**
 * CommentItem Component
 *
 * Displays an individual comment and its associated
 * interaction controls.
 *
 * The component receives comment data and interaction
 * states from its parent component.
 *
 * It does not maintain its own React state.
 *
 * Instead, user interactions are communicated to
 * the parent through callback functions.
 *
 * The component also renders CommentReplies to
 * display and manage replies associated with
 * the current comment.
 *
 * @param comment - Comment information to display.
 * @param isLiked - Whether the comment is liked.
 * @param isCollapsed - Whether replies are collapsed.
 * @param isReplying - Whether the reply input is visible.
 * @param replyText - Current reply input text.
 * @param isMenuOpen - Whether the options menu is open.
 * @param onLike - Callback for liking or unliking the comment.
 * @param onToggleReply - Callback for toggling the reply input.
 * @param onToggleCollapse - Callback for toggling reply visibility.
 * @param onReplyTextChange - Callback for updating reply text.
 * @param onSubmitReply - Callback for submitting a reply.
 * @param onShare - Callback for sharing the comment.
 * @param onToggleMenu - Callback for toggling the options menu.
 * @param onReport - Callback for reporting the comment.
 * @param onImageClick - Callback for handling comment image clicks.
 * @returns The rendered comment and its interaction controls.
 */
export default function CommentItem({
    comment,
    isLiked,
    isCollapsed,
    isReplying,
    replyText,
    isMenuOpen,
    onLike,
    onToggleReply,
    onToggleCollapse,
    onReplyTextChange,
    onSubmitReply,
    onShare,
    onToggleMenu,
    onReport,
    onImageClick,
}: CommentItemProps) {

    /**
     * Profile Navigation
     *
     * Determines the destination URL for the
     * comment author's profile.
     *
     * If authorId is 1, the author is treated
     * as the currently logged-in user.
     *
     * Otherwise, the URL includes the author's ID
     * to navigate to another user's profile.
     */
    const profileHref =
        comment.authorId === 1
            ? "/profile"
            : `/profile/${comment.authorId}`;

    return (

        /*
         * Comment Container:
         * Wraps the entire comment and its replies.
         *
         * The ID allows the comment to be targeted
         * directly through a URL fragment.
         *
         * scroll-mt-24 provides spacing when
         * scrolling to the comment using its ID.
         */
        <div
            id={`comment-${comment.id}`}
            className="scroll-mt-24"
        >
            {/*
             * Comment Layout:
             * Uses Flexbox to position the author's
             * profile picture beside the comment content.
             */}
            <div className="flex items-start gap-3">

                {/*
                 * Profile Picture:
                 * Displays the author's profile icon.
                 *
                 * Clicking the image navigates to
                 * the author's profile page.
                 *
                 * The destination is determined
                 * by the profileHref variable.
                 */}
                <Link
                    href={profileHref}
                    aria-label={`View ${comment.name}'s profile`}
                    className="shrink-0"
                >
                    <Image
                        src="/assets/icons/profile.svg"
                        alt=""
                        width={32}
                        height={32}
                        className="h-8 w-8"
                    />
                </Link>

                {/*
                 * Comment Information Container:
                 * Contains the author's information,
                 * comment content, attachments,
                 * interaction buttons, and replies.
                 *
                 * flex-1 allows the content to occupy
                 * the remaining available width.
                 */}
                <div className="min-w-0 flex-1">

                    {/*
                     * Comment Header:
                     * Displays the author's name,
                     * course, and posting time.
                     */}
                    <div className="flex items-center gap-4">
                        <div>

                            {/*
                             * Author Name:
                             * Displays the author's name
                             * as a link to their profile.
                             */}
                            <Link
                                href={profileHref}
                                className="text-xs font-semibold hover:underline"
                            >
                                {comment.name}
                            </Link>

                            {/*
                             * Author Course:
                             * Displays the course or
                             * academic information
                             * associated with the author.
                             */}
                            <p className="text-[10px] text-gray-600">
                                {comment.course}
                            </p>
                        </div>

                        {/*
                         * Comment Timestamp:
                         * Displays the relative time
                         * when the comment was posted.
                         */}
                        <span className="text-[10px] text-gray-500">
                            {comment.time}
                        </span>
                    </div>

                    {/*
                     * Comment Content:
                     * Displays the HTML-formatted comment.
                     *
                     * DOMPurify sanitizes the HTML before
                     * it is rendered through
                     * dangerouslySetInnerHTML.
                     *
                     * This helps prevent unsafe HTML
                     * from being injected into the page.
                     *
                     * The onImageClick callback handles
                     * clicks on images inside the comment.
                     *
                     * Tailwind selectors provide styling
                     * for paragraphs, bold text, italic
                     * text, and embedded images.
                     */}
                    <div
                        onClick={onImageClick}
                        className="comment-content mt-3 break-words text-[11px] leading-relaxed [&_p]:whitespace-pre-wrap [&_strong]:font-bold [&_em]:italic [&_img]:cursor-zoom-in"
                        dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(comment.text),
                        }}
                    />

                    {/*
                     * Comment Attachments:
                     * Displays files attached to the comment.
                     *
                     * Optional chaining ensures the list
                     * is only processed when attachments exist.
                     *
                     * Each attachment displays its filename.
                     *
                     * The attachment ID is used as
                     * the React key.
                     */}
                    {comment.attachments?.map((attachment) => (
                        <div
                            key={attachment.id}
                            className="mt-2 rounded border border-gray-200 bg-gray-50 px-3 py-2"
                        >
                            <p className="text-xs">
                                {attachment.file.name}
                            </p>
                        </div>
                    ))}

                    {/*
                     * Comment Actions:
                     * Contains the controls for liking,
                     * replying, sharing, and reporting
                     * the current comment.
                     */}
                    <div className="mt-4 flex items-center gap-7">

                        {/*
                         * Like Button:
                         * Allows the current user to like
                         * or unlike the comment.
                         *
                         * Calls onLike with the comment ID.
                         *
                         * Displays a different icon depending
                         * on the current liked state.
                         *
                         * The displayed count adds one
                         * when isLiked is true.
                         *
                         * aria-pressed communicates the
                         * current liked state to
                         * assistive technologies.
                         */}
                        <button
                            type="button"
                            onClick={() => onLike(comment.id)}
                            aria-pressed={isLiked}
                            className="flex items-center gap-2"
                        >
                            <Image
                                src={
                                    isLiked
                                        ? "/assets/icons/like-active.svg"
                                        : "/assets/icons/like.svg"
                                }
                                alt=""
                                width={25}
                                height={23}
                            />

                            <span className="text-xs">
                                {comment.likes + (isLiked ? 1 : 0)}
                            </span>
                        </button>

                        {/*
                         * Reply Count Button:
                         * Displays the number of replies
                         * associated with the comment.
                         *
                         * Clicking the button toggles
                         * the reply input through
                         * onToggleReply.
                         *
                         * The displayed number comes
                         * from the replies array length.
                         */}
                        <button
                            type="button"
                            onClick={() => onToggleReply(comment.id)}
                            className="flex items-center gap-2"
                        >
                            <Image
                                src="/assets/icons/comment.svg"
                                alt=""
                                width={23}
                                height={23}
                            />

                            <span className="text-xs">
                                {comment.replies.length}
                            </span>
                        </button>

                        {/*
                         * Share Button:
                         * Allows users to share
                         * the current comment.
                         *
                         * Calls onShare with the
                         * comment's unique ID.
                         *
                         * The parent component handles
                         * the actual sharing behavior.
                         */}
                        <button
                            type="button"
                            onClick={() => onShare(comment.id)}
                            aria-label="Share comment"
                            title="Share comment"
                            className="cursor-pointer"
                        >
                            <Image
                                src="/assets/icons/share.svg"
                                alt=""
                                width={23}
                                height={23}
                            />
                        </button>

                        {/*
                         * More Options:
                         * Contains the comment's
                         * additional action menu.
                         *
                         * The data-comment-menu attribute
                         * allows the parent component to
                         * detect clicks outside the menu.
                         */}
                        <div
                            className="relative"
                            data-comment-menu
                        >

                            {/*
                             * More Options Button:
                             * Opens or closes the
                             * comment action menu.
                             *
                             * Calls onToggleMenu with
                             * the comment ID.
                             *
                             * aria-expanded communicates
                             * whether the menu is open.
                             */}
                            <button
                                type="button"
                                onClick={() => onToggleMenu(comment.id)}
                                aria-label="More comment options"
                                aria-expanded={isMenuOpen}
                            >
                                <Image
                                    src="/assets/icons/more.svg"
                                    alt=""
                                    width={23}
                                    height={6}
                                />
                            </button>

                            {/*
                             * Comment Options Dropdown:
                             * Appears only when isMenuOpen
                             * is true.
                             *
                             * Currently provides a
                             * Report action.
                             */}
                            {isMenuOpen && (
                                <div className="absolute right-0 top-full z-30 mt-2 w-[120px] rounded-md border border-gray-200 bg-white py-1 shadow-md">
                                    
                                    {/*
                                     * Report Button:
                                     * Calls onReport to initiate
                                     * the reporting process.
                                     *
                                     * The parent component is
                                     * responsible for displaying
                                     * the report interface.
                                     */}
                                    <button
                                        type="button"
                                        onClick={onReport}
                                        className="w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-gray-50"
                                    >
                                        Report
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/*
                     * Comment Replies:
                     * Displays the replies associated
                     * with the current comment.
                     *
                     * Passes the comment's reply data,
                     * interaction states, and callback
                     * functions to CommentReplies.
                     *
                     * CommentReplies handles the visual
                     * presentation of replies and the
                     * reply input interface.
                     */}
                    <CommentReplies
                        commentId={comment.id}
                        replies={comment.replies}
                        isCollapsed={isCollapsed}
                        isReplying={isReplying}
                        replyText={replyText}
                        onToggleCollapse={onToggleCollapse}
                        onToggleReply={onToggleReply}
                        onReplyTextChange={onReplyTextChange}
                        onSubmitReply={onSubmitReply}
                    />
                </div>
            </div>
        </div>
    );
}