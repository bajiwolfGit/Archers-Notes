"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

import { useRouter } from "next/navigation";

import type { Post } from "@/components/home/post-card";
import { authClient } from "@/lib/auth-client";
import {
    createPost as createPostRequest,
    deletePost as deletePostRequest,
    fetchCourses,
    fetchMyPosts,
    fetchPosts,
    isImageFile,
    toDraft,
    toPost,
    updatePost as updatePostRequest,
    type ApiCourse,
    type ApiPost,
    type Draft,
    type NewPostFile,
} from "@/lib/posts-api";

// Draft Interface
export type { Draft };

// Context Interface
interface PostsContextType {
    posts: Post[];
    addPost: (
        post: Post,
        attachments?: File[],
        fromDraftId?: Draft["id"]
    ) => Promise<void>;
    deletePost: (id: Post["id"]) => Promise<void>;
    updatePost: (updatedPost: Post, attachments?: File[]) => Promise<void>;

    editingPost: Post | null;
    openEditPost: (post: Post) => void;
    closeEditPost: () => void;

    drafts: Draft[];
    addDraft: (draft: Draft, attachments?: File[]) => Promise<void>;
    deleteDraft: (id: Draft["id"]) => Promise<void>;

    editingDraft: Draft | null;
    openEditDraft: (draft: Draft) => void;
    closeEditDraft: () => void;

    // Verified courses a note can be posted under
    courses: ApiCourse[];

    // ID of the logged-in user, or null when nobody is signed in
    currentUserId: string | null;
}

const PostsContext = createContext<PostsContextType | undefined>(
    undefined
);

// What the note editor hands over when a post or draft is saved
interface SaveInput {
    // ID of the post or draft being changed; left out when creating
    id?: Post["id"];
    title: string;
    course: string;
    content: string;
    // Images the post should end up with
    images: string[];
    // Documents picked with the editor's "Attach file" button
    attachments: File[];
    // Left out when editing a post, so its status stays as it is
    status?: "draft" | "published";
}

// Read a picked file as a base64 data URL, the form the backend stores
function readFileAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            if (typeof reader.result === "string") {
                resolve(reader.result);
            } else {
                reject(new Error(`Failed to read ${file.name}.`));
            }
        };

        reader.onerror = () =>
            reject(new Error(`Failed to read ${file.name}.`));

        reader.readAsDataURL(file);
    });
}

// Separate the uploaded images from a draft's HTML
function splitDraftContent(content: string) {
    const container = document.createElement("div");
    container.innerHTML = content;

    const imageElements = Array.from(
        container.querySelectorAll('img[src^="data:"]')
    );

    const images = imageElements
        .map((image) => image.getAttribute("src"))
        .filter((src): src is string => src !== null);

    imageElements.forEach((image) => image.remove());

    return { body: container.innerHTML, images };
}

