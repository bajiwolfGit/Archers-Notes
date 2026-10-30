/**
 * File: components/profile/profile-posts.tsx
 *
 * Description:
 * Displays posts created by the currently logged-in user
 * on their profile page in the Archer's Notes application.
 *
 * Retrieves posts from the shared PostsContext and filters
 * them based on the current user's author ID.
 *
 * Features:
 * - Retrieves posts from the global posts context.
 * - Filters posts belonging to the current user.
 * - Displays each post using the reusable PostCard component.
 * - Identifies displayed posts as belonging to the current user.
 * - Automatically reflects changes to the shared posts state.
 */

"use client";

// Reusable component for displaying individual posts.
import PostCard from "@/components/home/post-card";

// Custom hook for accessing the shared posts context.
import { usePosts } from "@/context/posts-context";

/**
 * ProfilePosts Component
 *
 * Displays all posts created by the currently logged-in user.
 *
 * Uses the usePosts hook to retrieve posts from the
 * shared PostsContext.
 *
 * Filters the posts array to include only posts
 * whose authorId matches the current user's ID.
 *
 * Each matching post is rendered using PostCard,
 * with isOwnPost set to true to identify the
 * post as belonging to the current user.
 *
 * @returns A list of posts created by the current user.
 */
export default function ProfilePosts() {

    /**
     * Posts Context
     *
     * Retrieves the posts array from the shared
     * PostsContext using the usePosts hook.
     *
     * The array contains posts managed by the
     * application's global posts state.
     *
     * Changes to this state trigger a re-render,
     * allowing the profile to reflect newly created,
     * edited, or deleted posts.
     */
    const { posts } = usePosts();

    /**
     * Filter Current User's Posts
     *
     * Creates a new array containing only posts
     * created by the currently logged-in user.
     *
     * The authorId property identifies the
     * user who created each post.
     *
     * Currently, authorId === 1 represents
     * the logged-in user.
     *
     * Array.filter() returns only the posts
     * that satisfy this condition.
     */
    const profilePosts = posts.filter(
        (post) => post.authorId === 1
    );

    return (
        /*
         * Profile Posts Container:
         * Wraps the list of posts displayed
         * on the current user's profile.
         *
         * space-y-5 adds vertical spacing
         * between individual post cards.
         */
        <div className="space-y-5">

            {/*
             * Render Profile Posts:
             * Iterates through the filtered posts array
             * and renders each post using PostCard.
             *
             * key:
             * Uses the post's unique ID to help React
             * identify individual elements in the list.
             *
             * post:
             * Passes the complete post object
             * to the PostCard component.
             *
             * isOwnPost:
             * Indicates that the displayed post
             * belongs to the current user.
             */}
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