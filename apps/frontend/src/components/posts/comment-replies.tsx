/**
 * File: components/posts/comment-replies.tsx
 *
 * Description:
 * Provides a reusable component for displaying and managing
 * replies associated with comments in the Archer's Notes
 * application.
 *
 * Allows users to view existing replies, expand or collapse
 * reply threads, and submit new replies.
 *
 * Features:
 * - Displays replies associated with a parent comment.
 * - Allows users to expand or collapse reply threads.
 * - Provides an input field for writing new replies.
 * - Displays author information and relative posting times.
 * - Supports navigation to reply authors' profiles.
 * - Displays a visual thread line connecting replies.
 * - Sanitizes HTML content before rendering.
 * - Uses callback functions to communicate user actions
 *   to the parent component.
 */

"use client";

// Next.js component for optimized image rendering.
import Image from "next/image";

// Next.js component for client-side navigation.
import Link from "next/link";

// Library for sanitizing HTML content before rendering.
import DOMPurify from "isomorphic-dompurify";

/**
 * Reply Interface
 *
 * Defines the structure of a reply object.
 *
 * @property id - Unique identifier of the reply.
 * @property authorId - Unique identifier of the reply author.
 * @property name - Display name of the reply author.
 * @property course - Course or academic information of the author.
 * @property text - HTML-formatted content of the reply.
 * @property time - Relative time when the reply was posted.
 * @property likes - Number of likes received by the reply.
 * @property replies - Array of nested replies.
 *
 * The recursive replies property allows a reply
 * to contain additional replies.
 */
interface Reply {
    id: number;
    authorId: number;
    name: string;
    course: string;
    text: string;
    time: string;
    likes: number;
    replies: Reply[];
}

/**
 * CommentRepliesProps Interface
 *
 * Defines the properties required by the CommentReplies component.
 *
 * @property commentId - ID of the parent comment.
 * @property replies - Array of replies associated with the comment.
 * @property isCollapsed - Determines whether replies are hidden.
 * @property isReplying - Determines whether the reply input is visible.
 * @property replyText - Current text entered into the reply input.
 * @property onToggleCollapse - Callback for expanding or collapsing replies.
 * @property onToggleReply - Callback for showing or hiding the reply input.
 * @property onReplyTextChange - Callback for updating the reply input text.
 * @property onSubmitReply - Callback for submitting a reply.
 */
interface CommentRepliesProps {
    commentId: number;
    replies: Reply[];
    isCollapsed: boolean;
    isReplying: boolean;
    replyText: string;
    onToggleCollapse: (commentId: number) => void;
    onToggleReply: (commentId: number) => void;
    onReplyTextChange: (text: string) => void;
    onSubmitReply: (commentId: number) => void;
}

/**
 * CommentReplies Component
 *
 * Displays and manages the replies associated
 * with a specific parent comment.
 *
 * The component receives reply data and interaction
 * states from its parent component.
 *
 * It does not maintain its own React state.
 *
 * Instead, it uses callback functions to notify
 * the parent when users:
 * - Expand or collapse replies.
 * - Open or close the reply input.
 * - Enter reply text.
 * - Submit a reply.
 *
 * Existing replies are displayed with author information,
 * profile links, posting times, and sanitized HTML content.
 *
 * @param commentId - ID of the parent comment.
 * @param replies - Replies belonging to the parent comment.
 * @param isCollapsed - Whether the replies are collapsed.
 * @param isReplying - Whether the reply input is displayed.
 * @param replyText - Current reply input value.
 * @param onToggleCollapse - Function for toggling reply visibility.
 * @param onToggleReply - Function for toggling the reply input.
 * @param onReplyTextChange - Function for updating reply text.
 * @param onSubmitReply - Function for submitting a reply.
 * @returns The reply controls, input, and existing replies.
 */
