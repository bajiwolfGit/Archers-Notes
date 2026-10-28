/**
 * File: components/home/post-card.tsx
 *
 * Description:
 * Renders a post card in the Archer's Notes feed, including author details,
 * sanitized rich-text content, image attachments, and engagement controls.
 *
 * Features:
 * - Opens post details and author profiles.
 * - Provides owner-only edit and delete actions.
 * - Allows reporting posts by other users.
 * - Displays image thumbnails and a full-size image preview.
 * - Supports local like, bookmark, and pin display state.
 * - Shares a post through the Web Share API or copies its URL.
 */

"use client";

// React hooks for local UI state, event-listener lifecycle, and dropdown references.
import { useState, useEffect, useRef } from "react";

// Next.js hook for programmatic navigation to post details.
import { useRouter } from "next/navigation";

// Next.js component for rendering post, avatar, and action images.
import Image from "next/image";

// Next.js component for navigating to author profiles.
import Link from "next/link";


// Shared post context exposing edit and delete operations.
import { usePosts } from "@/context/posts-context";

// Modal for browsing attached images at a larger size.
import ImagePreview from "@/components/ui/image-preview";

// Modal for reporting another user's post.
import ReportModal from "@/components/posts/report-modal";

// Confirmation modal shown before deleting an owned post.
import DeleteNoteModal from "@/components/posts/delete-note-modal";

// Sanitizes rich-text HTML before rendering it into the post card.
import DOMPurify from "isomorphic-dompurify";

/**
 * Post
 * Represents a note displayed in the feed, including author identity,
 * course, rich-text content, optional attachments, and engagement counts.
 * `createdAt` is used when sorting the feed by recency.
 */
export interface Post {
	id: number;
	authorId: number;
	name: string;
	course: string;
	time: string;
	title: string;
	content: string;
	images?: string[];
	likes: number;
	comments: number;
	createdAt: string;
}

/**
 * Props for PostCard.
 * @property post - The post to display.
 * @property isOwnPost - Optional override for whether owner actions are shown.
 */
interface PostCardProps {
	post: Post;
	isOwnPost?: boolean;
}

/**
 * PostCard
 * Displays a clickable post with owner controls, engagement buttons,
 * image previews, and conditional report/delete modals.
 *
 * @param post - Post data to render.
 * @param isOwnPost - Optional ownership override.
 * @returns The post card and its associated modals.
 */
