
"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import QuizQuestion from "./quiz-question";
import QuizScoreGauge from "./quiz-score-gauge";

import {
	formatTimer,
	type Quiz,
	type QuizAttempt,
} from "@/data/quizzes";

interface QuizResultsProps {
	quiz: Quiz;
	attempts: QuizAttempt[];
}

function toPercent(attempt: QuizAttempt) {
	return attempt.total === 0
		? 0
		: Math.round((attempt.score / attempt.total) * 100);
}

export default function QuizResults({ quiz, attempts }: QuizResultsProps) {
	const router = useRouter();

	const [selectedId, setSelectedId] = useState<number | null>(null);

	const [historyOpen, setHistoryOpen] = useState(true);

	const attempt =
		attempts.find((item) => item.id === selectedId) ??
		attempts[attempts.length - 1];

	const hasUngraded = quiz.questions.length > attempt.total;

	return (
		<article className="rounded-sm border border-gray-200 bg-white px-6 pb-8 pt-6">

			<div className="flex items-center gap-5">
				<button
					type="button"
					onClick={() => router.push(`/quizbits/${quiz.id}`)}
					aria-label="Back to quiz"
					className="flex h-8 w-8 shrink-0 items-center justify-center hover:opacity-60"
				>
					<Image src="/assets/icons/back.svg" alt="" width={18} height={18} />
				</button>

				<div className="min-w-0 flex-1">
					<h1 className="text-xl font-semibold text-[#343B36]">Results</h1>
					<p className="truncate text-xs text-gray-500">{quiz.title}</p>
				</div>

				<Link
					href={`/quizbits/${quiz.id}`}
					className="shrink-0 rounded-full border border-[#00A651] px-14 py-2 text-sm font-semibold text-[#00A651] transition-colors hover:bg-green-50"
				>
					Retake
				</Link>
			</div>

			<div className="mt-6 flex flex-wrap items-center gap-x-14 gap-y-6 border-b border-gray-200 pb-8 pl-6">
				<QuizScoreGauge percent={toPercent(attempt)} />

				<div>
					<p className="text-2xl font-semibold text-[#343B36]">
						{attempt.score}
					</p>
					<p className="text-sm font-semibold text-gray-300">
						Out of {attempt.total} points
					</p>
				</div>

				<div>
					<p className="text-2xl font-semibold text-[#343B36]">
						{formatTimer(attempt.timeTaken)}
					</p>
					<p className="text-sm font-semibold text-gray-300">
						Time for this attempt
					</p>
				</div>

				{hasUngraded && (
					<p className="w-full text-xs text-gray-400">
						Essay and file upload items are not automatically graded
						and are not included in the score.
					</p>
				)}
			</div>

			<section className="border-b border-gray-200 py-6 pl-8">
				<button
					type="button"
					onClick={() => setHistoryOpen(!historyOpen)}
					aria-expanded={historyOpen}
					className="flex items-center gap-8"
				>
					<h2 className="text-xl font-semibold text-[#343B36]">
						Attempt History
					</h2>
					<Image
						src="/assets/icons/dropdown.svg"
						alt=""
						width={12}
						height={12}
						className={`transition-transform duration-200 ${
							historyOpen ? "" : "-rotate-90"
						}`}
					/>
				</button>

				{historyOpen && (
					<table className="mt-3 w-full max-w-[340px] text-left">
						<thead>
							<tr className="text-sm text-[#343B36]">
								<th className="pb-3 font-normal">Results</th>
								<th className="pb-3 font-normal">Points</th>
								<th className="pb-3 font-normal">Score</th>
							</tr>
						</thead>

						<tbody>
							{attempts.map((item, index) => {
								const isSelected = item.id === attempt.id;

								return (
									<tr
										key={item.id}
										onClick={() => setSelectedId(item.id)}
										className={`cursor-pointer text-[11px] hover:bg-gray-50 ${
											isSelected ? "font-semibold text-[#00A651]" : ""
										}`}
									>
										<td className="py-1">
											<button
												type="button"
												onClick={() => setSelectedId(item.id)}
												aria-pressed={isSelected}
												className="hover:underline"
											>
												Attempt {index + 1}
											</button>
										</td>
										<td className="py-1">
											{item.score} of {item.total}
										</td>
										<td className="py-1">{toPercent(item)}%</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				)}
			</section>

			<section className="pt-6">
				<h2 className="pl-8 text-xl font-semibold text-[#343B36]">
					Your Answers
					<span className="ml-3 text-xs font-normal text-gray-400">
						Attempt {attempts.findIndex((item) => item.id === attempt.id) + 1}
					</span>
				</h2>

				<div className="ml-[52px]">
					{quiz.questions.map((question, index) => (
						<QuizQuestion
							key={question.id}
							question={question}
							number={index + 1}
							mode="review"
							answer={attempt.answers[question.id]}
						/>
					))}
				</div>
			</section>
		</article>
	);
}
