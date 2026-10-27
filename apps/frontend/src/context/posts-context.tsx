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
const DRAFTS_STORAGE_KEY = "archers-notes-drafts";

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

    drafts: Draft[];
    addDraft: (draft: Draft) => void;
    deleteDraft: (id: number) => void;
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
    const [drafts, setDrafts] = useState<Draft[]>([]);
    const [loaded, setLoaded] = useState(false);

    // Load saved posts and drafts
    useEffect(() => {
        try {
            const savedPosts = localStorage.getItem(STORAGE_KEY);
            const savedDrafts = localStorage.getItem(DRAFTS_STORAGE_KEY);

            if (savedPosts) {
                setCreatedPosts(JSON.parse(savedPosts) as Post[]);
            }

            if (savedDrafts) {
                setDrafts(JSON.parse(savedDrafts) as Draft[]);
            }
        } catch (error) {
            console.error("Failed to load posts or drafts:", error);
        } finally {
            setLoaded(true);
        }
    }, []);

    // Save posts to localStorage
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

    // Add a new post
    function addPost(post: Post) {
        setCreatedPosts((prev) => [post, ...prev]);
    }

    // Delete an existing post
    function deletePost(id: Post["id"]) {
        setCreatedPosts((prev) =>
            prev.filter((post) => post.id !== id)
        );
    }

    // Add or update a draft
    function addDraft(draft: Draft) {
        setDrafts((prev) => {
            const existing = prev.some((item) => item.id === draft.id);

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

    return (
        <PostsContext.Provider
            value={{
                posts: [...createdPosts, ...initialPosts],
                addPost,
                deletePost,
                drafts,
                addDraft,
                deleteDraft,
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