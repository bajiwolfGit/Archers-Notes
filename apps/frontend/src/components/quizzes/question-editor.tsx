"use client";

import { useEffect, useRef, useState } from "react";

import Image from "next/image";

import {
	questionTypeLabels,
	type QuestionType,
	type QuizQuestion,
} from "@/data/quizzes";

const MAX_CHOICES = 8;

const MIN_CHOICES = 2;

const questionTypes: QuestionType[] = ["essay", "checkbox", "single", "upload"];

interface QuestionEditorProps {
	question: QuizQuestion;
	number: number;
	onChange: (question: QuizQuestion) => void;
	onDelete: () => void;
}

export default function QuestionEditor({
	question,
	number,
	onChange,
	onDelete,
}: QuestionEditorProps) {

	const [typeMenuOpen, setTypeMenuOpen] = useState(false);

	const typeMenuRef = useRef<HTMLDivElement>(null);

	const hasChoices = question.type === "single" || question.type === "checkbox";

	useEffect(() => {
		if (!typeMenuOpen) return;

		function handleClickOutside(event: MouseEvent) {
			const target = event.target;

			if (!(target instanceof Node)) return;

			if (typeMenuRef.current && !typeMenuRef.current.contains(target)) {
				setTypeMenuOpen(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [typeMenuOpen]);

	function handleTypeChange(type: QuestionType) {
		setTypeMenuOpen(false);

		onChange({
			...question,
			type,
			correct:
				type === "single" ? question.correct.slice(0, 1) : question.correct,
			choices:
				question.choices.length >= MIN_CHOICES
					? question.choices
					: ["", "", "", ""],
		});
	}

	function handleChoiceChange(index: number, value: string) {
		onChange({
			...question,
			choices: question.choices.map((choice, i) =>
				i === index ? value : choice
			),
		});
	}

	function handleToggleCorrect(index: number) {
		if (question.type === "single") {
			onChange({ ...question, correct: [index] });
			return;
		}

		onChange({
			...question,
			correct: question.correct.includes(index)
				? question.correct.filter((value) => value !== index)
				: [...question.correct, index],
		});
	}

	function handleAddChoice() {
		if (question.choices.length >= MAX_CHOICES) return;

		onChange({ ...question, choices: [...question.choices, ""] });
	}

	function handleRemoveChoice(index: number) {
		if (question.choices.length <= MIN_CHOICES) return;

		onChange({
			...question,
			choices: question.choices.filter((_, i) => i !== index),
			correct: question.correct
				.filter((value) => value !== index)
				.map((value) => (value > index ? value - 1 : value)),
		});
	}

	return (
		<div id={`question-${question.id}`} className="scroll-mt-24">

			<div className="rounded-md border border-gray-200 px-3 pb-2 pt-1.5 focus-within:border-[#00A651]">
				<label
					htmlFor={`prompt-${question.id}`}
					className="block text-[10px] text-gray-400"
				>
					Question {number}
				</label>

				<textarea
					id={`prompt-${question.id}`}
					value={question.prompt}
					onChange={(event) =>
						onChange({ ...question, prompt: event.target.value })
					}
					placeholder="Write your question..."
					rows={2}
					className="mt-1 w-full resize-none text-sm outline-none placeholder:text-gray-300"
				/>

				<div className="flex justify-end">
					<button
						type="button"
						onClick={onDelete}
						aria-label={`Delete question ${number}`}
						title="Delete question"
						className="flex h-6 w-6 items-center justify-center rounded hover:bg-red-50"
					>
						<Image src="/assets/icons/delete.svg" alt="" width={14} height={14} />
					</button>
				</div>
			</div>

			<div ref={typeMenuRef} className="relative mt-3 w-[200px]">
				<button
					type="button"
					onClick={() => setTypeMenuOpen(!typeMenuOpen)}
					aria-haspopup="listbox"
					aria-expanded={typeMenuOpen}
					className="flex w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2.5 text-xs"
				>
					{questionTypeLabels[question.type]}
					<Image
						src="/assets/icons/dropdown.svg"
						alt=""
						width={10}
						height={10}
						className={`transition-transform duration-200 ${
							typeMenuOpen ? "rotate-180" : ""
						}`}
					/>
				</button>

				{typeMenuOpen && (
					<ul
						role="listbox"
						aria-label="Question type"
						className="absolute left-0 top-full z-40 w-full overflow-hidden rounded-b-md border border-gray-200 bg-white shadow-md"
					>
						{questionTypes.map((type) => {
							const selected = question.type === type;

							return (
								<li key={type} role="option" aria-selected={selected}>
									<button
										type="button"
										onClick={() => handleTypeChange(type)}
										className={`w-full border-l-4 py-3 text-center text-xs font-semibold hover:bg-green-50 ${
											selected
												? "border-[#00A651] bg-green-50"
												: "border-transparent"
										}`}
									>
										{questionTypeLabels[type]}
									</button>
								</li>
							);
						})}
					</ul>
				)}
			</div>

			{hasChoices ? (
				<div className="mt-4">
					<p className="mb-2 text-[10px] text-gray-400">
						{question.type === "single"
							? "Select the correct answer."
							: "Select all correct answers."}
					</p>

					<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
						{question.choices.map((choice, index) => {
							const isCorrect = question.correct.includes(index);

							return (
								<div
									key={index}
									className={`flex items-center gap-2 rounded-md border px-3 py-2 ${
										isCorrect ? "border-[#00A651] bg-green-50/50" : "border-gray-200"
									}`}
								>
									<input
										type={question.type === "single" ? "radio" : "checkbox"}
										name={`correct-${question.id}`}
										checked={isCorrect}
										onChange={() => handleToggleCorrect(index)}
										aria-label={`Mark choice ${index + 1} as correct`}
										title="Mark as correct"
										className="h-3.5 w-3.5 shrink-0 accent-[#00A651]"
									/>

									<div className="min-w-0 flex-1">
										<label
											htmlFor={`choice-${question.id}-${index}`}
											className="block text-[10px] text-gray-400"
										>
											Choice {index + 1}
										</label>
										<input
											id={`choice-${question.id}-${index}`}
											value={choice}
											onChange={(event) =>
												handleChoiceChange(index, event.target.value)
											}
											className="w-full text-xs outline-none"
										/>
									</div>

									{question.choices.length > MIN_CHOICES && (
										<button
											type="button"
											onClick={() => handleRemoveChoice(index)}
											aria-label={`Remove choice ${index + 1}`}
											className="shrink-0 hover:opacity-60"
										>
											<Image src="/assets/icons/exit.svg" alt="" width={8} height={8} />
										</button>
									)}
								</div>
							);
						})}

						{question.choices.length < MAX_CHOICES && (
							<button
								type="button"
								onClick={handleAddChoice}
								aria-label="Add a choice"
								title="Add a choice"
								className="flex h-6 w-6 items-center justify-center self-center rounded-full border border-[#343A36] text-sm leading-none text-[#343A36] hover:bg-gray-100"
							>
								+
							</button>
						)}
					</div>
				</div>
			) : (
				<p className="mt-4 text-xs text-gray-400">
					{question.type === "essay"
						? "Quiz takers will type their answer. Essay items are not automatically graded."
						: "Quiz takers will upload a file. Upload items are not automatically graded."}
				</p>
			)}
		</div>
	);
}
