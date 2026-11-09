export type QuestionType = "single" | "checkbox" | "essay" | "upload";

export const questionTypeLabels: Record<QuestionType, string> = {
	essay: "Essay",
	checkbox: "Check Box",
	single: "Single Answer",
	upload: "Upload File",
};

export interface QuizQuestion {
	id: string;
	type: QuestionType;
	prompt: string;
	choices: string[];
	correct: number[];
}

export type QuizStatus = "draft" | "published";

export interface Quiz {
	id: number;
	authorId: number;
	author: string;
	course: string;
	title: string;
	instructions: string;
	duration: number;
	color: string;
	questions: QuizQuestion[];
	takers: number;
	status: QuizStatus;
	createdAt: string;
}

export type QuizAnswer = number[] | string;

export interface QuizAttempt {
	id: number;
	quizId: number;
	answers: Record<string, QuizAnswer>;
	score: number;
	total: number;
	timeTaken: number;
	submittedAt: string;
}

export const quizColors = [
	"#C17CF5",
	"#F9E58F",
	"#F6C476",
	"#EE8A87",
	"#5EBEF4",
	"#A7D3D3",
	"#8794F5",
	"#9EDF9E",
];

export const CURRENT_USER_ID = 1;
const LOREM_PROMPT =
	"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Reprehenderit neque ab aliqua ipsam consequuntur reprehenderit doloremque architecto beatae elit consectetur.";

const LOREM_INSTRUCTIONS =
	"<p><strong>Lorem Ipsum</strong></p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Reprehenderit neque ab aliqua ipsam consequuntur reprehenderit doloremque architecto beatae elit consectetur. Doloremque ab culpa fugiat porro occaecat ex neque sed omnis. Ipsam dicta nisi anim quae totam magna quisquam sit ullamco. Omnis est amet qui porro dicta velit nisi in.</p><p>Architecto officia totam nostrud voluptas sunt anim fugiat enim sit error incididunt porro. Elit irure velit ex sit quis veniam consectetur laboris. Tempor illo quis omnis aspernatur iste fugit adipiscing sint. Proident nostrud do laboris in lorem dolorem illo. Laudantium dicta duis proident fugiat nostrud dolorem elit enim dolor duis architecto ab consequuntur.</p>";

function makeMockQuestions(count: number): QuizQuestion[] {
	return Array.from({ length: count }, (_, index) => ({
		id: `q${index + 1}`,
		type: "single" as const,
		prompt: LOREM_PROMPT,
		choices: ["Lorem", "Ipsum", "Sit", "Dolor"],
		correct: [index % 4],
	}));
}

