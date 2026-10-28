"use client";

import { useEffect, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";

import CommentItem, {
    type Comment,
} from "@/components/posts/comment-item";

import CommentEditor, {
    type CommentAttachment,
} from "@/components/posts/comment-editor";

import ImagePreview from "@/components/ui/image-preview";

interface PostCommentsProps {
    onShare: (commentId: number) => void;
    onReport: () => void;
    onCommentCountChange: (count: number) => void;
    onOpenCommentMenu?: () => void;
}

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

export default function PostComments({
    onShare,
    onReport,
    onCommentCountChange,
    onOpenCommentMenu,
}: PostCommentsProps) {
    const [comments, setComments] = useState<Comment[]>(initialComments);

    const [likedComments, setLikedComments] = useState<Set<number>>(
        () => new Set()
    );

    const [replyingTo, setReplyingTo] = useState<number | null>(null);
    const [replyText, setReplyText] = useState("");

    const [collapsedReplies, setCollapsedReplies] = useState<Set<number>>(
        () => new Set()
    );

    const [openCommentMenu, setOpenCommentMenu] = useState<number | null>(
        null
    );

    const [commentImagePreview, setCommentImagePreview] = useState<{
        images: string[];
        initialIndex: number;
    } | null>(null);

    useEffect(() => {
        onCommentCountChange(comments.length - initialComments.length);
    }, [comments, onCommentCountChange]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target;

            if (!(target instanceof HTMLElement)) return;

            if (!target.closest("[data-comment-menu]")) {
                setOpenCommentMenu(null);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

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

    function handleLikeComment(commentId: number) {
        setLikedComments((previous) => {
            const updated = new Set(previous);

            if (updated.has(commentId)) {
                updated.delete(commentId);
            } else {
                updated.add(commentId);
            }

            return updated;
        });
    }

    function handleReply(commentId: number, text: string) {
        if (!text.trim()) return;

        setComments((previous) =>
            previous.map((comment) => {
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

    function toggleReplies(commentId: number) {
        setCollapsedReplies((previous) => {
            const updated = new Set(previous);

            if (updated.has(commentId)) {
                updated.delete(commentId);
            } else {
                updated.add(commentId);
            }

            return updated;
        });
    }

    function handleCommentImageClick(
        event: ReactMouseEvent<HTMLDivElement>
    ) {
        const target = event.target;

        if (!(target instanceof HTMLImageElement)) return;

        const images = Array.from(
            event.currentTarget.querySelectorAll("img")
        );

        const initialIndex = images.indexOf(target);

        if (initialIndex === -1) return;

        setCommentImagePreview({
            images: images.map((image) => image.src),
            initialIndex,
        });
    }

    return (
        <>
            <CommentEditor onSubmit={handleComment} />

            <div className="mt-7 space-y-7">
                {comments.map((item) => (
                    <CommentItem
                        key={item.id}
                        comment={item}
                        isLiked={likedComments.has(item.id)}
                        isCollapsed={collapsedReplies.has(item.id)}
                        isReplying={replyingTo === item.id}
                        replyText={replyText}
                        isMenuOpen={openCommentMenu === item.id}
                        onLike={handleLikeComment}
                        onToggleReply={(commentId) => {
                            setReplyingTo((previous) =>
                                previous === commentId ? null : commentId
                            );
                        }}
                        onToggleCollapse={toggleReplies}
                        onReplyTextChange={setReplyText}
                        onSubmitReply={(commentId) => {
                            handleReply(commentId, replyText);
                            setReplyText("");
                            setReplyingTo(null);
                        }}
                        onShare={onShare}
                        onToggleMenu={(commentId) => {
                            onOpenCommentMenu?.();

                            setOpenCommentMenu((previous) =>
                                previous === commentId ? null : commentId
                            );
                        }}
                        onReport={() => {
                            setOpenCommentMenu(null);
                            onReport();
                        }}
                        onImageClick={handleCommentImageClick}
                    />
                ))}
            </div>

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