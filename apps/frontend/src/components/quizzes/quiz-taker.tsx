"use client";

import { useEffect, useRef, useState } from "react";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import DOMPurify from "isomorphic-dompurify";

import QuizQuestion from "./quiz-question";
import QuizDetailsPanel from "./quiz-details-panel";
import QuizConfirmModal from "./quiz-confirm-modal";

import ReportModal from "@/components/posts/report-modal";

import { useQuizzes } from "@/context/quizzes-context";

import {
	CURRENT_USER_ID,
	gradeQuiz,
	isAnswered,
	type Quiz,
	type QuizAnswer,
} from "@/data/quizzes";

interface QuizTakerProps {
	quiz: Quiz;
}

export default function QuizTaker({ quiz }: QuizTakerProps) {
	const router = useRouter();

	const { addAttempt, deleteQuiz } = useQuizzes();

	const isOwner = quiz.authorId === CURRENT_USER_ID;

	const [started, setStarted] = useState(false);

	const [elapsed, setElapsed] = useState(0);

	const [answers, setAnswers] = useState<Record<string, QuizAnswer>>({});

	const [showExitModal, setShowExitModal] = useState(false);
	const [showSubmitModal, setShowSubmitModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [showReportModal, setShowReportModal] = useState(false);
	const [showMoreMenu, setShowMoreMenu] = useState(false);

	const startTimeRef = useRef<number | null>(null);

	const submittedRef = useRef(false);

	const moreMenuRef = useRef<HTMLDivElement>(null);

	const durationSeconds = quiz.duration * 60;

	const unansweredCount = quiz.questions.filter(
		(question) => !isAnswered(answers[question.id])
	).length;

	useEffect(() => {
		if (!started) return;

		const interval = window.setInterval(() => {
			if (startTimeRef.current === null) return;

			setElapsed(
				Math.min(
					durationSeconds,
					Math.floor((Date.now() - startTimeRef.current) / 1000)
				)
			);
		}, 1000);

		return () => window.clearInterval(interval);
	}, [started, durationSeconds]);

	useEffect(() => {
		if (!started) return;

		function handleBeforeUnload(event: BeforeUnloadEvent) {
			event.preventDefault();
		}

		window.addEventListener("beforeunload", handleBeforeUnload);

		return () => {
			window.removeEventListener("beforeunload", handleBeforeUnload);
		};
	}, [started]);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			const target = event.target;

			if (!(target instanceof Node)) return;

			if (moreMenuRef.current && !moreMenuRef.current.contains(target)) {
				setShowMoreMenu(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	function handleStart() {
		startTimeRef.current = Date.now();
		submittedRef.current = false;
		setAnswers({});
		setElapsed(0);
		setStarted(true);

		window.scrollTo({ top: 0, behavior: "smooth" });
	}

	function handleAnswer(questionId: string, answer: QuizAnswer) {
		setAnswers((prev) => ({ ...prev, [questionId]: answer }));
	}

	function submitQuiz() {
		if (submittedRef.current) return;

		submittedRef.current = true;

		const { score, total } = gradeQuiz(quiz, answers);

		const timeTaken =
			startTimeRef.current === null
				? elapsed
				: Math.min(
					durationSeconds,
					Math.floor((Date.now() - startTimeRef.current) / 1000)
				);

		addAttempt({
			id: Date.now(),
			quizId: quiz.id,
			answers,
			score,
			total,
			timeTaken,
			submittedAt: new Date().toISOString(),
		});

		setStarted(false);
		setShowSubmitModal(false);

		router.push(`/quizbits/${quiz.id}/results`);
	}

	useEffect(() => {
		if (started && elapsed >= durationSeconds) {
			submitQuiz();
		}
	});

	function handleExit() {
		setShowExitModal(false);
		setStarted(false);
		setAnswers({});
		setElapsed(0);
		startTimeRef.current = null;

		router.push("/main/quizbits");
	}

	function handleBack() {
		if (started) {
			setShowExitModal(true);
			return;
		}

		router.back();
	}

	function handleDelete() {
		deleteQuiz(quiz.id);
		setShowDeleteModal(false);
		router.replace("/main/quizbits");
	}

	const detailsPanel = (
		<QuizDetailsPanel
			started={started}
			elapsed={elapsed}
			duration={quiz.duration}
			questions={quiz.questions}
			answers={answers}
			onStart={handleStart}
		/>
	);

	return (
		<>
			<div className="relative w-full px-6 py-6">

				<div className="relative left-1/2 w-full max-w-[575px] -translate-x-[calc(50%+111px)]">

					<div className="mb-6 xl:hidden">{detailsPanel}</div>

					<article className="rounded-sm border border-gray-200 bg-white px-6 pb-6 pt-8">

						<div className="flex items-center gap-5">
							<button
								type="button"
								onClick={handleBack}
								aria-label="Go back"
								className="flex h-8 w-8 shrink-0 items-center justify-center hover:opacity-60"
							>
								<Image
									src="/assets/icons/back.svg"
									alt=""
									width={18}
									height={18}
								/>
							</button>

							<h1 className="min-w-0 flex-1 text-xl font-semibold text-[#343B36]">
								{quiz.title}
							</h1>

							{isOwner ? (
								<div className="flex shrink-0 items-center gap-3">
									<Link
										href={`/quizbits/${quiz.id}/edit`}
										aria-label="Edit quiz"
										title="Edit quiz"
										className={`flex h-7 w-7 items-center justify-center hover:opacity-60 ${
											started ? "pointer-events-none opacity-30" : ""
										}`}
									>
										<Image
											src="/assets/icons/edit.svg"
											alt=""
											width={18}
											height={18}
										/>
									</Link>

									<button
										type="button"
										onClick={() => setShowDeleteModal(true)}
										disabled={started}
										aria-label="Delete quiz"
										title="Delete quiz"
										className="flex h-7 w-7 items-center justify-center hover:opacity-60 disabled:opacity-30"
									>
										<Image
											src="/assets/icons/delete.svg"
											alt=""
											width={18}
											height={18}
										/>
									</button>
								</div>
							) : (
								<div ref={moreMenuRef} className="relative shrink-0">
									<button
										type="button"
										onClick={() => setShowMoreMenu(!showMoreMenu)}
										aria-label="More options"
										aria-expanded={showMoreMenu}
										className="flex h-8 w-8 items-center justify-center"
									>
										<Image
											src="/assets/icons/more.svg"
											alt=""
											width={20}
											height={5}
										/>
									</button>

									{showMoreMenu && (
										<div className="absolute right-0 top-full z-50 mt-1 w-[120px] rounded-md border border-gray-200 bg-white py-1 shadow-md">
											<button
												type="button"
												onClick={() => {
													setShowMoreMenu(false);
													setShowReportModal(true);
												}}
												className="w-full px-4 py-2 text-center text-xs text-gray-700 hover:bg-gray-50"
											>
												Report
											</button>
										</div>
									)}
								</div>
							)}
						</div>

						<p className="ml-[52px] mt-1 text-xs text-gray-500">
							{quiz.course} · by {quiz.author}
							{quiz.status === "draft" && (
								<span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold">
									Draft
								</span>
							)}
						</p>

						{quiz.instructions && (
							<div
								className="ml-[52px] mt-6 border-b border-gray-200 pb-8 text-xs leading-relaxed text-[#343B36] [&_em]:italic [&_li]:mb-1 [&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-3 [&_strong]:font-bold [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_img]:max-h-[250px] [&_img]:rounded"
								dangerouslySetInnerHTML={{
									__html: DOMPurify.sanitize(quiz.instructions),
								}}
							/>
						)}

						<div className="ml-[52px]">
							{quiz.questions.map((question, index) => (
								<QuizQuestion
									key={question.id}
									question={question}
									number={index + 1}
									mode={started ? "answer" : "preview"}
									answer={answers[question.id]}
									onAnswer={(answer) => handleAnswer(question.id, answer)}
								/>
							))}
						</div>

						<div className="mt-6 flex justify-end">
							{started ? (
								<button
									type="button"
									onClick={() => setShowSubmitModal(true)}
									className="rounded-full bg-[#00A651] px-10 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#008f45]"
								>
									Submit Quiz
								</button>
							) : (
								<button
									type="button"
									onClick={handleStart}
									className="rounded-full border border-[#00A651] px-8 py-2 text-sm text-[#00A651] transition-colors hover:bg-green-50"
								>
									Take the Quiz
								</button>
							)}
						</div>
					</article>
				</div>

				<div className="fixed right-6 top-[88px] hidden w-[215px] xl:block">
					{detailsPanel}
				</div>
			</div>

			<QuizConfirmModal
				isOpen={showExitModal}
				message="Are you sure you want to exit the quiz?"
				onClose={() => setShowExitModal(false)}
				onConfirm={handleExit}
			/>

			<QuizConfirmModal
				isOpen={showSubmitModal}
				message={
					unansweredCount > 0
						? `You have ${unansweredCount} unanswered item${unansweredCount === 1 ? "" : "s"}. Are you sure you want to submit the quiz?`
						: "Are you sure you want to submit the quiz?"
				}
				onClose={() => setShowSubmitModal(false)}
				onConfirm={submitQuiz}
			/>

			{isOwner && (
				<QuizConfirmModal
					isOpen={showDeleteModal}
					message="Are you sure you want to delete this quizbit?"
					confirmLabel="Delete"
					variant="danger"
					onClose={() => setShowDeleteModal(false)}
					onConfirm={handleDelete}
				/>
			)}

			<ReportModal
				isOpen={showReportModal}
				onClose={() => setShowReportModal(false)}
			/>
		</>
	);
}
