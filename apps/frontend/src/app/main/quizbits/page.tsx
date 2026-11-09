"use client";

import { useState } from "react";

import Image from "next/image";
import Link from "next/link";

import MainLayout from "@/components/layout/main-layout";

import FeedTabs from "@/components/home/feed-tabs";

import RecentPosts from "@/components/home/recent-posts";

import QuizGrid from "@/components/home/quiz-grid";

import { useQuizzes } from "@/context/quizzes-context";

import { sortQuizzes, type QuizSort } from "@/data/quizzes";

const QUIZZES_PER_COURSE = 6;

export default function QuizbitsPage() {
	return (
		<MainLayout>
			<QuizbitsContent />
		</MainLayout>
	);
}

function QuizbitsContent() {

	const [sortBy, setSortBy] = useState<QuizSort>("Trending");

	const { quizzes, loaded } = useQuizzes();

	const published = sortQuizzes(
		quizzes.filter((quiz) => quiz.status === "published"),
		sortBy
	);

	const courses = Array.from(
		new Set(published.map((quiz) => quiz.course))
	).sort();

	return (
		<div className="relative w-full px-6 py-6">

			<div className="relative left-1/2 w-full max-w-[580px] -translate-x-[calc(50%+111px)]">

				<div className="mx-auto max-w-[460px]">
					<FeedTabs activeTab={sortBy} onTabChange={setSortBy} />
				</div>

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

			<div className="absolute right-6 top-6 hidden w-[225px] xl:block">
				<RecentPosts />
			</div>
		</div>
	);
}
