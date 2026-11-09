"use client";

import Link from "next/link";

import QuizGrid from "@/components/home/quiz-grid";

import { useQuizzes } from "@/context/quizzes-context";

import { CURRENT_USER_ID } from "@/data/quizzes";

export default function ProfileQuizzes() {
	const { quizzes, loaded } = useQuizzes();

	const myQuizzes = quizzes.filter(
		(quiz) => quiz.authorId === CURRENT_USER_ID
	);

	return (
		<section className="mt-10">
			<div className="mb-4 flex items-center justify-between">
				<h2 className="text-lg font-semibold text-[#343B36]">
					My Quizzes
				</h2>

				<Link
					href="/main/create-quiz"
					className="text-xs font-semibold text-[#00A651] hover:underline"
				>
					+ Create a Quiz
				</Link>
			</div>

			{loaded && (
				<QuizGrid
					quizzes={myQuizzes}
					emptyMessage="You haven't created any quizzes yet."
				/>
			)}
		</section>
	);
}
