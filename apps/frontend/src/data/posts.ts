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
	{
		id: 101,
		authorId: 2,
		name: "Jane Doe",
		course: "STADVDB",
		time: "2 hours ago",
		title: "Advanced Database Midterm Reviewer",
		content: "Sharing my notes on transaction isolation levels, concurrency control, and database recovery.",
		images: [],
		likes: 24,
		comments: 8,
		createdAt: "2026-11-08T07:00:00.000Z",
	},
	{
		id: 102,
		authorId: 3,
		name: "Carmy Berzatto",
		course: "CSARCH2",
		time: "5 hours ago",
		title: "Computer Architecture Reviewer",
		content: "Here are my notes about cache mapping, replacement algorithms, and memory hierarchy.",
		images: [],
		likes: 42,
		comments: 12,
		createdAt: "2026-11-08T04:00:00.000Z",
	},
	{
		id: 103,
		authorId: 4,
		name: "Alan Smith",
		course: "STSWENG",
		time: "1 day ago",
		title: "Software Engineering Project Guidelines",
		content: "These are the requirements and guidelines for our upcoming software engineering project.",
		images: [],
		likes: 18,
		comments: 5,
		createdAt: "2026-11-07T09:00:00.000Z",
	},
	{
		id: 104,
		authorId: 2,
		name: "Jane Doe",
		course: "STALGCM",
		time: "2 days ago",
		title: "Graph Algorithms Cheat Sheet",
		content: "Quick reviewer covering BFS, DFS, Dijkstra's algorithm, and minimum spanning trees.",
		images: [],
		likes: 56,
		comments: 14,
		createdAt: "2026-11-06T09:00:00.000Z",
	},
	{
		id: 105,
		authorId: 3,
		name: "Carmy Berzatto",
		course: "CSARCH2",
		time: "3 days ago",
		title: "Memory Management Notes",
		content: "Sharing a summary of virtual memory, paging, segmentation, and address translation.",
		images: [],
		likes: 31,
		comments: 9,
		createdAt: "2026-11-05T09:00:00.000Z",
	},

];