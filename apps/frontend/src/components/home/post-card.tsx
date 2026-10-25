
"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import ImagePreview from "@/components/ui/image-preview";

export interface Post {
  id: number;
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

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const router = useRouter();
  
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);  
  
  const openPost = () => {
    router.push(`/posts/${post.id}`);
  };

  async function handleShare(event: React.MouseEvent<HTMLButtonElement>) {
    // Prevent clicking Share from opening the Post Details page
    event.preventDefault();
    event.stopPropagation();

    const postUrl = `${window.location.origin}/posts/${post.id}`;

    const shareData = {
      title: post.title,
      text: `Check out "${post.title}" on Archers Notes!`,
      url: postUrl,
    };

    try {
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

      console.error("Failed to share post:", error);
    }
  }

  return (
    <>
      <article
        onClick={openPost}
        className="w-full cursor-pointer rounded-sm border border-gray-200 bg-white p-6 transition-colors hover:bg-gray-50"
      >

        {/* Post Header */}
        <div className="flex items-center gap-3">
          <Image
            src="/assets/icons/profile.svg"
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 shrink-0 object-contain"
          />

          <div>
            <h3 className="text-sm font-semibold">{post.name}</h3>
            <p className="text-xs">{post.course}</p>
          </div>

          <span className="ml-4 text-xs text-gray-500">
            {post.time}
          </span>

          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            aria-label="More options"
            className="ml-auto flex h-8 w-8 shrink-0 items-center justify-center"
          >
            <Image
              src="/assets/icons/more.svg"
              alt=""
              width={23}
              height={6}
              className="h-6 w-6 object-contain"
            />
          </button>
        </div>

        {/* Post Content */}
        <div className="ml-9 mt-3">
          <button
            type="button"
            onClick={openPost}
            className="mb-3 block text-left text-xs font-semibold hover:underline"
          >
            {post.title}
          </button>

          <p className="whitespace-pre-line text-xs leading-relaxed">
            {post.content}
          </p>


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

      {/* Image Preview Modal */}
      {selectedImageIndex !== null && post.images && (
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
