"use client";

import {
	createContext,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from "react";

import {
	quizzes as initialQuizzes,
	type Quiz,
	type QuizAttempt,
} from "@/data/quizzes";

const CREATED_QUIZZES_STORAGE_KEY = "archers-notes-created-quizzes";
const EDITED_QUIZZES_STORAGE_KEY = "archers-notes-edited-quizzes";
const DELETED_QUIZZES_STORAGE_KEY = "archers-notes-deleted-quizzes";
const ATTEMPTS_STORAGE_KEY = "archers-notes-quiz-attempts";

interface QuizzesContextType {
	quizzes: Quiz[];
	loaded: boolean;
	getQuiz: (id: number) => Quiz | undefined;
	addQuiz: (quiz: Quiz) => void;
	updateQuiz: (quiz: Quiz) => void;
	deleteQuiz: (id: number) => void;
	attempts: QuizAttempt[];
	getAttempts: (quizId: number) => QuizAttempt[];
	addAttempt: (attempt: QuizAttempt) => void;
}

const QuizzesContext = createContext<QuizzesContextType | undefined>(
	undefined
);

function readStorage<T>(key: string, fallback: T): T {
	try {
		const stored = localStorage.getItem(key);

		return stored ? (JSON.parse(stored) as T) : fallback;
	} catch (error) {
		console.error(`Failed to load ${key}:`, error);
		return fallback;
	}
}

function writeStorage<T>(key: string, value: T) {
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch (error) {
		console.error(`Failed to save ${key}:`, error);
	}
}

export function QuizzesProvider({ children }: { children: ReactNode }) {

	const [createdQuizzes, setCreatedQuizzes] = useState<Quiz[]>([]);

	const [editedQuizzes, setEditedQuizzes] = useState<Quiz[]>([]);

	const [deletedQuizIds, setDeletedQuizIds] = useState<number[]>([]);

	const [attempts, setAttempts] = useState<QuizAttempt[]>([]);

	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		setCreatedQuizzes(readStorage<Quiz[]>(CREATED_QUIZZES_STORAGE_KEY, []));
		setEditedQuizzes(readStorage<Quiz[]>(EDITED_QUIZZES_STORAGE_KEY, []));
		setDeletedQuizIds(readStorage<number[]>(DELETED_QUIZZES_STORAGE_KEY, []));
		setAttempts(readStorage<QuizAttempt[]>(ATTEMPTS_STORAGE_KEY, []));
		setLoaded(true);
	}, []);

	useEffect(() => {
		if (loaded) writeStorage(CREATED_QUIZZES_STORAGE_KEY, createdQuizzes);
	}, [createdQuizzes, loaded]);

	useEffect(() => {
		if (loaded) writeStorage(EDITED_QUIZZES_STORAGE_KEY, editedQuizzes);
	}, [editedQuizzes, loaded]);

	useEffect(() => {
		if (loaded) writeStorage(DELETED_QUIZZES_STORAGE_KEY, deletedQuizIds);
	}, [deletedQuizIds, loaded]);

	useEffect(() => {
		if (loaded) writeStorage(ATTEMPTS_STORAGE_KEY, attempts);
	}, [attempts, loaded]);

	const quizzes: Quiz[] = [
		...createdQuizzes,
		...initialQuizzes
			.filter((quiz) => !deletedQuizIds.includes(quiz.id))
			.map(
				(quiz) =>
					editedQuizzes.find((edited) => edited.id === quiz.id) ?? quiz
			),
	];

	function getQuiz(id: number) {
		return quizzes.find((quiz) => quiz.id === id);
	}

	function addQuiz(quiz: Quiz) {
		setCreatedQuizzes((prev) => [quiz, ...prev]);
	}

	function updateQuiz(updatedQuiz: Quiz) {
		const isCreated = createdQuizzes.some(
			(quiz) => quiz.id === updatedQuiz.id
		);

		if (isCreated) {
			setCreatedQuizzes((prev) =>
				prev.map((quiz) =>
					quiz.id === updatedQuiz.id ? updatedQuiz : quiz
				)
			);
			return;
		}

		setEditedQuizzes((prev) => [
			...prev.filter((quiz) => quiz.id !== updatedQuiz.id),
			updatedQuiz,
		]);
	}

	function deleteQuiz(id: number) {
		setCreatedQuizzes((prev) => prev.filter((quiz) => quiz.id !== id));
		setEditedQuizzes((prev) => prev.filter((quiz) => quiz.id !== id));

		if (initialQuizzes.some((quiz) => quiz.id === id)) {
			setDeletedQuizIds((prev) =>
				prev.includes(id) ? prev : [...prev, id]
			);
		}

		setAttempts((prev) => prev.filter((attempt) => attempt.quizId !== id));
	}

	function getAttempts(quizId: number) {
		return attempts.filter((attempt) => attempt.quizId === quizId);
	}

	function addAttempt(attempt: QuizAttempt) {
		setAttempts((prev) => [...prev, attempt]);
	}

	return (
		<QuizzesContext.Provider
			value={{
				quizzes,
				loaded,
				getQuiz,
				addQuiz,
				updateQuiz,
				deleteQuiz,
				attempts,
				getAttempts,
				addAttempt,
			}}
		>
			{children}
		</QuizzesContext.Provider>
	);
}

export function useQuizzes() {
	const context = useContext(QuizzesContext);

	if (!context) {
		throw new Error("useQuizzes must be used within a QuizzesProvider");
	}

	return context;
}
