/**
 * File: components/home/notes-feed.tsx
 *
 * Description:
 * Manages the display and sorting of posts in the main notes feed
 * of the Archer's Notes application. Retrieves available posts
 * from PostsContext and organizes them based on the selected
 * sorting option.
 *
 * Features:
 * - Retrieves posts from the shared PostsContext.
 * - Sorts posts by popularity when Trending is selected.
 * - Sorts posts by creation date when Latest is selected.
 * - Displays posts using the reusable PostCard component.
 * - Automatically updates when the posts or sorting option changes.
 */

"use client";

// Component responsible for displaying individual posts in the notes feed.
import PostCard from "./post-card";

// Custom context hook for accessing posts stored in the shared PostsContext.
import { usePosts } from "@/context/posts-context";

/**
 * NotesFeedProps Interface
 *
 * Defines the properties required by the NotesFeed component.
 *
 * @property sortBy - Determines how posts are sorted.
 *                    "Trending" sorts posts by number of likes.
 *                    "Latest" sorts posts by creation date.
 */
interface NotesFeedProps {
    sortBy: "Trending" | "Latest";
}

/**
 * NotesFeed Component
 *
 * Retrieves and displays posts from the shared PostsContext.
 * Sorts the available posts according to the sorting option
 * selected by the user through the FeedTabs component.
 *
 * Trending:
 * - Displays posts with the highest number of likes first.
 *
 * Latest:
 * - Displays the most recently created posts first.
 *
 * @param sortBy - The selected sorting option for the notes feed.
 * @returns A list of sorted posts rendered using PostCard components.
 */
export default function NotesFeed({ sortBy }: NotesFeedProps) {
    
    // Retrieve the current list of posts from the shared PostsContext.
    const { posts } = usePosts();

    /**
     * Sorted Posts
     *
     * Creates a copy of the posts array before sorting to avoid
     * directly modifying the original array stored in PostsContext.
     *
     * The sorting behavior depends on the selected sortBy value:
     * - Trending: Sort posts by likes in descending order.
     * - Latest: Sort posts by creation date in descending order.
     */
    const sortedPosts = [...posts].sort((a, b) => {
        
        // Sort posts by popularity, placing the most liked posts first.
        if (sortBy === "Trending") {
            return b.likes - a.likes;
        }

        // Sort posts by creation date, placing the newest posts first.
        return (
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        );
    });

    return (
        /*
         * Notes Feed Container:
         * Displays the sorted posts in a vertical layout.
         *
         * The space-y-6 class adds consistent spacing
         * between individual post cards.
         */
        <div className="space-y-6">

            {/*
             * Post List:
             * Iterates through the sorted posts array and renders
             * each post using the reusable PostCard component.
             *
             * The post ID is used as a unique React key to help
             * React efficiently identify and update list items.
             */}
            {sortedPosts.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
    );
}