export const quizzes: Quiz[] = [
	{
		id: 1,
		authorId: 1,
		author: "John Doe",
		course: "CSADPRG",
		title: "Evaluate Programming Languages",
		instructions: LOREM_INSTRUCTIONS,
		duration: 15,
		color: quizColors[0],
		questions: makeMockQuestions(10),
		takers: 120,
		status: "published",
		createdAt: "2026-10-01",
	},
	{
		id: 2,
		authorId: 1,
		author: "John Doe",
		course: "CSADPRG",
		title: "Design and Implementation",
		instructions: LOREM_INSTRUCTIONS,
		duration: 15,
		color: quizColors[1],
		questions: makeMockQuestions(10),
		takers: 98,
		status: "published",
		createdAt: "2026-10-05",
	},
	{
		id: 3,
		authorId: 2,
		author: "Jane Doe",
		course: "CSADPRG",
		title: "Overview",
		instructions: LOREM_INSTRUCTIONS,
		duration: 10,
		color: quizColors[2],
		questions: makeMockQuestions(8),
		takers: 76,
		status: "published",
		createdAt: "2026-10-08",
	},
	{
		id: 4,
		authorId: 2,
		author: "Jane Doe",
		course: "CSADPRG",
		title: "Evolution of Programming Languages",
		instructions: LOREM_INSTRUCTIONS,
		duration: 20,
		color: quizColors[3],
		questions: makeMockQuestions(10),
		takers: 64,
		status: "published",
		createdAt: "2026-10-12",
	},
	{
		id: 5,
		authorId: 3,
		author: "Carmy Berzatto",
		course: "CSADPRG",
		title: "Names and Variables",
		instructions: LOREM_INSTRUCTIONS,
		duration: 15,
		color: quizColors[4],
		questions: makeMockQuestions(10),
		takers: 55,
		status: "published",
		createdAt: "2026-10-15",
	},
	{
		id: 6,
		authorId: 1,
		author: "John Doe",
		course: "CSADPRG",
		title: "Subprogram Parameters",
		instructions: LOREM_INSTRUCTIONS,
		duration: 15,
		color: quizColors[5],
		questions: makeMockQuestions(4),
		takers: 40,
		status: "published",
		createdAt: "2026-10-18",
	},
	{
		id: 7,
		authorId: 3,
		author: "Carmy Berzatto",
		course: "CSARCH1",
		title: "Number Base Conversion",
		instructions: LOREM_INSTRUCTIONS,
		duration: 15,
		color: quizColors[6],
		questions: makeMockQuestions(10),
		takers: 88,
		status: "published",
		createdAt: "2026-10-02",
	},
	{
		id: 8,
		authorId: 2,
		author: "Jane Doe",
		course: "CSARCH1",
		title: "K-mapping",
		instructions: LOREM_INSTRUCTIONS,
		duration: 15,
		color: quizColors[2],
		questions: makeMockQuestions(10),
		takers: 70,
		status: "published",
		createdAt: "2026-10-09",
	},
	{
		id: 9,
		authorId: 2,
		author: "Jane Doe",
		course: "CSARCH1",
		title: "Adders and Multiplexers",
		instructions: LOREM_INSTRUCTIONS,
		duration: 15,
		color: quizColors[7],
		questions: makeMockQuestions(10),
		takers: 61,
		status: "published",
		createdAt: "2026-10-20",
	},
];

export function isAutoGraded(question: QuizQuestion): boolean {
	return question.type === "single" || question.type === "checkbox";
}

export function isAnswerCorrect(
	question: QuizQuestion,
	answer: QuizAnswer | undefined
): boolean {
	if (!isAutoGraded(question) || !Array.isArray(answer)) return false;

	const selected = [...answer].sort((a, b) => a - b);
	const correct = [...question.correct].sort((a, b) => a - b);

	return (
		selected.length === correct.length &&
		selected.every((value, index) => value === correct[index])
	);
}

export function isAnswered(answer: QuizAnswer | undefined): boolean {
	if (answer === undefined) return false;

	return Array.isArray(answer)
		? answer.length > 0
		: answer.trim().length > 0;
}

export function gradeQuiz(
	quiz: Quiz,
	answers: Record<string, QuizAnswer>
): { score: number; total: number } {
	const graded = quiz.questions.filter(isAutoGraded);

	const score = graded.filter((question) =>
		isAnswerCorrect(question, answers[question.id])
	).length;

	return { score, total: graded.length };
}

export function formatTimer(seconds: number): string {
	const safeSeconds = Math.max(0, Math.floor(seconds));
	const minutes = Math.floor(safeSeconds / 60);
	const remainder = safeSeconds % 60;

	return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

export function createEmptyQuestion(): QuizQuestion {
	return {
		id: crypto.randomUUID(),
		type: "single",
		prompt: "",
		choices: ["", "", "", ""],
		correct: [],
	};
}

export type QuizSort = "Trending" | "Latest";

export function sortQuizzes(list: Quiz[], sortBy: QuizSort): Quiz[] {
	return [...list].sort((a, b) =>
		sortBy === "Trending"
			? b.takers - a.takers
			: new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
	);
}
