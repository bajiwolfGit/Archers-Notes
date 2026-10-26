"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import Image from "next/image";
import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";

import ReportModal from "@/components/posts/report-modal";
import type { Post } from "@/components/home/post-card";
import ImagePreview from "@/components/ui/image-preview";
import CommentEditor, {
    type CommentAttachment,
} from "@/components/ui/comment-editor";

interface Comment {
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

interface PostDetailsProps {
    post: Post;
}

export default function PostDetails({ post }: PostDetailsProps) {
    const isOwner = post.authorId === 1;
    const [isPinned, setIsPinned] = useState(false);
    
    const [replyingTo, setReplyingTo] = useState<number | null>(null);
    const [replyText, setReplyText] = useState("");
    
    const router = useRouter();

    const [likedComments, setLikedComments] = useState<Set<number>>(
        new Set()
    );

    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);

    const [showMoreMenu, setShowMoreMenu] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [openCommentMenu, setOpenCommentMenu] = useState<number | null>(null);

    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
        null
    );

    const [commentImagePreview, setCommentImagePreview] = useState<{
        images: string[];
        initialIndex: number;
    } | null>(null);

    const moreMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;

            if (
                moreMenuRef.current &&
                !moreMenuRef.current.contains(target)
            ) {
                setShowMoreMenu(false);
            }

            if (!target.closest("[data-comment-menu]")) {
                setOpenCommentMenu(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    
    const [comments, setComments] = useState<Comment[]>([
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
    ]);

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

    // Like or unlike a comment
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

    // Add a reply to a comment
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
                            text: `<p>${text.trim().replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")}</p>`,
                            time: "Just now",
                            likes: 0,
                            replies: [],
                        },
                    ],
                };
            })
        );
    }

    function handleCommentImageClick(
        event: React.MouseEvent<HTMLDivElement>
    ) {
        const target = event.target;

        if (!(target instanceof HTMLImageElement)) return;

        const container = event.currentTarget;

        const images = Array.from(
            container.querySelectorAll("img")
        ).map((image) => image.src);

        const initialIndex = Array.from(
            container.querySelectorAll("img")
        ).indexOf(target);

        if (initialIndex === -1) return;

        setCommentImagePreview({
            images,
            initialIndex,
        });
    }

    const images = post.images ?? [];

    const [collapsedReplies, setCollapsedReplies] = useState<Set<number>>(
        new Set()
    );

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

    async function handleShare(commentId?: number) {
        const url = new URL(window.location.href);

        // Include the comment ID when sharing a specific comment
        if (commentId !== undefined) {
            url.hash = `comment-${commentId}`;
        }

        const shareData = {
            title: post.title,
            text: commentId
            ? "Check out this comment on Archers Notes!"
            : `Check out ${post.title} on Archers Notes!`,
            url: url.toString(),
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(shareData.url);
                alert("Link copied to clipboard!");
            }
        } catch (error) {
            // Ignore when the user cancels the share dialog
            if (error instanceof DOMException && error.name === "AbortError") {
                return;
            }

            console.error("Sharing failed:", error);
        }
    }

    const isOwnPost = post.authorId === 1;

    return (
        <>
            {/* Main Post Details Container */}
            <div className="mx-auto w-full max-w-[540px] py-2">

                {/* Back Button + Post Content */}
                <div className="relative">

                    {/* Back Button */}
                    <button
                        type="button"
                        onClick={() => router.back()}
                        aria-label="Go back"
                        className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center"
                    >
                        <Image
                            src="/assets/icons/back.svg"
                            alt=""
                            width={16}
                            height={16}
                        />
                    </button>

                    {/* Post Column */}
                    <div className="ml-12 min-w-0">

                        {/* Post Header */}
                        <div className="flex items-center gap-3">

                            {/* Profile Picture */}
                            <Link
                                href={post.authorId === 1 ? "/profile" : `/profile/${post.authorId}`}
                                aria-label={`View ${post.name}'s profile`}
                                className="shrink-0"
                            >
                                <Image
                                    src="/assets/icons/profile.svg"
                                    alt=""
                                    width={36}
                                    height={36}
                                    className="h-9 w-9 shrink-0"
                                />
                            </Link>
                            

                            {/* Author */}
                            <div>
                                <Link
                                    href={post.authorId === 1 ? "/profile" : `/profile/${post.authorId}`}
                                    className="text-sm font-semibold hover:underline"
                                >
                                    {post.name}
                                </Link>

                                <p className="text-xs">
                                    {post.course}
                                </p>
                            </div>

                            {/* Post Time */}
                            <span className="ml-2 whitespace-nowrap text-xs text-gray-500">
                                {post.time}
                            </span>

                            {/* Post Options */}
                            {isOwner ? (
                                <div className="ml-auto flex items-center gap-3">

                                    {/* Pin Post */}
                                    <button
                                        type="button"
                                        onClick={() => setIsPinned(!isPinned)}
                                        aria-label={isPinned ? "Unpin post" : "Pin post"}
                                        title={isPinned ? "Unpin post" : "Pin post"}
                                        className={`flex h-7 w-7 items-center justify-center transition-opacity hover:opacity-60 ${
                                            isPinned ? "opacity-100" : "opacity-70"
                                        }`}
                                    >
                                        <Image
                                            src="/assets/icons/pin.svg"
                                            alt=""
                                            width={20}
                                            height={20}
                                            className="h-5 w-5 object-contain"
                                        />
                                    </button>

                                    {/* Edit Post */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            // TODO: Open Edit Post modal
                                        }}
                                        aria-label="Edit post"
                                        title="Edit post"
                                        className="flex h-7 w-7 items-center justify-center hover:opacity-60"
                                    >
                                        <Image
                                            src="/assets/icons/edit.svg"
                                            alt=""
                                            width={20}
                                            height={20}
                                            className="h-5 w-5 object-contain"
                                        />
                                    </button>

                                    {/* Delete Post */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            // TODO: Open Delete Post confirmation modal
                                        }}
                                        aria-label="Delete post"
                                        title="Delete post"
                                        className="flex h-7 w-7 items-center justify-center hover:opacity-60"
                                    >
                                        <Image
                                            src="/assets/icons/delete.svg"
                                            alt=""
                                            width={20}
                                            height={20}
                                            className="h-5 w-5 object-contain"
                                        />
                                    </button>

                                </div>
                            ) : (
                                <div ref={moreMenuRef} className="relative ml-auto">

                                    {/* More Options */}
                                    <button
                                        type="button"
                                        onClick={() => setShowMoreMenu(!showMoreMenu)}
                                        aria-label="More options"
                                        aria-expanded={showMoreMenu}
                                        className="flex h-8 w-8 items-center justify-center"
                                    >
                                        <Image
                                            src="/assets/icons/more.svg"
                                            alt=""
                                            width={23}
                                            height={6}
                                        />
                                    </button>

                                    {/* Report Popup */}
                                    {showMoreMenu && (
                                    <div className="absolute right-0 top-full z-50 mt-1 w-[120px] rounded-md border border-gray-200 bg-white py-1 shadow-md">
                                        <button
                                        type="button"
                                        onClick={() => {
                                            setShowMoreMenu(false);
                                            setShowReportModal(true);
                                        }}
                                        className="w-full px-4 py-2 text-center text-xs text-gray-700 hover:bg-gray-50"
                                        >
                                            Report
                                        </button>
                                    </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Post Content */}
                        <div className="ml-9 mt-3">

                            {/* Post Title */}
                            <h2 className="text-sm font-semibold">
                                {post.title}
                            </h2>

                            {/* Post Description */}
                            <p className="mt-4 whitespace-pre-line text-xs leading-relaxed">
                                {post.content}
                            </p>

                            {/* Post Images */}
                            {images.length > 0 && (
                                <div
                                    className={`mt-5 grid w-full gap-2 overflow-hidden rounded-sm ${
                                        images.length === 1
                                        ? "h-[250px] grid-cols-1"
                                        : images.length === 2
                                        ? "h-[220px] grid-cols-2"
                                        : "h-[190px] grid-cols-2 grid-rows-2"
                                    }`}
                                >
                                    {images.slice(0, 3).map((image, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => setSelectedImageIndex(index)}
                                            className={`relative min-h-0 min-w-0 cursor-zoom-in overflow-hidden bg-gray-50 ${
                                                images.length >= 3 && index === 0
                                                ? "row-span-2"
                                                : ""
                                            }`}
                                            aria-label={`View image ${index + 1} of ${images.length}`}
                                        >
                                            <Image
                                                src={image}
                                                alt={`Attachment ${index + 1} for ${post.title}`}
                                                fill
                                                sizes="(max-width: 768px) 50vw, 300px"
                                                className="object-cover"
                                            />

                                            {/* Overlay for Additional Images */}
                                            {images.length > 3 && index === 2 && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                                                    <span className="text-3xl font-semibold text-white">
                                                        +{images.length - 3}
                                                    </span>
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Post Actions */}
                            <div className="mt-5 flex items-center gap-6">

                                {/* Like */}
                                <button
                                    type="button"
                                    onClick={() => setLiked(!liked)}
                                    aria-pressed={liked}
                                    className="flex shrink-0 items-center gap-2"
                                >
                                    <Image
                                        src={
                                        liked
                                            ? "/assets/icons/like-active.svg"
                                            : "/assets/icons/like.svg"
                                        }
                                        alt=""
                                        width={30}
                                        height={27}
                                    />

                                    <span className="text-sm">
                                        {post.likes + (liked ? 1 : 0)}
                                    </span>
                                </button>

                                {/* Comments Count */}
                                <div className="flex shrink-0 items-center gap-2">
                                    <Image
                                        src="/assets/icons/comment.svg"
                                        alt=""
                                        width={25}
                                        height={24}
                                    />

                                    <span className="text-sm">
                                        {post.comments + comments.length - 1}
                                    </span>
                                </div>

                                {/* Bookmark */}
                                <button
                                    type="button"
                                    onClick={() => setSaved(!saved)}
                                    aria-pressed={saved}
                                    aria-label={saved ? "Unsave post" : "Save post"}
                                    className="ml-auto"
                                >
                                    <Image
                                        src={
                                        saved
                                            ? "/assets/icons/bookmark-active.svg"
                                            : "/assets/icons/bookmark.svg"
                                        }
                                        alt=""
                                        width={23}
                                        height={29}
                                    />
                                </button>

                                {/* Share */}
                                <button
                                    type="button"
                                    onClick={() => handleShare()}
                                    aria-label="Share post"
                                    title="Share post"
                                    className="cursor-pointer"
                                >
                                    <Image
                                        src="/assets/icons/share.svg"
                                        alt=""
                                        width={24}
                                        height={24}
                                    />
                                </button>
                            </div>

                            {/* Comment Input - Tiptap Editor */}
                            <CommentEditor onSubmit={handleComment} />

                            {/* Comments Section */}
                            <div className="mt-7 space-y-7">
                                {comments.map((item) => {
                                    const isLiked = likedComments.has(item.id);

                                    return (
                                        <div
                                            key={item.id}
                                            id={`comment-${item.id}`}
                                            className="scroll-mt-24"
                                        >

                                            {/* Comment Header */}
                                            <div className="flex items-start gap-3">
                                                <Link
                                                    href={item.authorId === 1 ? "/profile" : `/profile/${item.authorId}`}
                                                    aria-label={`View ${item.name}'s profile`}
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

                                                    <div className="flex items-center gap-4">
                                                        <div>
                                                            <Link
                                                                href={item.authorId === 1 ? "/profile" : `/profile/${item.authorId}`}
                                                                className="text-xs font-semibold hover:underline"
                                                            >
                                                                {item.name}
                                                            </Link>

                                                            <p className="text-[10px] text-gray-600">
                                                                {item.course}
                                                            </p>
                                                        </div>

                                                        <span className="text-[10px] text-gray-500">
                                                            {item.time}
                                                        </span>
                                                    </div>

                                                    {/* Comment Text */}
                                                    <div
                                                        onClick={handleCommentImageClick}
                                                        className="comment-content mt-3 break-words text-[11px] leading-relaxed [&_p]:whitespace-pre-wrap [&_strong]:font-bold [&_em]:italic [&_img]:cursor-zoom-in"
                                                        dangerouslySetInnerHTML={{
                                                            __html: DOMPurify.sanitize(item.text),
                                                        }}
                                                    />

                                                        {/* File Attachments */}
                                                        {item.attachments?.map((attachment) => (
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
                                                            onClick={() => handleLikeComment(item.id)}
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
                                                                {item.likes + (isLiked ? 1 : 0)}
                                                            </span>
                                                        </button>

                                                        {/* Comment Count */}
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                            setReplyingTo(
                                                                replyingTo === item.id ? null : item.id
                                                            )
                                                            }
                                                            className="flex items-center gap-2"
                                                        >
                                                            <Image
                                                                src="/assets/icons/comment.svg"
                                                                alt=""
                                                                width={23}
                                                                height={23}
                                                            />

                                                            <span className="text-xs">
                                                                {item.replies.length}
                                                            </span>
                                                        </button>

                                                        {/* Share Comment */}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleShare(item.id)}
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

                                                        {/* More Options for Comment */}
                                                        <div className="relative" data-comment-menu>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setShowMoreMenu(false);
                                                                    setOpenCommentMenu(
                                                                        openCommentMenu === item.id ? null : item.id
                                                                    );
                                                                }}
                                                                aria-label="More comment options"
                                                                aria-expanded={openCommentMenu === item.id}
                                                            >
                                                                <Image
                                                                    src="/assets/icons/more.svg"
                                                                    alt=""
                                                                    width={23}
                                                                    height={6}
                                                                />
                                                            </button>

                                                            {/* Popup */}
                                                            {openCommentMenu === item.id && (
                                                                <div className="absolute right-0 top-full z-30 mt-2 w-[120px] rounded-md border border-gray-200 bg-white py-1 shadow-md">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            setOpenCommentMenu(null);
                                                                            setShowReportModal(true);
                                                                        }}
                                                                        className="w-full px-4 py-2 text-left text-xs text-gray-700 hover:bg-gray-50"
                                                                    >
                                                                        Report
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Shared positioning for the collapse button and thread line */}
                                                    <div className="relative mt-3">

                                                        {/* Thread line: centered at 10px, the center of the 20px button */}
                                                        {item.replies.length > 0 && !collapsedReplies.has(item.id) && (
                                                            <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-[9px] top-8 w-[2px] bg-gray-200" />
                                                        )}

                                                        {/* Reply controls */}
                                                        <div className="flex items-center gap-3">
                                        
                                                            {/* Collapse and Expand Button*/}
                                                            {item.replies.length > 0 && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => toggleReplies(item.id)}
                                                                    aria-expanded={!collapsedReplies.has(item.id)}
                                                                    aria-label={
                                                                        collapsedReplies.has(item.id)
                                                                            ? "Expand replies"
                                                                            : "Collapse replies"
                                                                    }
                                                                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-gray-300 text-gray-400"
                                                                >
                                                                    <span className="text-sm leading-none">
                                                                        {collapsedReplies.has(item.id) ? "+" : "−"}
                                                                    </span>
                                                                </button>
                                                            )}

                                                            {/* Reply Button */}
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setReplyingTo(replyingTo === item.id ? null : item.id)
                                                                }
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

                                                        {/* Reply Input */}
                                                        {replyingTo === item.id && (
                                                            <div className="relative z-10 mt-3 ml-9 flex gap-2">
                                                                <input
                                                                    type="text"
                                                                    value={replyText}
                                                                    onChange={(event) =>
                                                                        setReplyText(event.target.value)
                                                                    }
                                                                    placeholder="Write a reply..."
                                                                    className="min-w-0 flex-1 rounded border border-gray-300 px-3 py-2 text-xs outline-none focus:border-[#00A651]"
                                                                />

                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        handleReply(item.id, replyText);
                                                                        setReplyText("");
                                                                        setReplyingTo(null);
                                                                    }}
                                                                    className="rounded bg-[#00A651] px-3 py-2 text-xs text-white"
                                                                >
                                                                        Reply
                                                                </button>
                                                            </div>
                                                        )}

                                                        {/* Nested Replies */}
                                                        {item.replies.length > 0 && !collapsedReplies.has(item.id) && (
                                                            <div className="relative mt-3 pl-9">
                                                                
                                                                {item.replies.map((reply) => (
                                                                    <div
                                                                        key={reply.id}
                                                                        className="mb-5 flex gap-2 last:mb-0"
                                                                    >
                                                                        <Link
                                                                            href={reply.authorId === 1 ? "/profile" : `/profile/${reply.authorId}`}
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
                                                                                        href={reply.authorId === 1 ? "/profile" : `/profile/${reply.authorId}`}
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
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Preview Modal */}
            {selectedImageIndex !== null && images.length > 0 && (
                <ImagePreview
                    images={images}
                    initialIndex={selectedImageIndex}
                    alt={`Attachment for ${post.title}`}
                    onClose={() => setSelectedImageIndex(null)}
                />
            )}

            {/* Comment Image Preview */}
            {commentImagePreview !== null && (
                <ImagePreview
                    images={commentImagePreview.images}
                    initialIndex={commentImagePreview.initialIndex}
                    alt="Comment attachment"
                    onClose={() => setCommentImagePreview(null)}
                />
            )}

            {/* Report Modal */}
            <ReportModal
                isOpen={showReportModal}
                onClose={() => setShowReportModal(false)}
            />
        </>
    );
}