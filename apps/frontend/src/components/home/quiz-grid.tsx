"use client";

import QuizCard from "./quiz-card";

import type { Quiz } from "@/data/quizzes";

interface QuizGridProps {
	quizzes: Quiz[];
	emptyMessage?: string;
}

export default function QuizGrid({
	quizzes,
	emptyMessage = "No quizzes yet.",
}: QuizGridProps) {
	if (quizzes.length === 0) {
		return (
			<p className="py-8 text-center text-xs text-gray-500">
				{emptyMessage}
			</p>
		);
	}

	return (
		<div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
			{quizzes.map((quiz) => (
				<QuizCard key={quiz.id} quiz={quiz} />
			))}
		</div>
	);
}
