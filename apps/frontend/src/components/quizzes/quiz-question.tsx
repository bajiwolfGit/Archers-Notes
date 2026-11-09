"use client";

import {
	isAnswerCorrect,
	isAutoGraded,
	type QuizAnswer,
	type QuizQuestion as QuizQuestionData,
} from "@/data/quizzes";

export type QuizQuestionMode = "preview" | "answer" | "review";

interface QuizQuestionProps {
	question: QuizQuestionData;
	number: number;
	mode: QuizQuestionMode;
	answer?: QuizAnswer;
	onAnswer?: (answer: QuizAnswer) => void;
}

export default function QuizQuestion({
	question,
	number,
	mode,
	answer,
	onAnswer,
}: QuizQuestionProps) {
	const disabled = mode !== "answer";
	const autoGraded = isAutoGraded(question);
	const correct = mode === "review" && isAnswerCorrect(question, answer);
	const selected = Array.isArray(answer) ? answer : [];

	const pointsLabel = !autoGraded
		? "Not auto-graded"
		: mode === "review"
			? `${correct ? 1 : 0}/1 point`
			: "1 point";

	function handleChoice(index: number) {
		if (disabled || !onAnswer) return;

		if (question.type === "single") {
			onAnswer([index]);
			return;
		}

		onAnswer(
			selected.includes(index)
				? selected.filter((value) => value !== index)
				: [...selected, index]
		);
	}

	return (
		<div
			id={`question-${question.id}`}
			className="relative scroll-mt-24 border-b border-gray-200 py-8 pl-8 pr-2"
		>
			
			<span className="absolute -left-12 top-8 flex h-6 w-9 items-center justify-center bg-[#343A36] text-xs font-semibold text-white">
				{number}
			</span>

			<p
				className={`text-xs font-semibold ${
					mode === "review" && autoGraded
						? correct
							? "text-[#00A651]"
							: "text-red-500"
						: "text-gray-400"
				}`}
			>
				{pointsLabel}
			</p>

			<p className="mt-2 whitespace-pre-line text-xs leading-relaxed text-[#343B36]">
				{question.prompt}
			</p>

			{autoGraded && (
				<fieldset className="mt-4 space-y-2 pl-6" disabled={disabled}>
					<legend className="sr-only">Question {number} choices</legend>

					{question.choices.map((choice, index) => {
						const isSelected = selected.includes(index);
						const isKey = question.correct.includes(index);

						const reviewClass =
							mode !== "review"
								? ""
								: isKey
									? "font-semibold text-[#00A651]"
									: isSelected
										? "text-red-500 line-through"
										: "";

						return (
							<label
								key={index}
								className={`flex items-center gap-4 text-xs ${
									disabled ? "" : "cursor-pointer"
								} ${reviewClass}`}
							>
								{disabled ? (
									
									<span
										aria-hidden="true"
										className={`h-3.5 w-3.5 shrink-0 border border-[#343A36] ${
											question.type === "single" ? "rounded-full" : "rounded-sm"
										} ${isSelected ? "bg-[#343A36]" : "bg-white"}`}
									/>
								) : (
									<input
										type={question.type === "single" ? "radio" : "checkbox"}
										name={`question-${question.id}`}
										checked={isSelected}
										onChange={() => handleChoice(index)}
										className="h-3.5 w-3.5 accent-[#343A36]"
									/>
								)}

								{disabled && isSelected && (
									<span className="sr-only">(selected)</span>
								)}
								<span>{choice}</span>

								{mode === "review" && isKey && (
									<span className="text-[10px] font-normal">
										Correct answer
									</span>
								)}
							</label>
						);
					})}
				</fieldset>
			)}

			{question.type === "essay" && (
				<textarea
					value={typeof answer === "string" ? answer : ""}
					onChange={(event) => onAnswer?.(event.target.value)}
					disabled={disabled}
					placeholder={disabled && mode === "preview" ? "Your answer" : "Type your answer..."}
					aria-label={`Answer for question ${number}`}
					className="mt-4 h-[110px] w-full resize-none rounded-md border border-gray-300 p-3 text-xs outline-none focus:border-[#00A651] disabled:bg-gray-50"
				/>
			)}

			{question.type === "upload" && (
				<div className="mt-4">
					{mode === "answer" ? (
						<label className="inline-flex cursor-pointer items-center gap-3 rounded-full border border-[#00A651] px-4 py-1.5 text-xs text-[#00A651] hover:bg-green-50">
							Upload File
							<input
								type="file"
								className="hidden"
								onChange={(event) =>
									onAnswer?.(event.target.files?.[0]?.name ?? "")
								}
							/>
						</label>
					) : null}

					{typeof answer === "string" && answer && (
						<p className="mt-2 text-xs text-gray-600">
							Uploaded: <span className="font-semibold">{answer}</span>
						</p>
					)}

					{mode !== "answer" && !answer && (
						<p className="text-xs text-gray-400">
							{mode === "preview" ? "File upload answer" : "No file uploaded."}
						</p>
					)}
				</div>
			)}
		</div>
	);
}
