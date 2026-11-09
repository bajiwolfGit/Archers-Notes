"use client";

import {
	formatTimer,
	isAnswered,
	type QuizAnswer,
	type QuizQuestion,
} from "@/data/quizzes";

interface QuizDetailsPanelProps {
	started: boolean;
	elapsed: number;
	duration: number;
	questions: QuizQuestion[];
	answers: Record<string, QuizAnswer>;
	onStart: () => void;
}

export function scrollToQuestion(id: string) {
	document
		.getElementById(`question-${id}`)
		?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function QuizDetailsPanel({
	started,
	elapsed,
	duration,
	questions,
	answers,
	onStart,
}: QuizDetailsPanelProps) {

	const remaining = duration * 60 - elapsed;
	const isEnding = started && remaining <= 60;

	return (
		<aside className="w-full rounded-sm border border-gray-200 bg-white p-5">
			<h2 className="text-sm font-semibold">Details</h2>

			{!started && (
				<div className="mt-4 flex justify-center border-b border-gray-200 pb-5">
					<button
						type="button"
						onClick={onStart}
						className="rounded-full border border-[#00A651] px-7 py-2 text-xs text-[#00A651] transition-colors hover:bg-green-50"
					>
						Take the Quiz
					</button>
				</div>
			)}

			<div className="border-b border-gray-200 py-6 pl-3">
				<p
					className={`text-3xl font-bold ${
						isEnding ? "text-red-500" : "text-[#343B36]"
					}`}
					role="timer"
					aria-live="off"
				>
					{formatTimer(elapsed)}
				</p>

				<p className="mt-1 text-sm text-gray-300">
					Quiz Duration: {duration} mins
				</p>

				{isEnding && (
					<p className="mt-1 text-xs text-red-500">
						Less than a minute left!
					</p>
				)}
			</div>

			<div className="pt-5">
				<p className="mb-2 text-xs">Questions</p>

				<ul className="space-y-1.5">
					{questions.map((question, index) => {
						const answered = isAnswered(answers[question.id]);

						return (
							<li key={question.id}>
								<button
									type="button"
									onClick={() => scrollToQuestion(question.id)}
									className="flex items-center gap-3 text-xs hover:underline"
								>
									<span
										className={`h-3 w-3 rounded-full border border-[#343A36] ${
											answered ? "bg-[#343A36]" : "bg-white"
										}`}
										aria-hidden="true"
									/>
									Item {index + 1}
									<span className="sr-only">
										{answered ? "(answered)" : "(unanswered)"}
									</span>
								</button>
							</li>
						);
					})}
				</ul>
			</div>
		</aside>
	);
}
