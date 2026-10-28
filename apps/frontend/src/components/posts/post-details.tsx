"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import Image from "next/image";
import Link from "next/link";


import { usePosts } from "@/context/posts-context";

import PostComments from "@/components/posts/post-comments";
import ReportModal from "@/components/posts/report-modal";
import DeleteNoteModal from "@/components/posts/delete-note-modal";
import ImagePreview from "@/components/ui/image-preview";

import type { Post } from "@/components/home/post-card";

interface PostDetailsProps {
    post: Post;
}

export default function PostDetails({ post }: PostDetailsProps) {
    const router = useRouter();
    const { deletePost, openEditPost } = usePosts();

    const isOwner = post.authorId === 1;

    const profileHref = isOwner
        ? "/profile"
        : `/profile/${post.authorId}`;
    
    const images = post.images ?? [];
    

    // Post interactions
    const [isPinned, setIsPinned] = useState(false);
    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);

    // Modals and menus
    const [showMoreMenu, setShowMoreMenu] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Comments
    const [additionalComments, setAdditionalComments] = useState(0);

    // Image preview
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
        null
    );

    const moreMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target;

            if (!(target instanceof Node)) return;

            if (
                moreMenuRef.current &&
                !moreMenuRef.current.contains(target)
            ) {
                setShowMoreMenu(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    async function handleShare(commentId?: number) {
        const url = new URL(window.location.href);

        // Include the comment ID when sharing a specific comment
        if (commentId !== undefined) {
            url.hash = `comment-${commentId}`;
        }

        const shareData = {
            title: post.title,
            text:
                commentId !== undefined
                    ? "Check out this comment on Archer's Notes!"
                    : `Check out ${post.title} on Archer's Notes!`,
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

    function handleDeletePost() {
        deletePost(post.id);
        setShowDeleteModal(false);
        router.replace("/");
    }

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
                                href={profileHref}
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
                                    href={profileHref}
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
                                        onClick={() => setIsPinned((previous) => !previous)}
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
                                        onClick={() => openEditPost(post)}
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
                                        onClick={() => setShowDeleteModal(true)}
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
                                    onClick={() => setLiked((previous) => !previous)}
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
                                        {post.comments + additionalComments}
                                    </span>
                                </div>

                                {/* Bookmark */}
                                <button
                                    type="button"
                                    onClick={() => setSaved((previous) => !previous)}
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

                            {/* Comments */}
                            <PostComments
                                onShare={handleShare}
                                onReport={() => setShowReportModal(true)}
                                onCommentCountChange={setAdditionalComments}
                                onOpenCommentMenu={() => setShowMoreMenu(false)}
                            />
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

            {/* Report Modal */}
            <ReportModal
                isOpen={showReportModal}
                onClose={() => setShowReportModal(false)}
            />

            {/* Delete Note Modal */}
            {isOwner && (
                <DeleteNoteModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleDeletePost}
                />
            )}
        </>
    );
}