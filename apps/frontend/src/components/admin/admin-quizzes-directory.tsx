/**
 * File: components/admin/admin-quizzes-directory.tsx
 *
 * Description:
 * Displays a searchable and filterable directory of quizzes
 * for administrators.
 *
 * Features:
 * - Search quizzes by title or author.
 * - Filter quizzes by course and status.
 * - Sort quizzes by date or number of takers.
 * - Open individual quizzes to review their answer key.
 * - Unpublish, republish, and remove quizzes.
 * - Records every action in the activity log.
 */

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import AdminFilterDropdown, { toOptions } from "./admin-filter-dropdown";
import RemoveQuizModal from "./remove-quiz-modal";

import { useQuizzes } from "@/context/quizzes-context";
import { useAdmin } from "@/context/admin-context";

import { formatRelativeTime } from "@/data/admin";
import type { Quiz } from "@/data/quizzes";

/** Sort options. */
type SortOption = "Latest" | "Oldest" | "Most Taken";

/** Display labels for quiz statuses. */
const statusLabels: Record<Quiz["status"], string> = {
	published: "Published",
	draft: "Draft",
};

/** Badge colors for quiz statuses. */
const statusStyles: Record<Quiz["status"], string> = {
	published: "bg-green-100 text-green-700",
	draft: "bg-gray-200 text-gray-700",
};

/**
 * AdminQuizzesDirectory Component
 *
 * @returns The Quizzes directory page content.
 */
