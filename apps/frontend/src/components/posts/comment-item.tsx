"use client";

import type { MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";

import CommentReplies from "@/components/posts/comment-replies";
import type { CommentAttachment } from "@/components/posts/comment-editor";

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
    const profileHref =
        comment.authorId === 1
            ? "/profile"
            : `/profile/${comment.authorId}`;

    return (
        <div
            id={`comment-${comment.id}`}
            className="scroll-mt-24"
        >
            <div className="flex items-start gap-3">

                {/* Profile Picture */}
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

                <div className="min-w-0 flex-1">

                    {/* Comment Header */}
                    <div className="flex items-center gap-4">
                        <div>
                            <Link
                                href={profileHref}
                                className="text-xs font-semibold hover:underline"
                            >
                                {comment.name}
                            </Link>

                            <p className="text-[10px] text-gray-600">
                                {comment.course}
                            </p>
                        </div>

                        <span className="text-[10px] text-gray-500">
                            {comment.time}
                        </span>
                    </div>

                    {/* Comment Content */}
                    <div
                        onClick={onImageClick}
                        className="comment-content mt-3 break-words text-[11px] leading-relaxed [&_p]:whitespace-pre-wrap [&_strong]:font-bold [&_em]:italic [&_img]:cursor-zoom-in"
                        dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(comment.text),
                        }}
                    />

                    {/* Attachments */}
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

                    {/* Comment Actions */}
                    <div className="mt-4 flex items-center gap-7">

                        {/* Like */}
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

                        {/* Reply Count */}
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

                        {/* Share */}
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

                        {/* More Options */}
                        <div
                            className="relative"
                            data-comment-menu
                        >
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

                            {isMenuOpen && (
                                <div className="absolute right-0 top-full z-30 mt-2 w-[120px] rounded-md border border-gray-200 bg-white py-1 shadow-md">
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

                    {/* Replies */}
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