export function PostsProvider({
    children,
}: {
    children: ReactNode;
}) {
    const router = useRouter();

    // The logged-in user, taken from the Better Auth session
    const { data: session } = authClient.useSession();
    const currentUserId = session?.user.id ?? null;

    // Published posts shown in the feed
    const [feedPosts, setFeedPosts] = useState<ApiPost[]>([]);

    // The logged-in user's own posts, drafts included
    const [ownPosts, setOwnPosts] = useState<ApiPost[]>([]);

    const [courses, setCourses] = useState<ApiCourse[]>([]);

    const [editingPost, setEditingPost] = useState<Post | null>(null);
    const [editingDraft, setEditingDraft] = useState<Draft | null>(null);

    // Nobody else's drafts are ever held: without a session there are none
    const myPosts = currentUserId ? ownPosts : [];

    // Load the feed and the course list
    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                const [loadedPosts, loadedCourses] = await Promise.all([
                    fetchPosts(),
                    fetchCourses(),
                ]);

                if (cancelled) return;

                setFeedPosts(loadedPosts);
                setCourses(loadedCourses);
            } catch (error) {
                console.error("Failed to load posts or courses:", error);
            }
        }

        load();

        return () => {
            cancelled = true;
        };
    }, []);

    // Load the user's own posts and drafts once they are signed in
    useEffect(() => {
        if (!currentUserId) return;

        let cancelled = false;

        async function load() {
            try {
                const loadedPosts = await fetchMyPosts();

                if (!cancelled) {
                    setOwnPosts(loadedPosts);
                }
            } catch (error) {
                console.error("Failed to load your posts:", error);
            }
        }

        load();

        return () => {
            cancelled = true;
        };
    }, [currentUserId]);

    // Reload everything after a change so every page shows the saved state
    async function refresh() {
        const [loadedPosts, loadedOwnPosts] = await Promise.all([
            fetchPosts(),
            currentUserId ? fetchMyPosts() : Promise.resolve([]),
        ]);

        setFeedPosts(loadedPosts);
        setOwnPosts(loadedOwnPosts);

        // Re-render server-rendered pages such as the post details page
        router.refresh();
    }

    // Create a post/draft, or update the one with the given ID
    async function save(input: SaveInput) {
        const courseId = courses.find(
            (course) => course.code === input.course
        )?.course_id;

        if (courseId === undefined) {
            throw new Error("Please select a course.");
        }

        const attachmentFiles: NewPostFile[] = await Promise.all(
            input.attachments.map(async (file) => ({
                file_url: await readFileAsDataUrl(file),
            }))
        );

        const existing =
            input.id === undefined
                ? undefined
                : [...myPosts, ...feedPosts].find(
                      (post) => post.post_id === String(input.id)
                  );

        if (!existing) {
            await createPostRequest({
                header: input.title,
                course_id: courseId,
                body: input.content,
                status: input.status ?? "published",
                files: [
                    ...input.images.map((image) => ({ file_url: image })),
                    ...attachmentFiles,
                ],
            });
        } else {
            // Only send the images that changed; documents are left alone
            const storedImages = existing.files.filter(isImageFile);
            const storedUrls = storedImages.map((file) => file.file_url);

            await updatePostRequest(existing.post_id, {
                header: input.title,
                course_id: courseId,
                body: input.content,
                status: input.status,
                add_files: [
                    ...input.images
                        .filter((image) => !storedUrls.includes(image))
                        .map((image) => ({ file_url: image })),
                    ...attachmentFiles,
                ],
                remove_file_ids: storedImages
                    .filter((file) => !input.images.includes(file.file_url))
                    .map((file) => file.file_id),
            });
        }

        await refresh();
    }

    // Publish a new post, or publish the draft it was written in
    async function addPost(
        post: Post,
        attachments: File[] = [],
        fromDraftId?: Draft["id"]
    ) {
        await save({
            id: fromDraftId,
            title: post.title,
            course: post.course,
            content: post.content,
            images: post.images ?? [],
            attachments,
            status: "published",
        });
    }

    // Delete an existing post
    async function removePost(id: Post["id"]) {
        try {
            await deletePostRequest(String(id));
            await refresh();
        } catch (error) {
            console.error("Failed to delete post:", error);
            alert(
                error instanceof Error
                    ? error.message
                    : "Failed to delete post."
            );
        }
    }

    // Update an existing post
    async function updatePost(updatedPost: Post, attachments: File[] = []) {
        await save({
            id: updatedPost.id,
            title: updatedPost.title,
            course: updatedPost.course,
            content: updatedPost.content,
            images: updatedPost.images ?? [],
            attachments,
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
    async function addDraft(draft: Draft, attachments: File[] = []) {
        const { body, images } = splitDraftContent(draft.content);

        await save({
            id: draft.id,
            title: draft.title,
            course: draft.course,
            content: body,
            images,
            attachments,
            status: "draft",
        });
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

    // Published posts for the feed, search and profile
    const allPosts = feedPosts.map(toPost);

    // Only the logged-in user's own drafts
    const drafts = myPosts
        .filter((post) => post.status === "draft")
        .map(toDraft);

    return (
        <PostsContext.Provider
            value={{
                posts: allPosts,
                addPost,
                deletePost: removePost,
                updatePost,

                editingPost,
                openEditPost,
                closeEditPost,

                drafts,
                addDraft,
                deleteDraft: removePost,

                editingDraft,
                openEditDraft,
                closeEditDraft,

                courses,
                currentUserId,
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
