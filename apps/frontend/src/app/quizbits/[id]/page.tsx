/**
 * File: app/quizbits/[id]/page.tsx
 *
 * Description:
 * Displays an individual quiz, its instructions, and its questions,
 * and lets the user take the quiz.
 *
 * Features:
 * - Retrieves the quiz using its ID from the URL.
 * - Displays a not found message for missing or deleted quizzes.
 * - Uses the shared application layout for consistent navigation.
 */

"use client";

import { useParams } from "next/navigation";

import MainLayout from "@/components/layout/main-layout";
import QuizTaker from "@/components/quizzes/quiz-taker";
import QuizNotFound from "@/components/quizzes/quiz-not-found";

import { useQuizzes } from "@/context/quizzes-context";

/**
 * QuizPage Component
 *
 * @returns The quiz page.
 */
export default function QuizPage() {
	return (
		<MainLayout>
			<QuizPageContent />
		</MainLayout>
	);
}

function QuizPageContent() {
	const params = useParams<{ id: string }>();

	const { getQuiz, loaded } = useQuizzes();

	// Wait for saved quizzes to load before deciding the quiz is missing.
	if (!loaded) return null;

	const quiz = getQuiz(Number(params.id));

	if (!quiz) return <QuizNotFound />;

	// The key resets the attempt state when navigating between quizzes.
	return <QuizTaker key={quiz.id} quiz={quiz} />;
}
