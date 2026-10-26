
"use client";

import { useState } from "react";
import Image from "next/image";

export interface Post {
  id: number;
  name: string;
  course: string;
  time: string;
  title: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  createdAt: string;
}

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <article className="w-full rounded-sm border border-gray-200 bg-white p-6">

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
        <h4 className="mb-3 text-xs font-semibold">
          {post.title}
        </h4>

        <p className="whitespace-pre-line text-xs leading-relaxed">
          {post.content}
        </p>

        {post.image && (
          <div className="relative mt-3 h-[240px] w-full">
            <Image
              src={post.image}
              alt={`Attachment for ${post.title}`}
              fill
              sizes="(max-width: 768px) 100vw, 480px"
              className="object-contain"
            />
          </div>
        )}
      </div>

      {/* Post Actions */}
      <div className="mt-5 flex items-center gap-6 pl-9">

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
            className="h-[27px] w-[30px] shrink-0 object-contain"
          />

          <span className="text-sm">
            {post.likes + (liked ? 1 : 0)}
          </span>
        </button>

        {/* Comments */}
        <button
          type="button"
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
          onClick={() => setSaved(!saved)}
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
          aria-label="Share post"
          className="flex h-8 w-8 shrink-0 items-center justify-center"
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
  );
}
