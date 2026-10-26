import PostCard from "@/components/home/post-card";
import { posts } from "@/data/posts";

export default function ProfilePosts() {
	const profilePosts = posts.filter((post) => post.authorId === 1);

	return (
		<div className="space-y-5">
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