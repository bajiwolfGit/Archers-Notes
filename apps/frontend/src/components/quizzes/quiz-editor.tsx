"use client";

import { Fragment, useEffect, useRef, useState } from "react";

import { useRouter } from "next/navigation";
import Image from "next/image";

import QuestionEditor from "./question-editor";
import { scrollToQuestion } from "./quiz-details-panel";

import RichTextEditor from "@/components/ui/rich-text-editor";

import { useQuizzes } from "@/context/quizzes-context";

import {
	CURRENT_USER_ID,
	createEmptyQuestion,
	quizColors,
	type Quiz,
	type QuizQuestion,
	type QuizStatus,
} from "@/data/quizzes";

type EditorTab = "Details" | "Quiz";

const DEFAULT_COURSES = [
	"CSADPRG",
	"CSARCH1",
	"CSNETWK",
	"DATA103",
	"STALGCM",
	"FNDACCT",
];

const COURSES_STORAGE_KEY = "archers-notes-courses";

interface QuizEditorProps {
	quiz?: Quiz;
}

function isQuestionComplete(question: QuizQuestion): boolean {
	if (!question.prompt.trim()) return false;

	if (question.type === "essay" || question.type === "upload") return true;

	const filledChoices = question.choices.filter((choice) => choice.trim());

	return (
		filledChoices.length >= 2 &&
		question.correct.some((index) => question.choices[index]?.trim())
	);
}

function normalizeQuestion(question: QuizQuestion): QuizQuestion {
	if (question.type === "essay" || question.type === "upload") {
		return { ...question, prompt: question.prompt.trim(), choices: [], correct: [] };
	}

	const choices: string[] = [];
	const correct: number[] = [];

	question.choices.forEach((choice, index) => {
		if (!choice.trim()) return;

		if (question.correct.includes(index)) correct.push(choices.length);

		choices.push(choice.trim());
	});

	return { ...question, prompt: question.prompt.trim(), choices, correct };
}

