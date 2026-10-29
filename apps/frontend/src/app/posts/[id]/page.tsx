/**
 * File: app/posts/[id]/page.tsx
 *
 * Description:
 * Handles the individual post details page of the Archer's Notes application.
 * Retrieves and displays a specific post based on its unique ID from the URL.
 * Provides access to the post's complete content and recently viewed posts.
 *
 * Features:
 * - Retrieves a post using its unique ID from the URL.
 * - Displays the selected post through the PostDetails component.
 * - Redirects to the Next.js 404 page when a post cannot be found.
 * - Displays recently viewed posts on the right side of the page.
 * - Aligns the post content with the navigation bar's search bar.
 * - Uses the shared application layout for consistent navigation.
 */

// Next.js utility for displaying the 404 page when a requested post does not exist.
import { notFound } from "next/navigation";

// Shared application layout containing the navigation bar and sidebar.
import MainLayout from "@/components/layout/main-layout";

// Component responsible for displaying the selected post's details and interactions.
import PostDetails from "@/components/posts/post-details";

// Component displaying recently viewed posts on the right side of the page.
import RecentPosts from "@/components/home/recent-posts";

// Mock post data used to retrieve the requested post.
import { posts } from "@/data/posts";

/**
 * PostPageProps Interface
 *
 * Defines the properties received by the dynamic post page.
 *
 * @property params - A Promise containing the dynamic URL parameters.
 * @property params.id - The unique identifier of the requested post.
 */
interface PostPageProps {
  	params: Promise<{ id: string }>;
}

/**
 * PostPage Component
 *
 * Serves as the individual post details page for Archer's Notes.
 * Retrieves the post ID from the URL, searches for the corresponding
 * post, and displays its details within the shared application layout.
 *
 * If the requested post does not exist, the Next.js notFound()
 * function is called to display the 404 page.
 *
 * @param params - A Promise containing the post ID from the URL.
 * @returns The selected post's details and the recent posts section.
 */
export default async function PostPage({
  	params,
}: PostPageProps) {

	// Resolve the dynamic route parameters to retrieve the requested post ID.
	const { id } = await params;

	/**
	 * Find the post matching the requested ID.
	 *
	 * Converts the URL parameter from a string to a number
	 * before comparing it with the IDs in the posts array.
	 *
	 * Returns undefined if no matching post is found.
	 */
	const post = posts.find(
		(item) => item.id === Number(id)
	);

	// Display the Next.js 404 page if the requested post does not exist.
	if (!post) {
		notFound();
	}

	return (
		<MainLayout>
			{/* Main Content Container */}
			<div className="relative w-full px-6 py-7">

				{/*
				 * Empty Left Column:
				 * Reserved as a layout element for larger screens.
				 *
				 * Hidden on smaller screens and displayed
				 * at the lg breakpoint and above.
				 */}
				<div className="hidden lg:block" />

				{/*
				 * Post Details Section:
				 * Displays the complete information of the selected post.
				 *
				 * Uses horizontal positioning adjustments to align
				 * the post content with the navigation bar's search bar.
				 *
				 * The content has a maximum width of 480px.
				 */}
				<div className="relative left-1/2 w-full max-w-[480px] -translate-x-[calc(50%+111px)]">
					
					{/*
					 * PostDetails Component:
					 * Receives the selected post object through the post prop.
					 * Handles rendering the post's content and available interactions.
					 */}
					<PostDetails post={post} />
				</div>

				{/*
				 * Recent Posts Section:
				 * Displays recently viewed posts on the right side.
				 *
				 * Uses fixed positioning to keep the section visible
				 * while the user scrolls through the post content.
				 *
				 * Positioned 88px from the top of the viewport
				 * with a fixed width of 225px.
				 *
				 * Hidden on smaller screens and becomes visible
				 * at the xl breakpoint and above.
				 */}
				<div className="fixed right-6 top-[88px] hidden w-[225px] xl:block">
					<RecentPosts />
				</div>
			</div>
		</MainLayout>
	);
}