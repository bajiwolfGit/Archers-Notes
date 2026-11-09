/**
 * File: app/main/quizbits/page.tsx
 *
 * Description:
 * Serves as the Quizbits overview page of the Archer's Notes application.
 * Displays published quizzes grouped by course, allows users to switch
 * between Trending and Latest quizzes, and shows recently viewed posts.
 *
 * Features:
 * - Groups published quizzes by course.
 * - Shows up to six quizzes per course with a link to view all.
 * - Allows users to sort quizzes by Trending or Latest.
 * - Displays recently viewed posts on the right side.
 * - Uses the shared application layout for consistent navigation.
 */

"use client";

// React hook for managing component state.
import { useState } from "react";

// Next.js components for images and client-side navigation.
import Image from "next/image";
import Link from "next/link";

// Shared application layout containing the navigation bar and sidebar.
import MainLayout from "@/components/layout/main-layout";

// Tabs for switching between Trending and Latest.
import FeedTabs from "@/components/home/feed-tabs";

// Panel displaying recently viewed posts.
import RecentPosts from "@/components/home/recent-posts";

// Grid of quiz cards.
import QuizGrid from "@/components/home/quiz-grid";

// Shared quiz state.
import { useQuizzes } from "@/context/quizzes-context";

// Quiz sorting helpers.
import { sortQuizzes, type QuizSort } from "@/data/quizzes";

/** Maximum number of quizzes shown per course on the overview. */
const QUIZZES_PER_COURSE = 6;

/**
 * QuizbitsPage Component
 *
 * @returns The Quizbits overview page.
 */
export default function QuizbitsPage() {
	return (
		<MainLayout>
			<QuizbitsContent />
		</MainLayout>
	);
}

/**
 * QuizbitsContent Component
 *
 * Rendered inside MainLayout so it can access the quizzes context.
 *
 * @returns The quiz overview grouped by course.
 */
function QuizbitsContent() {

	// Selected sorting option. Defaults to Trending.
	const [sortBy, setSortBy] = useState<QuizSort>("Trending");

	const { quizzes, loaded } = useQuizzes();

	// Only published quizzes are visible in Quizbits.
	const published = sortQuizzes(
		quizzes.filter((quiz) => quiz.status === "published"),
		sortBy
	);

	// Unique course codes in alphabetical order.
	const courses = Array.from(
		new Set(published.map((quiz) => quiz.course))
	).sort();

	return (
		<div className="relative w-full px-6 py-6">

			{/*
			 * Center Quiz Feed:
			 * Aligned with the navigation bar's search bar,
			 * matching the main notes feed.
			 */}
			<div className="relative left-1/2 w-full max-w-[580px] -translate-x-[calc(50%+111px)]">

				{/* Feed Sorting Tabs */}
				<div className="mx-auto max-w-[460px]">
					<FeedTabs activeTab={sortBy} onTabChange={setSortBy} />
				</div>

				{/* Quizzes Grouped by Course */}
				<div className="mt-8 space-y-10">
					{loaded && courses.length === 0 && (
						<p className="py-10 text-center text-sm text-gray-500">
							No quizzes yet.{" "}
							<Link
								href="/main/create-quiz"
								className="font-semibold text-[#00A651] hover:underline"
							>
								Create one
							</Link>
						</p>
					)}

					{courses.map((course) => (
						<section key={course}>

							{/* Course Heading */}
							<Link
								href={`/main/quizbits/${course.toLowerCase()}`}
								className="mb-4 inline-flex items-center gap-4 text-lg font-semibold text-[#343B36] hover:opacity-70"
							>
								{course}
								<Image
									src="/assets/icons/next-right.svg"
									alt=""
									width={8}
									height={12}
								/>
							</Link>

							<QuizGrid
								quizzes={published
									.filter((quiz) => quiz.course === course)
									.slice(0, QUIZZES_PER_COURSE)}
							/>
						</section>
					))}
				</div>
			</div>

			{/* Recent Posts Section */}
			<div className="absolute right-6 top-6 hidden w-[225px] xl:block">
				<RecentPosts />
			</div>
		</div>
	);
}
