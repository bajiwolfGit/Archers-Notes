import type { Post } from "@/components/home/post-card";

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