import { notFound } from "next/navigation";

import MainLayout from "@/components/layout/main-layout";
import PostDetails from "@/components/posts/post-details";
import RecentPosts from "@/components/home/recent-posts";

import { posts } from "@/data/posts";

interface PostPageProps {
  	params: Promise<{ id: string }>;
}

export default async function PostPage({
  	params,
}: PostPageProps) {
	const { id } = await params;

	const post = posts.find(
		(item) => item.id === Number(id)
	);

	if (!post) {
		notFound();
	}

	return (
		<MainLayout>
			<div className="relative w-full px-6 py-7">

				{/* Empty Left Column */}
				<div className="hidden lg:block" />

				{/* Post Details */}
				<div className="relative left-1/2 w-full max-w-[480px] -translate-x-[calc(50%+111px)]">
					<PostDetails post={post} />
				</div>


				{/* Recent Posts*/}
				<div className="fixed right-6 top-[88px] hidden w-[225px] xl:block">
					<RecentPosts />
				</div>

			</div>
		</MainLayout>
	);
}