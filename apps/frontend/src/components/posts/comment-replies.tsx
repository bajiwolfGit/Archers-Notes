"use client";

import Image from "next/image";
import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";

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
        <div className="relative mt-3">
            {/* Thread line */}
            {replies.length > 0 && !isCollapsed && (
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-0 left-[9px] top-8 w-[2px] bg-gray-200"
                />
            )}

            {/* Reply controls */}
            <div className="flex items-center gap-3">
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

            {/* Reply input */}
            {isReplying && (
                <div className="relative z-10 mt-3 ml-9 flex gap-2">
                    <input
                        type="text"
                        value={replyText}
                        onChange={(event) =>
                            onReplyTextChange(event.target.value)
                        }
                        placeholder="Write a reply..."
                        className="min-w-0 flex-1 rounded border border-gray-300 px-3 py-2 text-xs outline-none focus:border-[#00A651]"
                    />

                    <button
                        type="button"
                        onClick={() => onSubmitReply(commentId)}
                        className="rounded bg-[#00A651] px-3 py-2 text-xs text-white"
                    >
                        Reply
                    </button>
                </div>
            )}

            {/* Nested replies */}
            {replies.length > 0 && !isCollapsed && (
                <div className="relative mt-3 pl-9">
                    {replies.map((reply) => (
                        <div
                            key={reply.id}
                            className="mb-5 flex gap-2 last:mb-0"
                        >
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

                            <div>
                                <div className="flex items-center gap-4">
                                    <div>
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

                                        <p className="text-[10px] text-gray-600">
                                            {reply.course}
                                        </p>
                                    </div>

                                    <span className="text-[10px] text-gray-500">
                                        {reply.time}
                                    </span>
                                </div>

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