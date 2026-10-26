import PostCard from "./post-card";
import { posts } from "@/data/posts";

interface NotesFeedProps {
  	sortBy: "Trending" | "Latest";
}

export default function NotesFeed({ sortBy }: NotesFeedProps) {
	const sortedPosts = [...posts].sort((a, b) => {
		if (sortBy === "Trending") {
			return b.likes - a.likes;
		}

		return (
			new Date(b.createdAt).getTime() -
			new Date(a.createdAt).getTime()
		);
	});

	return (
		<div className="space-y-6">
			{sortedPosts.map((post) => (
				<PostCard key={post.id} post={post} />
			))}
		</div>
	);
}