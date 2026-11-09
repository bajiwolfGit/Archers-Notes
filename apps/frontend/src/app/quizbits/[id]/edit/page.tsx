"use client";

import { useParams } from "next/navigation";
import Link from "next/link";

import MainLayout from "@/components/layout/main-layout";
import QuizEditor from "@/components/quizzes/quiz-editor";
import QuizNotFound from "@/components/quizzes/quiz-not-found";

import { useQuizzes } from "@/context/quizzes-context";
import { CURRENT_USER_ID } from "@/data/quizzes";

export default function EditQuizPage() {
	return (
		<MainLayout>
			<EditQuizContent />
		</MainLayout>
	);
}

function EditQuizContent() {
	const params = useParams<{ id: string }>();

	const { getQuiz, loaded } = useQuizzes();

	if (!loaded) return null;

	const quiz = getQuiz(Number(params.id));

	if (!quiz) return <QuizNotFound />;

	if (quiz.authorId !== CURRENT_USER_ID) {
		return (
			<div className="mx-auto w-full max-w-[480px] px-6 py-20 text-center">
				<h1 className="text-lg font-semibold text-[#343B36]">
					You can&apos;t edit this quiz
				</h1>
				<p className="mt-2 text-sm text-gray-500">
					Only the creator of a quiz can edit it.
				</p>
				<Link
					href={`/quizbits/${quiz.id}`}
					className="mt-6 inline-block rounded-full border border-[#00A651] px-6 py-2 text-sm text-[#00A651] hover:bg-green-50"
				>
					View Quiz
				</Link>
			</div>
		);
	}

	return <QuizEditor key={quiz.id} quiz={quiz} />;
}
