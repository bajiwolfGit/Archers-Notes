"use client";

import PostCard from "@/components/home/post-card";
import { usePosts } from "@/context/posts-context";

export default function ProfilePosts() {
    const { posts } = usePosts();

    const profilePosts = posts.filter(
        (post) => post.authorId === 1
    );

    return (
        <div className="space-y-5">
            {profilePosts.map((post) => (
                <PostCard
                    key={post.id}
                    post={post}
                    isOwnPost={true}
                />
            ))}
        </div>
    );
}