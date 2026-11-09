"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import MainLayout from "@/components/layout/main-layout";
import FeedTabs from "@/components/home/feed-tabs";
import RecentPosts from "@/components/home/recent-posts";
import QuizGrid from "@/components/home/quiz-grid";

import { useQuizzes } from "@/context/quizzes-context";
import { sortQuizzes, type QuizSort } from "@/data/quizzes";

export default function CourseQuizzesPage() {
	return (
		<MainLayout>
			<CourseQuizzesContent />
		</MainLayout>
	);
}

function CourseQuizzesContent() {

	const [sortBy, setSortBy] = useState<QuizSort>("Trending");

	const params = useParams<{ course: string }>();

	const course = decodeURIComponent(params.course).toUpperCase();

	const { quizzes, loaded } = useQuizzes();

	const courseQuizzes = sortQuizzes(
		quizzes.filter(
			(quiz) =>
				quiz.status === "published" &&
				quiz.course.toUpperCase() === course
		),
		sortBy
	);

	return (
		<div className="relative w-full px-6 py-6">

			<div className="relative left-1/2 w-full max-w-[580px] -translate-x-[calc(50%+111px)]">

				<div className="mx-auto max-w-[460px]">
					<FeedTabs activeTab={sortBy} onTabChange={setSortBy} />
				</div>

				<div className="mb-4 mt-8 flex items-center gap-4">
					<Link
						href="/main/quizbits"
						aria-label="Back to Quizbits"
						className="flex h-6 w-6 items-center justify-center hover:opacity-60"
					>
						<Image
							src="/assets/icons/next-left.svg"
							alt=""
							width={8}
							height={12}
						/>
					</Link>

					<h1 className="text-lg font-semibold text-[#343B36]">
						{course}
					</h1>
				</div>

				{loaded && (
					<QuizGrid
						quizzes={courseQuizzes}
						emptyMessage={`No quizzes under ${course} yet.`}
					/>
				)}
			</div>

			<div className="absolute right-6 top-6 hidden w-[225px] xl:block">
				<RecentPosts />
			</div>
		</div>
	);
}
