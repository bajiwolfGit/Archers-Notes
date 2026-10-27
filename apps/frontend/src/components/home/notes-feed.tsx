"use client";

import PostCard from "./post-card";
import { usePosts } from "@/context/posts-context";

interface NotesFeedProps {
    sortBy: "Trending" | "Latest";
}

export default function NotesFeed({ sortBy }: NotesFeedProps) {
    const { posts } = usePosts();

    const sortedPosts = [...posts].sort((a, b) => {
        if (sortBy === "Trending") {
            return b.likes - a.likes;
        }

        return (
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        );
    });

    return (
        <div className="space-y-6">
            {sortedPosts.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
    );
}