export default function PostCard({
	post,
	isOwnPost,
}: PostCardProps) {

	// Router used to open the selected post.
	const router = useRouter();

	// Context actions for editing or deleting the current post.
	const { openEditPost, deletePost } = usePosts();

	// Show owner actions when explicitly requested or when authorId is 1.
	const isOwner = isOwnPost ?? post.authorId === 1;


	// Local interaction states; these do not update shared post data.
	const [liked, setLiked] = useState(false);
	const [saved, setSaved] = useState(false);

	// Index of the image currently open in the preview; null closes it.
	const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
	
	// Local pin indicator (currently not toggled by the pin button).
	const [isPinned, setIsPinned] = useState(false);


	// Visibility states for the options menu and report/delete dialogs.
	const [showMoreMenu, setShowMoreMenu] = useState(false);
	const [showReportModal, setShowReportModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	// DOM reference used to detect clicks outside the options menu.
	const moreMenuRef = useRef<HTMLDivElement>(null);

	/**
	 * Close the More Options menu when a mouse click occurs outside it.
	 * Remove the document listener on unmount to avoid leaking listeners.
	 */
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				moreMenuRef.current &&
				!moreMenuRef.current.contains(event.target as Node)
			) {
				setShowMoreMenu(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);
	
	/** Navigate to the details page for the current post. */
	const openPost = () => {
		router.push(`/posts/${post.id}`);
	};

	/**
	 * Share the post using the device's native share dialog when supported.
	 * Otherwise, copy the post URL to the clipboard.
	 *
	 * @param event - Share-button click event, stopped from opening the post.
	 */
	async function handleShare(event: React.MouseEvent<HTMLButtonElement>) {
		event.preventDefault();
		event.stopPropagation();

		// Build an absolute URL for sharing or copying.
		const postUrl = `${window.location.origin}/posts/${post.id}`;

		const shareData = {
			title: post.title,
			text: `Check out "${post.title}" on Archers Notes!`,
			url: postUrl,
		};

		try {
			// Prefer native sharing; use the clipboard as a fallback.
			if (navigator.share) {
				await navigator.share(shareData);
			} else {
				await navigator.clipboard.writeText(postUrl);
				alert("Post link copied to clipboard!");
			}
		} catch (error) {
			// User cancelled the share dialog
			if (error instanceof DOMException && error.name === "AbortError") {
				return;
			}

			// Log unexpected sharing or clipboard failures.
			console.error("Failed to share post:", error);
		}
	}

  	return (
		<>
			{/* Clicking the card opens the post details page. */}
			<article
				onClick={openPost}
				className="w-full cursor-pointer rounded-sm border border-gray-200 bg-white p-6 transition-colors hover:bg-gray-50"
			>

				{/* Post Header */}
				<div className="flex items-center gap-3">

					{/* Clickable Profile Picture */}
					<Link
						href={post.authorId === 1 ? "/profile" : `/profile/${post.authorId}`}
						onClick={(e) => e.stopPropagation()}
						aria-label={`View ${post.name}'s profile`}
						className="shrink-0"
					>
						<Image
							src="/assets/icons/profile.svg"
							alt=""
							width={36}
							height={36}
							className="h-9 w-9 object-contain"
						/>
					</Link>

					{/* Clickable Username */}
					<div>
						<Link
							href={`/profile/${post.authorId}`}
							onClick={(e) => e.stopPropagation()}
							className="text-sm font-semibold hover:underline"
						>
							{post.name}
						</Link>

						<p className="text-xs">{post.course}</p>
					</div>

					<span className="ml-4 text-xs text-gray-500">
						{post.time}
					</span>

					{/* Post Options */}
					{/* Owner actions are shown instead of the report menu. */}
					{isOwner ? (
						<div className="ml-auto flex items-center gap-3">

							{/* Pin Post */}
							<button
								type="button"
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									setSelectedImageIndex(null);
									setShowDeleteModal(true);
								}}
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
								onClick={(e) => {
									e.stopPropagation();
									openEditPost(post);
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
								onClick={(e) => {
									e.stopPropagation();
									setShowDeleteModal(true);
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
								onClick={(e) => {
									e.stopPropagation();
									setShowMoreMenu((prev) => !prev);
								}}
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
							
							{showMoreMenu && (
								<div
									className="absolute right-0 top-full z-30 mt-1 w-[120px] rounded-md border border-gray-200 bg-white py-1 shadow-md"
									onClick={(e) => e.stopPropagation()}
								>
									<button
										type="button"
										onClick={(e) => {
											e.stopPropagation();
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
				{/* Rich-text body and optional attachment grid. */}
				<div className="ml-9 mt-3">
					<button
						type="button"
						onClick={openPost}
						className="mb-3 block text-left text-xs font-semibold hover:underline"
					>
						{post.title}
					</button>

					{/* Sanitize stored HTML before injecting it into the DOM. */}
					<div
						className="text-xs leading-relaxed [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_img]:max-w-full [&_img]:rounded-md"
						dangerouslySetInnerHTML={{
							__html: DOMPurify.sanitize(post.content),
						}}
					/>

					{/* Post Images */}
					{post.images && post.images.length > 0 && (
						<div
							className={`mt-3 grid w-full gap-2 overflow-hidden rounded-sm ${
								post.images.length === 1
								? "h-[250px] grid-cols-1"
								: post.images.length === 2
								? "h-[220px] grid-cols-2"
								: "h-[220px] grid-cols-2 grid-rows-2"
							}`}
						>
							{/* Show up to three thumbnails; preview can access all images. */}
							{post.images.slice(0, 3).map((image, index) => (
								<button
									key={index}
									type="button"
									onClick={(e) => {
										e.stopPropagation();
										setSelectedImageIndex(index);
									}}
									className={`relative min-h-0 min-w-0 cursor-zoom-in overflow-hidden bg-gray-50 ${
										post.images!.length >= 3 && index === 0
										? "row-span-2"
										: ""
									}`}
									aria-label={`View image ${index + 1} of ${post.images!.length}`}
								>
									<Image
										src={image}
										alt={`Attachment ${index + 1} for ${post.title}`}
										fill
										sizes="(max-width: 768px) 50vw, 300px"
										className="object-cover"
									/>

									{/* Dark overlay on the third image */}
									{/* Indicate how many additional attachments are hidden. */}
									{post.images!.length > 3 && index === 2 && (
										<div className="absolute inset-0 flex items-center justify-center bg-black/60">
											<span className="text-3xl font-semibold text-white">
												+{post.images!.length - 3}
											</span>
										</div>
									)}
								</button>
							))}
						</div>
					)}
				</div>

				{/* Post Actions */}
				<div className="mt-5 flex items-center gap-6 pl-9">

					{/* Like */}
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							setLiked(!liked);
						}}
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
							className="h-[27px] w-[30px] shrink-0 object-contain"
						/>

						<span className="text-sm">
							{post.likes + (liked ? 1 : 0)}
						</span>
					</button>

					{/* Comments */}
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							openPost();
						}}
						className="flex shrink-0 items-center gap-2"
						aria-label={`${post.comments} comments`}
					>
						<Image
							src="/assets/icons/comment.svg"
							alt=""
							width={24}
							height={24}
							className="h-6 w-[25px] shrink-0 object-contain"
						/>

						<span className="text-sm">{post.comments}</span>
					</button>

					{/* Bookmark */}
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							setSaved(!saved);
						}}
						aria-pressed={saved}
						className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center"
						aria-label={saved ? "Unsave post" : "Save post"}
					>
						<Image
							src={
								saved
								? "/assets/icons/bookmark-active.svg"
								: "/assets/icons/bookmark.svg"
							}
							alt=""
							width={29}
							height={29}
							className="h-[23px] w-[19px] shrink-0 object-contain"
						/>
					</button>

					{/* Share */}
					<button
						type="button"
						onClick={handleShare}
						aria-label="Share post"
						title="Share post"
						className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center"
					>
						<Image
						src="/assets/icons/share.svg"
						alt=""
						width={24}
						height={20}
						className="h-6 w-6 object-contain"
						/>
					</button>
				</div>
			</article>
		
			{/* Report dialog, controlled by the non-owner options menu. */}
			<ReportModal
				isOpen={showReportModal}
				onClose={() => setShowReportModal(false)}
			/>
			
			{/* Delete Note Modal */}
			{/* Owner-only delete confirmation; deletion is handled by PostsContext. */}
			{isOwner && (
				<DeleteNoteModal
					isOpen={showDeleteModal}
					onClose={() => setShowDeleteModal(false)}
					onConfirm={() => {
						deletePost(post.id);
						setShowDeleteModal(false);
					}}
				/>
			)}
		
			{/* Image Preview Modal */}
			{/* Full-size image preview opens when a thumbnail is selected. */}
			{selectedImageIndex !== null && !showDeleteModal && post.images && (
				<ImagePreview
				images={post.images}
				initialIndex={selectedImageIndex}
				alt={`Attachment for ${post.title}`}
				onClose={() => setSelectedImageIndex(null)}
				/>
			)}
		</>
	);
}
