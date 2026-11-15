/**
 * File: lib/posts-api.ts
 *
 * Description:
 * Talks to the backend's posts and courses endpoints and converts what the
 * backend returns into the Post and Draft shapes the components already use.
 *
 * Usable from both client and server components: nothing here touches the
 * DOM or React.
 */

import type { Post } from "@/components/home/post-card";

export const API_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

/** A file stored in the post_files table. file_url is a base64 data URL. */
export interface ApiPostFile {
    file_id: string;
    file_url: string;
    file_type: string | null;
}

/** A post exactly as the backend returns it. */
export interface ApiPost {
    post_id: string;
    header: string;
    body: string | null;
    status: "draft" | "pending_review" | "published" | "archived";
    created_at: string;
    updated_at: string;
    course: { course_id: number; code: string; name: string };
    author: {
        id: string;
        name: string;
        username: string;
        avatar_url: string | null;
    };
    files: ApiPostFile[];
    likes: number;
    comments: number;
}

/** A verified course, as returned by GET /courses. */
export interface ApiCourse {
    course_id: number;
    code: string;
    name: string;
    college: { college_id: number; name: string };
}

/** A new file to store with a post. */
export interface NewPostFile {
    file_url: string;
    file_type?: string;
}

/** Body of POST /posts. */
export interface CreatePostPayload {
    header: string;
    course_id: number;
    body: string;
    status: "draft" | "published";
    files?: NewPostFile[];
}

/** Body of PATCH /posts/:id. Anything left out stays as it is. */
export interface UpdatePostPayload {
    header?: string;
    course_id?: number;
    body?: string;
    status?: "draft" | "published";
    add_files?: NewPostFile[];
    remove_file_ids?: string[];
}

/** Draft shape used by the drafts page and the note editor. */
export interface Draft {
    id: number | string;
    title: string;
    course: string;
    content: string;
    updatedAt: string;
}

/**
 * Sends a request to the backend with the login cookie attached and returns
 * the parsed JSON. Throws an Error carrying the backend's message otherwise.
 */
async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_URL}${path}`, {
        ...init,
        credentials: "include",
        headers: {
            ...(init.body ? { "Content-Type": "application/json" } : {}),
            ...init.headers,
        },
    });

    if (!response.ok) {
        throw new Error(await readErrorMessage(response));
    }

    // 204 No Content (delete) has no body to parse.
    if (response.status === 204) {
        return undefined as T;
    }

    return (await response.json()) as T;
}

/** Turns a failed response into a message that can be shown to the user. */
async function readErrorMessage(response: Response): Promise<string> {
    if (response.status === 401) {
        return "Please sign in to continue.";
    }

    if (response.status === 413) {
        return "Your note is too large. Try removing some images or files.";
    }

    try {
        const data: { message?: string | string[] } = await response.json();

        if (Array.isArray(data.message)) {
            return data.message.join(" ");
        }

        if (typeof data.message === "string" && data.message) {
            return data.message;
        }
    } catch {
        // The response had no JSON body; fall through to the generic message.
    }

    return `Something went wrong (${response.status}).`;
}

/** Published posts for the feed, newest first. */
export function fetchPosts(): Promise<ApiPost[]> {
    return request<ApiPost[]>("/posts");
}

/**
 * One post by id. Throws when it does not exist or is not visible to the
 * caller. Never cached, so edits show up on the next visit.
 */
export function fetchPost(postId: string): Promise<ApiPost> {
    return request<ApiPost>(`/posts/${encodeURIComponent(postId)}`, {
        cache: "no-store",
    });
}

/** The logged-in user's own posts, drafts included. */
export function fetchMyPosts(): Promise<ApiPost[]> {
    return request<ApiPost[]>("/posts/mine");
}

/** Courses that may be chosen for a post (verified courses only). */
export function fetchCourses(): Promise<ApiCourse[]> {
    return request<ApiCourse[]>("/courses");
}

export function createPost(payload: CreatePostPayload): Promise<ApiPost> {
    return request<ApiPost>("/posts", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}

export function updatePost(
    postId: string,
    payload: UpdatePostPayload
): Promise<ApiPost> {
    return request<ApiPost>(`/posts/${postId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });
}

export function deletePost(postId: string): Promise<void> {
    return request<void>(`/posts/${postId}`, { method: "DELETE" });
}

/** Whether a stored file is an image (as opposed to a PDF, DOCX, ...). */
export function isImageFile(file: ApiPostFile): boolean {
    return (
        file.file_type?.startsWith("image/") ||
        file.file_url.startsWith("data:image/")
    );
}

/** "Just now", "5 minutes ago", "3 days ago", ... */
export function formatRelativeTime(isoDate: string): string {
    const seconds = Math.floor(
        (Date.now() - new Date(isoDate).getTime()) / 1000
    );

    if (seconds < 60) return "Just now";

    const units: [label: string, seconds: number][] = [
        ["year", 365 * 24 * 60 * 60],
        ["month", 30 * 24 * 60 * 60],
        ["day", 24 * 60 * 60],
        ["hour", 60 * 60],
        ["minute", 60],
    ];

    for (const [label, size] of units) {
        const count = Math.floor(seconds / size);

        if (count >= 1) {
            return `${count} ${label}${count === 1 ? "" : "s"} ago`;
        }
    }

    return "Just now";
}

/** Converts a backend post into the Post shape used by the components. */
export function toPost(apiPost: ApiPost): Post {
    return {
        id: apiPost.post_id,
        authorId: apiPost.author.id,
        name: apiPost.author.name,
        course: apiPost.course.code,
        time: formatRelativeTime(apiPost.created_at),
        title: apiPost.header,
        content: apiPost.body ?? "",
        images: apiPost.files.filter(isImageFile).map((file) => file.file_url),
        likes: apiPost.likes,
        comments: apiPost.comments,
        createdAt: apiPost.created_at,
    };
}

/**
 * Converts a backend draft into the Draft shape used by the editor.
 *
 * The editor keeps a draft's images inside its HTML, while the backend keeps
 * them in post_files, so the stored images are put back into the content.
 */
export function toDraft(apiPost: ApiPost): Draft {
    const images = apiPost.files
        .filter(isImageFile)
        .map((file) => `<img src="${file.file_url}">`)
        .join("");

    return {
        id: apiPost.post_id,
        title: apiPost.header,
        course: apiPost.course.code,
        content: (apiPost.body ?? "") + images,
        updatedAt: apiPost.updated_at,
    };
}