export default function AdminQuizzesDirectory() {
	const { quizzes, loaded, updateQuiz, deleteQuiz } = useQuizzes();
	const { now, logAction } = useAdmin();

	const [search, setSearch] = useState("");
	const [course, setCourse] = useState("All");
	const [status, setStatus] = useState("All");
	const [sort, setSort] = useState<SortOption>("Latest");

	// The quiz selected for removal.
	const [quizToRemove, setQuizToRemove] = useState<Quiz | null>(null);

	const courses = useMemo(
		() => Array.from(new Set(quizzes.map((quiz) => quiz.course).filter(Boolean))).sort(),
		[quizzes]
	);

	const filteredQuizzes = useMemo(() => {
		const query = search.trim().toLowerCase();

		return quizzes
			.filter((quiz) => {
				const matchesSearch =
					quiz.title.toLowerCase().includes(query) ||
					quiz.author.toLowerCase().includes(query);

				return (
					matchesSearch &&
					(course === "All" || quiz.course === course) &&
					(status === "All" || statusLabels[quiz.status] === status)
				);
			})
			.sort((a, b) => {
				if (sort === "Most Taken") return b.takers - a.takers;

				const aDate = new Date(a.createdAt).getTime();
				const bDate = new Date(b.createdAt).getTime();

				return sort === "Latest" ? bDate - aDate : aDate - bDate;
			});
	}, [quizzes, search, course, status, sort]);

	/** Unpublishes or republishes a quiz. */
	function handleTogglePublished(quiz: Quiz) {
		const published = quiz.status === "published";

		updateQuiz({ ...quiz, status: published ? "draft" : "published" });
		logAction(published ? "Unpublished quiz" : "Republished quiz", quiz.title);
	}

	/** Removes a quiz. */
	function handleRemove(reason: string) {
		if (!quizToRemove) return;

		deleteQuiz(quizToRemove.id);
		logAction("Removed quiz", quizToRemove.title, reason);
	}

	return (
		<>
			<div className="w-full px-6 py-6">

				{/* Page Title */}
				<h1 className="mb-5 text-2xl font-semibold text-[#303a36]">Quizzes</h1>

				{/* Search and Filters */}
				<div className="mb-7 flex flex-wrap items-center gap-2">
					<div className="min-w-[220px] flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2">
						<label
							htmlFor="quizzes-search"
							className="block text-[10px] font-medium text-[#00A651]"
						>
							Search
						</label>
						<input
							id="quizzes-search"
							type="text"
							value={search}
							onChange={(event) => setSearch(event.target.value)}
							placeholder="Title or author"
							className="w-full bg-transparent text-xs text-[#303a36] outline-none placeholder:text-gray-400"
						/>
					</div>

					<AdminFilterDropdown
						label="Course"
						value={course}
						onChange={setCourse}
						options={toOptions(courses)}
					/>
					<AdminFilterDropdown
						label="Status"
						value={status}
						onChange={setStatus}
						options={toOptions(["Published", "Draft"])}
					/>
					<AdminFilterDropdown
						label="Sort"
						value={sort}
						onChange={(value) => setSort(value as SortOption)}
						options={[
							{ value: "Latest", label: "Latest" },
							{ value: "Oldest", label: "Oldest" },
							{ value: "Most Taken", label: "Most Taken" },
						]}
					/>
				</div>

				{/* Quizzes Table */}
				<div className="w-full overflow-x-auto">
					<table className="w-full border-collapse text-left">
						<thead>
							<tr className="border-b border-gray-200 text-xs font-semibold text-[#303a36]">
								<th className="px-2 py-4">Title</th>
								<th className="px-2 py-4">Author</th>
								<th className="px-2 py-4">Course</th>
								<th className="px-2 py-4">Items</th>
								<th className="px-2 py-4">Duration</th>
								<th className="px-2 py-4">Takers</th>
								<th className="px-2 py-4">Created</th>
								<th className="px-2 py-4">Status</th>
								<th className="px-2 py-4 text-right">Actions</th>
							</tr>
						</thead>

						<tbody>
							{loaded &&
								filteredQuizzes.map((quiz) => (
									<tr
										key={quiz.id}
										className="border-b border-gray-100 text-xs text-[#303a36] transition-colors hover:bg-gray-50"
									>
										<td className="px-2 py-4">
											<div className="flex items-center gap-2">
												<span
													className="h-3 w-3 shrink-0 rounded-sm"
													style={{ backgroundColor: quiz.color }}
													aria-hidden="true"
												/>
												<Link
													href={`/admin/quizzes/${quiz.id}`}
													className="font-semibold hover:text-[#00A651]"
												>
													{quiz.title}
												</Link>
											</div>
										</td>
										<td className="px-2 py-4">{quiz.author}</td>
										<td className="px-2 py-4">{quiz.course || "—"}</td>
										<td className="px-2 py-4">{quiz.questions.length}</td>
										<td className="whitespace-nowrap px-2 py-4">{quiz.duration} mins</td>
										<td className="px-2 py-4">{quiz.takers}</td>
										<td className="whitespace-nowrap px-2 py-4">
											{formatRelativeTime(quiz.createdAt, now)}
										</td>
										<td className="px-2 py-4">
											<span
												className={`inline-flex min-w-[70px] justify-center rounded-full px-3 py-1 text-[10px] font-semibold ${statusStyles[quiz.status]}`}
											>
												{statusLabels[quiz.status]}
											</span>
										</td>
										<td className="px-2 py-4">
											<div className="flex items-center justify-end gap-2">
												<Link
													href={`/admin/quizzes/${quiz.id}`}
													className="rounded-md border border-gray-200 px-2 py-1.5 hover:bg-gray-100"
												>
													Open
												</Link>

												<button
													type="button"
													onClick={() => handleTogglePublished(quiz)}
													className={`whitespace-nowrap rounded-md border px-2 py-1.5 ${
														quiz.status === "published"
															? "border-gray-200 hover:bg-gray-100"
															: "border-green-200 text-green-700 hover:bg-green-50"
													}`}
												>
													{quiz.status === "published" ? "Unpublish" : "Republish"}
												</button>

												<button
													type="button"
													onClick={() => setQuizToRemove(quiz)}
													className="rounded-md border border-red-200 px-2 py-1.5 text-red-500 hover:bg-red-50"
												>
													Remove
												</button>
											</div>
										</td>
									</tr>
								))}
						</tbody>
					</table>

					{loaded && filteredQuizzes.length === 0 && (
						<div className="py-12 text-center text-sm text-gray-500">
							No quizzes match your search or filters.
						</div>
					)}
				</div>

				<p className="mt-4 text-xs text-gray-400">
					{loaded ? filteredQuizzes.length : 0} quizzes found
				</p>
			</div>

			{/* Remove Quiz Modal */}
			{quizToRemove && (
				<RemoveQuizModal
					quiz={quizToRemove}
					onClose={() => setQuizToRemove(null)}
					onConfirm={handleRemove}
				/>
			)}
		</>
	);
}