export default function CommentReplies({
    commentId,
    replies,
    isCollapsed,
    isReplying,
    replyText,
    onToggleCollapse,
    onToggleReply,
    onReplyTextChange,
    onSubmitReply,
}: CommentRepliesProps) {
    return (

        /*
         * Replies Container:
         * Wraps the reply controls, reply input,
         * and existing nested replies.
         *
         * Relative positioning allows the visual
         * thread line to be positioned inside it.
         */
        <div className="relative mt-3">
            
            {/*
             * Thread Line:
             * Displays a vertical line connecting
             * the parent comment to its replies.
             *
             * Only appears when:
             * - At least one reply exists.
             * - The replies are not collapsed.
             *
             * The line is decorative and hidden
             * from assistive technologies.
             *
             * pointer-events-none prevents the line
             * from interfering with user interactions.
             */}
            {replies.length > 0 && !isCollapsed && (
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-0 left-[9px] top-8 w-[2px] bg-gray-200"
                />
            )}

            {/*
             * Reply Controls:
             * Contains the expand/collapse button
             * and the button for writing a reply.
             */}
            <div className="flex items-center gap-3">

                {/*
                 * Expand / Collapse Button:
                 * Appears only when the parent comment
                 * contains at least one reply.
                 *
                 * Clicking the button calls onToggleCollapse
                 * with the parent comment's ID.
                 *
                 * Displays:
                 * - "+" when replies are collapsed.
                 * - "−" when replies are expanded.
                 *
                 * aria-expanded communicates the current
                 * expanded state to assistive technologies.
                 */}
                {replies.length > 0 && (
                    <button
                        type="button"
                        onClick={() => onToggleCollapse(commentId)}
                        aria-expanded={!isCollapsed}
                        aria-label={
                            isCollapsed ? "Expand replies" : "Collapse replies"
                        }
                        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-gray-300 text-gray-400"
                    >
                        <span className="text-sm leading-none">
                            {isCollapsed ? "+" : "−"}
                        </span>
                    </button>
                )}

                {/*
                 * Reply Button:
                 * Allows users to open or close
                 * the reply input field.
                 *
                 * Calls onToggleReply with the
                 * parent comment's ID.
                 *
                 * Displays a reply icon alongside
                 * the "Reply" label.
                 */}
                <button
                    type="button"
                    onClick={() => onToggleReply(commentId)}
                    className="inline-flex items-center gap-2 text-[11px] text-gray-400 hover:text-[#00A651]"
                >
                    <Image
                        src="/assets/icons/reply.svg"
                        alt=""
                        width={16}
                        height={14}
                        className="shrink-0"
                    />
                    <span>Reply</span>
                </button>
            </div>

            {/*
             * Reply Input:
             * Displays the reply input field and
             * submission button when isReplying is true.
             *
             * The input is controlled by the parent
             * component through replyText and
             * onReplyTextChange.
             */}
            {isReplying && (
                <div className="relative z-10 mt-3 ml-9 flex gap-2">

                    {/*
                     * Reply Text Input:
                     * Allows users to enter a reply.
                     *
                     * Each change is forwarded to the
                     * parent component through
                     * onReplyTextChange.
                     */}
                    <input
                        type="text"
                        value={replyText}
                        onChange={(event) =>
                            onReplyTextChange(event.target.value)
                        }
                        placeholder="Write a reply..."
                        className="min-w-0 flex-1 rounded border border-gray-300 px-3 py-2 text-xs outline-none focus:border-[#00A651]"
                    />

                    {/*
                     * Submit Reply Button:
                     * Calls onSubmitReply with the
                     * parent comment's ID.
                     *
                     * The parent component is responsible
                     * for validating, storing, and displaying
                     * the newly submitted reply.
                     */}
                    <button
                        type="button"
                        onClick={() => onSubmitReply(commentId)}
                        className="rounded bg-[#00A651] px-3 py-2 text-xs text-white"
                    >
                        Reply
                    </button>
                </div>
            )}

            {/*
             * Nested Replies:
             * Displays the existing replies associated
             * with the parent comment.
             *
             * Only appears when:
             * - At least one reply exists.
             * - The replies are not collapsed.
             *
             * Each reply displays its author's profile,
             * name, course, posting time, and content.
             */}
            {replies.length > 0 && !isCollapsed && (
                <div className="relative mt-3 pl-9">

                    {/*
                     * Reply List:
                     * Iterates through the replies array
                     * and renders each reply individually.
                     *
                     * The reply ID is used as the React key.
                     */}
                    {replies.map((reply) => (
                        <div
                            key={reply.id}
                            className="mb-5 flex gap-2 last:mb-0"
                        >
                            {/*
                             * Author Profile Image Link:
                             * Displays a profile icon that
                             * links to the reply author's profile.
                             *
                             * If authorId is 1, the link
                             * points to the current user's profile.
                             *
                             * Otherwise, it points to the
                             * corresponding user's profile page.
                             */}
                            <Link
                                href={
                                    reply.authorId === 1
                                        ? "/profile"
                                        : `/profile/${reply.authorId}`
                                }
                                aria-label={`View ${reply.name}'s profile`}
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
                             * Reply Information:
                             * Contains the author's name,
                             * course, posting time, and
                             * reply content.
                             */}
                            <div>

                                {/*
                                 * Author Information Header:
                                 * Displays the reply author's
                                 * name, course, and posting time.
                                 */}
                                <div className="flex items-center gap-4">
                                    <div>

                                        {/*
                                         * Author Name Link:
                                         * Allows users to navigate
                                         * to the author's profile.
                                         *
                                         * Uses the same routing
                                         * logic as the profile image.
                                         */}
                                        <Link
                                            href={
                                                reply.authorId === 1
                                                    ? "/profile"
                                                    : `/profile/${reply.authorId}`
                                            }
                                            className="text-xs font-semibold hover:underline"
                                        >
                                            {reply.name}
                                        </Link>

                                        {/*
                                         * Author Course:
                                         * Displays the course or
                                         * academic information
                                         * associated with the author.
                                         */}
                                        <p className="text-[10px] text-gray-600">
                                            {reply.course}
                                        </p>
                                    </div>

                                    {/*
                                     * Reply Timestamp:
                                     * Displays the relative time
                                     * when the reply was posted.
                                     */}
                                    <span className="text-[10px] text-gray-500">
                                        {reply.time}
                                    </span>
                                </div>

                                {/*
                                 * Reply Content:
                                 * Displays the reply's HTML content.
                                 *
                                 * DOMPurify sanitizes the HTML
                                 * before it is rendered through
                                 * dangerouslySetInnerHTML.
                                 *
                                 * This helps prevent unsafe HTML
                                 * from being injected into the page.
                                 *
                                 * Tailwind selectors apply formatting
                                 * to strong and em elements.
                                 */}
                                <div
                                    className="comment-content mt-3 break-words text-[11px] leading-relaxed [&_strong]:font-bold [&_em]:italic"
                                    dangerouslySetInnerHTML={{
                                        __html: DOMPurify.sanitize(reply.text),
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}