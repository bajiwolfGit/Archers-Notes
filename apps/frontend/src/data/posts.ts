/**
 * File: data/posts.ts
 *
 * Description:
 * Contains predefined mock post data used throughout the
 * Archer's Notes application.
 *
 * Each post represents a note shared by a user and includes
 * information about the author, course, content, attachments,
 * engagement statistics, and creation date.
 *
 * Features:
 * - Provides sample posts for displaying application content.
 * - Uses the shared Post interface for type safety.
 * - Supports posts with or without image attachments.
 * - Includes engagement statistics such as likes and comments.
 * - Provides creation dates for sorting posts by recency.
 * - Serves as initial mock data for development and testing.
 */

// Import the Post interface to ensure each post follows the required data structure.
import type { Post } from "@/components/home/post-card";

/**
 * Posts Data
 *
 * Defines an array of predefined posts used as mock data
 * throughout the application.
 *
 * Each post follows the Post interface and contains:
 *
 * - id: Unique identifier for the post.
 * - authorId: Unique identifier of the post's author.
 * - name: Display name of the post's author.
 * - course: Course associated with the post.
 * - time: Human-readable description of when the post was created.
 * - title: Title of the post.
 * - content: Main text content of the post.
 * - images: Optional array of image attachment paths.
 * - likes: Number of likes received by the post.
 * - comments: Number of comments associated with the post.
 * - createdAt: Creation date used for sorting posts by recency.
 *
 * The array is exported so other components and modules
 * can import and use the predefined posts.
 */
export const posts: Post[] = [
	{
		id: 1,
		authorId: 1,
		name: "John Doe",
		course: "STALGCM",
		time: "3 days ago",
		title: "Midterms Reviewer",
		content: "Here are some notes for Midterms!",
		images: [
			"/assets/images/mock/sample-notes.png",
			"/assets/images/mock/sample-notes.jpg",
			"/assets/images/mock/sample-notes.jpeg",
			"/assets/images/mock/sample-notes-2.png",
		],
		likes: 67,
		comments: 22,
		createdAt: "2026-10-20",
	},
	{
		id: 2,
		authorId: 2,
		name: "Jane Doe",
		course: "FNDACCT",
		time: "2 days ago",
		title: "Lorem Ipsum",
		content:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Repellendus neque ab aliqua ipsam consequuntur.\n\nArchitecto officia totam nostrum voluptas sunt animi fugiat enim sit error incidunt porro.",
		likes: 35,
		comments: 8,
		createdAt: "2026-10-21",
	},
];