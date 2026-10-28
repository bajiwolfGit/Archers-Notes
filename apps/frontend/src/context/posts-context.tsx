"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

import type { Post } from "@/components/home/post-card";
import { posts as initialPosts } from "@/data/posts";

const STORAGE_KEY = "archers-notes-created-posts";
const EDITED_POSTS_STORAGE_KEY = "archers-notes-edited-posts";
const DRAFTS_STORAGE_KEY = "archers-notes-drafts";
const DELETED_POSTS_STORAGE_KEY = "archers-notes-deleted-posts";

// Draft Interface
export interface Draft {
    id: number;
    title: string;
    course: string;
    content: string;
    updatedAt: string;
}

// Context Interface
interface PostsContextType {
    posts: Post[];
    addPost: (post: Post) => void;
    deletePost: (id: Post["id"]) => void;
    updatePost: (updatedPost: Post) => void;

    editingPost: Post | null;
    openEditPost: (post: Post) => void;
    closeEditPost: () => void;

    drafts: Draft[];
    addDraft: (draft: Draft) => void;
    deleteDraft: (id: number) => void;

    editingDraft: Draft | null;
    openEditDraft: (draft: Draft) => void;
    closeEditDraft: () => void;
}

const PostsContext = createContext<PostsContextType | undefined>(
    undefined
);

export function PostsProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [createdPosts, setCreatedPosts] = useState<Post[]>([]);
    const [deletedPostIds, setDeletedPostIds] = useState<Post["id"][]>([]);
    const [editedPosts, setEditedPosts] = useState<Post[]>([]);
    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const [drafts, setDrafts] = useState<Draft[]>([]);
    const [editingDraft, setEditingDraft] = useState<Draft | null>(null);
    const [loaded, setLoaded] = useState(false);

    // Load saved posts and drafts
    useEffect(() => {
        try {
            const savedPosts = localStorage.getItem(STORAGE_KEY);
            const savedEditedPosts = localStorage.getItem(
                EDITED_POSTS_STORAGE_KEY
            );
            const savedDrafts = localStorage.getItem(DRAFTS_STORAGE_KEY);

            const savedDeletedPosts = localStorage.getItem(
                DELETED_POSTS_STORAGE_KEY
            );

            if (savedPosts) {
                setCreatedPosts(JSON.parse(savedPosts) as Post[]);
            }

            if (savedEditedPosts) {
                setEditedPosts(JSON.parse(savedEditedPosts) as Post[]);
            }

            if (savedDrafts) {
                setDrafts(JSON.parse(savedDrafts) as Draft[]);
            }

            if (savedDeletedPosts) {
                setDeletedPostIds(JSON.parse(savedDeletedPosts) as Post["id"][]);
            }
        } catch (error) {
            console.error("Failed to load posts or drafts:", error);
        } finally {
            setLoaded(true);
        }
    }, []);

    // Save created posts to localStorage
    useEffect(() => {
        if (!loaded) return;

        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(createdPosts)
            );
        } catch (error) {
            console.error("Failed to save posts:", error);
        }
    }, [createdPosts, loaded]);

    // Save edited posts to localStorage
    useEffect(() => {
        if (!loaded) return;

        try {
            localStorage.setItem(
                EDITED_POSTS_STORAGE_KEY,
                JSON.stringify(editedPosts)
            );
        } catch (error) {
            console.error("Failed to save edited posts:", error);
        }
    }, [editedPosts, loaded]);

    // Save drafts to localStorage
    useEffect(() => {
        if (!loaded) return;

        try {
            localStorage.setItem(
                DRAFTS_STORAGE_KEY,
                JSON.stringify(drafts)
            );
        } catch (error) {
            console.error("Failed to save drafts:", error);
        }
    }, [drafts, loaded]);

    // Save deleted post IDs to localStorage
    useEffect(() => {
        if (!loaded) return;

        try {
            localStorage.setItem(
                DELETED_POSTS_STORAGE_KEY,
                JSON.stringify(deletedPostIds)
            );
        } catch (error) {
            console.error("Failed to save deleted posts:", error);
        }
    }, [deletedPostIds, loaded]);

    // Add a new post
    function addPost(post: Post) {
        setCreatedPosts((prev) => [post, ...prev]);
    }

    // Delete an existing post
    function deletePost(id: Post["id"]) {
        // Remove from created posts
        setCreatedPosts((prev) =>
            prev.filter((post) => post.id !== id)
        );

        // Remove from edited posts
        setEditedPosts((prev) =>
            prev.filter((post) => post.id !== id)
        );

        // Remember deleted posts
        setDeletedPostIds((prev) =>
            prev.includes(id) ? prev : [...prev, id]
        );
    }

    // Update an existing post
    function updatePost(updatedPost: Post) {
        // Update posts created by the user
        setCreatedPosts((prev) =>
            prev.map((post) =>
                post.id === updatedPost.id ? updatedPost : post
            )
        );

        // Store edited versions of posts
        setEditedPosts((prev) => {
            const exists = prev.some(
                (post) => post.id === updatedPost.id
            );

            if (exists) {
                return prev.map((post) =>
                    post.id === updatedPost.id ? updatedPost : post
                );
            }

            return [...prev, updatedPost];
        });
    }

    // Open the Edit Post modal
    function openEditPost(post: Post) {
        setEditingPost(post);
    }

    // Close the Edit Post modal
    function closeEditPost() {
        setEditingPost(null);
    }

    // Add or update a draft
    function addDraft(draft: Draft) {
        setDrafts((prev) => {
            const existing = prev.some(
                (item) => item.id === draft.id
            );

            if (existing) {
                return prev.map((item) =>
                    item.id === draft.id ? draft : item
                );
            }

            return [draft, ...prev];
        });
    }

    // Delete a draft
    function deleteDraft(id: number) {
        setDrafts((prev) =>
            prev.filter((draft) => draft.id !== id)
        );
    }

    // Open the Edit Draft modal
    function openEditDraft(draft: Draft) {
        setEditingPost(null);
        setEditingDraft(draft);
    }

    // Close the Edit Draft modal
    function closeEditDraft() {
        setEditingDraft(null);
    }

    // Combine created and initial posts, applying saved edits
    const allPosts = [...createdPosts, ...initialPosts]
        .filter((post) => !deletedPostIds.includes(post.id))
        .map(
            (post) =>
                editedPosts.find(
                    (edited) => edited.id === post.id
                ) ?? post
        );

    return (
        <PostsContext.Provider
            value={{
                posts: allPosts,
                addPost,
                deletePost,
                updatePost,

                editingPost,
                openEditPost,
                closeEditPost,

                drafts,
                addDraft,
                deleteDraft,

                editingDraft,
                openEditDraft,
                closeEditDraft,
            }}
        >
            {children}
        </PostsContext.Provider>
    );
}

export function usePosts() {
    const context = useContext(PostsContext);

    if (!context) {
        throw new Error(
            "usePosts must be used within PostsProvider"
        );
    }

    return context;
}