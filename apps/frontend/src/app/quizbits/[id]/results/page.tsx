"use client";

import { useParams } from "next/navigation";
import Link from "next/link";

import MainLayout from "@/components/layout/main-layout";
import QuizResults from "@/components/quizzes/quiz-results";
import QuizNotFound from "@/components/quizzes/quiz-not-found";

import { useQuizzes } from "@/context/quizzes-context";

export default function QuizResultsPage() {
	return (
		<MainLayout>
			<QuizResultsContent />
		</MainLayout>
	);
}

function QuizResultsContent() {
	const params = useParams<{ id: string }>();

	const { getQuiz, getAttempts, loaded } = useQuizzes();

	if (!loaded) return null;

	const quiz = getQuiz(Number(params.id));

	if (!quiz) return <QuizNotFound />;

	const attempts = getAttempts(quiz.id);

	return (
		<div className="relative w-full px-6 py-8">
			<div className="mx-auto w-full max-w-[790px]">
				{attempts.length === 0 ? (
					<div className="py-20 text-center">
						<h1 className="text-lg font-semibold text-[#343B36]">
							No results yet
						</h1>
						<p className="mt-2 text-sm text-gray-500">
							You haven&apos;t taken {quiz.title} yet.
						</p>
						<Link
							href={`/quizbits/${quiz.id}`}
							className="mt-6 inline-block rounded-full border border-[#00A651] px-6 py-2 text-sm text-[#00A651] hover:bg-green-50"
						>
							Take the Quiz
						</Link>
					</div>
				) : (
					<QuizResults quiz={quiz} attempts={attempts} />
				)}
			</div>
		</div>
	);
}
