"use client";

import Link from "next/link";

import type { Quiz } from "@/data/quizzes";

interface QuizCardProps {
	quiz: Quiz;
}

export default function QuizCard({ quiz }: QuizCardProps) {
	const isDraft = quiz.status === "draft";

	return (
		<article className="flex flex-col overflow-hidden rounded-sm border border-gray-200 bg-white">

			<div
				className="relative h-[68px] w-full"
				style={{ backgroundColor: quiz.color }}
			>
				{isDraft && (
					<span className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-gray-600">
						Draft
					</span>
				)}
			</div>

			<div className="flex flex-1 flex-col items-center justify-between gap-3 border-t border-gray-200 px-3 pb-3 pt-3">
				<h3
					className="line-clamp-2 min-h-8 text-center text-[11px] font-semibold leading-4 text-[#343B36]"
					title={quiz.title}
				>
					{quiz.title}
				</h3>

				<Link
					href={
						isDraft
							? `/quizbits/${quiz.id}/edit`
							: `/quizbits/${quiz.id}`
					}
					className="w-full rounded-full border bg-white py-2 text-center text-sm font-semibold transition-opacity hover:opacity-70"
					style={{ borderColor: quiz.color, color: quiz.color }}
				>
					{isDraft ? "Edit Draft" : "Take Quiz"}
				</Link>
			</div>
		</article>
	);
}