export default function QuizEditor({ quiz }: QuizEditorProps) {
	const router = useRouter();

	const { addQuiz, updateQuiz, getQuiz } = useQuizzes();

	const isEditing = Boolean(quiz);

	const [activeTab, setActiveTab] = useState<EditorTab>("Details");

	const [title, setTitle] = useState(quiz?.title ?? "");
	const [course, setCourse] = useState(quiz?.course ?? "");
	const [duration, setDuration] = useState(quiz ? String(quiz.duration) : "");
	const [instructions, setInstructions] = useState(quiz?.instructions ?? "");
	
	const [questions, setQuestions] = useState<QuizQuestion[]>(
		quiz?.questions.length
			? quiz.questions
			: [{ ...createEmptyQuestion(), id: "new-question-1" }]
	);

	const [courseOptions, setCourseOptions] = useState<string[]>(DEFAULT_COURSES);

	const [errors, setErrors] = useState<string[]>([]);

	const [savedMessage, setSavedMessage] = useState("");

	const quizIdRef = useRef<number | null>(quiz?.id ?? null);

	const [scrollTarget, setScrollTarget] = useState<string | null>(null);

	useEffect(() => {
		try {
			const stored = localStorage.getItem(COURSES_STORAGE_KEY);

			if (!stored) return;

			const parsed: { code: string }[] = JSON.parse(stored);

			if (Array.isArray(parsed)) {
				setCourseOptions(
					Array.from(
						new Set([...parsed.map((item) => item.code), ...DEFAULT_COURSES])
					)
				);
			}
		} catch (error) {
			console.error("Failed to load courses:", error);
		}
	}, []);

	useEffect(() => {
		if (!scrollTarget) return;

		scrollToQuestion(scrollTarget);
		setScrollTarget(null);
	}, [scrollTarget]);

	useEffect(() => {
		if (!savedMessage) return;

		const timeout = window.setTimeout(() => setSavedMessage(""), 3000);

		return () => window.clearTimeout(timeout);
	}, [savedMessage]);

	function handleQuestionChange(updated: QuizQuestion) {
		setQuestions((prev) =>
			prev.map((question) => (question.id === updated.id ? updated : question))
		);
	}

	function handleDeleteQuestion(id: string) {
		setQuestions((prev) =>
			prev.length === 1
				? [createEmptyQuestion()]
				: prev.filter((question) => question.id !== id)
		);
	}

	function handleInsertQuestion(afterIndex: number) {
		const newQuestion = createEmptyQuestion();

		setQuestions((prev) => [
			...prev.slice(0, afterIndex + 1),
			newQuestion,
			...prev.slice(afterIndex + 1),
		]);

		setActiveTab("Quiz");
		setScrollTarget(newQuestion.id);
	}

	function handleJumpToQuestion(id: string) {
		setActiveTab("Quiz");
		setScrollTarget(id);
	}

	function validate(forPublish: boolean): string[] {
		const issues: string[] = [];

		if (!title.trim()) issues.push("Add a title.");

		if (!forPublish) return issues;

		if (!course) issues.push("Select a course.");

		const minutes = Number(duration);

		if (!Number.isInteger(minutes) || minutes < 1 || minutes > 300) {
			issues.push("Set a quiz duration between 1 and 300 minutes.");
		}

		questions.forEach((question, index) => {
			if (!isQuestionComplete(question)) {
				issues.push(
					question.prompt.trim()
						? `Item ${index + 1}: add at least two choices and mark the correct answer.`
						: `Item ${index + 1}: write the question.`
				);
			}
		});

		return issues;
	}

	function saveQuiz(status: QuizStatus): number {
		const existingId = quizIdRef.current;
		const existing = existingId === null ? undefined : getQuiz(existingId);

		const saved: Quiz = {
			id: existingId ?? Date.now(),
			authorId: existing?.authorId ?? CURRENT_USER_ID,
			author: existing?.author ?? "John Doe",
			course,
			title: title.trim(),
			instructions,
			duration: Math.max(1, Number(duration) || 0),
			color:
				existing?.color ??
				quizColors[Math.floor(Math.random() * quizColors.length)],
			questions: questions.map(normalizeQuestion),
			takers: existing?.takers ?? 0,
			status,
			createdAt: existing?.createdAt ?? new Date().toISOString(),
		};

		if (existing) {
			updateQuiz(saved);
		} else {
			addQuiz(saved);
			quizIdRef.current = saved.id;
		}

		return saved.id;
	}

	function handleSaveChanges() {
		const issues = validate(false);

		setErrors(issues);

		if (issues.length > 0) {
			setActiveTab("Details");
			return;
		}

		const existing =
			quizIdRef.current === null ? undefined : getQuiz(quizIdRef.current);

		const status = existing?.status ?? "draft";

		const id = saveQuiz(status);

		setSavedMessage(
			status === "draft" ? "Draft saved." : "Changes saved."
		);

		if (!isEditing) {
			router.replace(`/quizbits/${id}/edit`);
		}
	}

	function handlePublish() {
		const issues = validate(true);

		setErrors(issues);

		if (issues.length > 0) return;

		const id = saveQuiz("published");

		router.push(`/quizbits/${id}`);
	}

	const tabs: EditorTab[] = ["Details", "Quiz"];

	return (
		<div className="relative w-full px-6 py-6">

			<div className="relative left-1/2 w-full max-w-[560px] -translate-x-[calc(50%+111px)]">

				<div
					role="tablist"
					aria-label="Quiz editor sections"
					className="mx-auto flex h-[36px] w-full max-w-[460px] rounded border border-[#00A651] p-[2px]"
				>
					{tabs.map((tab) => (
						<button
							key={tab}
							type="button"
							role="tab"
							aria-selected={activeTab === tab}
							onClick={() => setActiveTab(tab)}
							className={`flex-1 rounded-sm text-sm transition-colors ${
								activeTab === tab
									? "bg-[#00A651] text-white"
									: "bg-white text-[#00A651]"
							}`}
						>
							{tab}
						</button>
					))}
				</div>

				<div className="mt-6 rounded-sm border border-gray-200 bg-white px-6 pb-8 pt-6">

					<div className="flex items-center gap-5">
						<button
							type="button"
							onClick={() => router.back()}
							aria-label="Go back"
							className="flex h-8 w-8 shrink-0 items-center justify-center hover:opacity-60"
						>
							<Image src="/assets/icons/back.svg" alt="" width={18} height={18} />
						</button>

						<h1 className="flex-1 text-xl font-semibold text-[#343B36]">
							{isEditing ? "Edit Quiz" : "Create Quiz"}
						</h1>

						<button
							type="button"
							onClick={handleSaveChanges}
							className="shrink-0 rounded-full border border-[#00A651] px-6 py-2 text-sm text-[#00A651] transition-colors hover:bg-green-50"
						>
							Save Changes
						</button>
					</div>

					{savedMessage && (
						<p role="status" className="mt-3 text-right text-xs text-[#00A651]">
							{savedMessage}
						</p>
					)}

					{errors.length > 0 && (
						<ul
							role="alert"
							className="ml-[52px] mt-4 space-y-1 rounded-md bg-[var(--danger-light)] px-4 py-3 text-xs text-[var(--danger)]"
						>
							{errors.map((error) => (
								<li key={error}>{error}</li>
							))}
						</ul>
					)}

					<div
						role="tabpanel"
						hidden={activeTab !== "Details"}
						className="ml-[52px] mt-6 space-y-4"
					>

						<div className="rounded-md border border-gray-200 px-3 py-1.5 focus-within:border-[#00A651]">
							<label htmlFor="quiz-title" className="block text-[10px] text-gray-400">
								Title
							</label>
							<input
								id="quiz-title"
								value={title}
								onChange={(event) => setTitle(event.target.value)}
								maxLength={200}
								className="w-full text-sm font-semibold outline-none"
							/>
						</div>

						<div className="rounded-md border border-gray-200 px-3 py-1.5">
							<label htmlFor="quiz-course" className="block text-[10px] text-gray-400">
								Course
							</label>

							{course ? (
								<span className="my-1 inline-flex items-center gap-2 rounded-full bg-[#E7EEE9] px-3 py-1 text-xs font-semibold">
									{course}
									<button
										type="button"
										onClick={() => setCourse("")}
										aria-label={`Remove ${course}`}
										className="hover:opacity-60"
									>
										<Image src="/assets/icons/exit.svg" alt="" width={8} height={8} />
									</button>
								</span>
							) : (
								<select
									id="quiz-course"
									value=""
									onChange={(event) => setCourse(event.target.value)}
									className="my-1 w-full bg-white text-sm text-gray-500 outline-none"
								>
									<option value="" disabled>
										Select a course
									</option>
									{courseOptions.map((option) => (
										<option key={option} value={option}>
											{option}
										</option>
									))}
								</select>
							)}
						</div>

						<div className="w-[180px] rounded-md border border-gray-200 px-3 py-1.5 focus-within:border-[#00A651]">
							<label htmlFor="quiz-duration" className="block text-[10px] text-gray-400">
								Quiz Duration
							</label>
							<div className="flex items-center gap-2">
								<input
									id="quiz-duration"
									type="number"
									min={1}
									max={300}
									inputMode="numeric"
									value={duration}
									onChange={(event) => setDuration(event.target.value)}
									className="w-full text-sm outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
								/>
								<span className="text-[10px] text-gray-400">Mins</span>
							</div>
						</div>

						<div>
							<p className="mb-1 text-[10px] text-gray-400">Quiz Instructions</p>
							<RichTextEditor
								variant="notes"
								placeholder="Write the quiz instructions..."
								content={instructions}
								onChange={setInstructions}
							/>
						</div>
					</div>

					<div
						role="tabpanel"
						hidden={activeTab !== "Quiz"}
						className="ml-[52px] mt-6"
					>
						{questions.map((question, index) => (
							<Fragment key={question.id}>
								<QuestionEditor
									question={question}
									number={index + 1}
									onChange={handleQuestionChange}
									onDelete={() => handleDeleteQuestion(question.id)}
								/>

								<div className="relative my-8 flex items-center justify-center">
									<hr className="absolute inset-x-0 border-gray-200" />
									<button
										type="button"
										onClick={() => handleInsertQuestion(index)}
										aria-label={`Add a question after item ${index + 1}`}
										title="Add a question"
										className="relative flex h-7 w-7 items-center justify-center rounded-full bg-[#00A651] text-lg leading-none text-white hover:bg-[#008f45]"
									>
										+
									</button>
								</div>
							</Fragment>
						))}
					</div>
				</div>
			</div>

			<aside className="fixed right-6 top-[88px] hidden w-[215px] rounded-sm border border-gray-200 bg-white p-5 xl:block">
				<h2 className="text-sm font-semibold">Details</h2>

				<div className="mt-4 flex justify-center border-b border-gray-200 pb-5">
					<button
						type="button"
						onClick={handlePublish}
						className="rounded-full bg-[#00A651] px-8 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#008f45]"
					>
						Publish Quiz
					</button>
				</div>

				<div className="pt-4">
					<p className="mb-2 text-xs">Questions</p>

					<ul className="max-h-[calc(100vh-330px)] space-y-1.5 overflow-y-auto">
						{questions.map((question, index) => {
							const complete = isQuestionComplete(question);

							return (
								<li key={question.id}>
									<button
										type="button"
										onClick={() => handleJumpToQuestion(question.id)}
										className="flex items-center gap-3 text-xs hover:underline"
									>
										<span
											className={`h-3 w-3 rounded-full border border-[#343A36] ${
												complete ? "bg-[#343A36]" : "bg-white"
											}`}
											aria-hidden="true"
										/>
										Item {index + 1}
										<span className="sr-only">
											{complete ? "(complete)" : "(incomplete)"}
										</span>
									</button>
								</li>
							);
						})}
					</ul>

					<button
						type="button"
						onClick={() => handleInsertQuestion(questions.length - 1)}
						className="mt-3 flex items-center gap-4 text-sm font-semibold hover:opacity-70"
					>
						<Image src="/assets/icons/add.svg" alt="" width={16} height={16} />
						Add an Item
					</button>
				</div>
			</aside>

			<div className="mx-auto mt-6 flex max-w-[560px] justify-end xl:hidden">
				<button
					type="button"
					onClick={handlePublish}
					className="rounded-full bg-[#00A651] px-8 py-2 text-sm font-semibold text-white hover:bg-[#008f45]"
				>
					Publish Quiz
				</button>
			</div>
		</div>
	);
}
