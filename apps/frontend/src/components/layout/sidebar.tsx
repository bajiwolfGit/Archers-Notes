/**
 * File: components/layout/sidebar.tsx
 *
 * Description:
 * Provides the sidebar navigation for the Archer's Notes application.
 * Allows users to access different sections of the application,
 * including drafts, home, courses, quizzes, and saved notes.
 *
 * Features:
 * - Provides a button for opening the Create Post modal.
 * - Displays navigation links to the application's main sections.
 * - Supports expandable and collapsible course listings.
 * - Supports expandable and collapsible saved notes listings.
 * - Provides navigation to individual course pages.
 * - Provides navigation to individual saved notes.
 * - Uses the reusable SidebarButton component.
 */

"use client";

// React hook for managing component state.
import { useState } from "react";

// Next.js component for optimized image rendering.
import Image from "next/image";

// Next.js component for client-side navigation.
import Link from "next/link";

// Reusable component for displaying sidebar navigation buttons.
import SidebarButton from "../ui/sidebar-button";

/**
 * Courses Data
 *
 * Contains a predefined list of courses displayed
 * in the expandable Courses section.
 *
 * Each course is represented by its course code.
 *
 * Currently uses static mock data.
 */
const courses = [
	"CSADPRG",
	"CSARCH1",
	"CSNETWK",
	"DATA103",
];

/**
 * Saved Notes Data
 *
 * Contains a predefined list of saved note titles
 * displayed in the expandable Saved Notes section.
 *
 * Currently uses static mock data.
 */
const savedNotes = [
	"Midterms Reviewer",
	"Quiz 3 Notes",
	"C Pointers",
	"Calculus",
];

/**
 * SidebarProps Interface
 *
 * Defines the properties required by the Sidebar component.
 *
 * @property onOpenPostNotes - Callback function used to open
 *                             the Create Post modal.
 */
interface SidebarProps {
  	onOpenPostNotes: () => void;
}

/**
 * Sidebar Component
 *
 * Displays the application's primary sidebar navigation.
 *
 * Provides navigation to drafts, home, courses, quizzes,
 * and saved notes while allowing users to expand or
 * collapse selected navigation sections.
 *
 * The component also provides a Post Notes button that
 * triggers the Create Post modal through a callback
 * received from the parent MainLayout component.
 *
 * @param onOpenPostNotes - Function called when the user
 *                          clicks the Post Notes button.
 * @returns The application's sidebar navigation.
 */
export default function Sidebar({ onOpenPostNotes }: SidebarProps) {
	
	/**
	 * Courses Section State
	 *
	 * Controls whether the Courses section is expanded.
	 *
	 * Initially set to true so the course list is
	 * visible when the sidebar is first rendered.
	 */
	const [coursesOpen, setCoursesOpen] = useState(true);
	
	/**
	 * Saved Notes Section State
	 *
	 * Controls whether the Saved Notes section is expanded.
	 *
	 * Initially set to true so the saved notes list
	 * is visible when the sidebar is first rendered.
	 */
	const [savedNotesOpen, setSavedNotesOpen] = useState(true);

	return (
		/*
		 * Sidebar Container:
		 * Displays the application's vertical navigation panel.
		 *
		 * Uses a fixed width of 223px and a minimum height
		 * based on the viewport height minus 73px.
		 *
		 * The right border separates the sidebar from
		 * the application's main content.
		 */
		<aside className="w-[223px] shrink-0 min-h-[calc(100vh-73px)] border-r border-gray-200 bg-white px-4 py-6">

			{/*
			 * Post Notes Button:
			 * Allows users to open the Create Post modal.
			 *
			 * Calls the onOpenPostNotes callback provided
			 * by the parent MainLayout component.
			 */}
			<button
				type="button"
				onClick={onOpenPostNotes}
				className="flex w-full items-center gap-3 rounded bg-green-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-700"
			>
				{/* Create Post icon. */}
				<Image
					src="/assets/icons/create-post.svg"
					alt=""
					width={20}
					height={20}
				/>
				Post Notes
			</button>

			{/*
			 * Sidebar Navigation:
			 * Contains the main navigation links and
			 * expandable sections of the application.
			 */}
			<nav className="mt-6 space-y-5 text-sm">

				{/*
				 * Drafts Navigation:
				 * Navigates to the page containing
				 * the user's saved drafts.
				 */}
				<SidebarButton
					icon="/assets/icons/drafts.svg"
					label="Drafts"
					href="/main/drafts"
				/>

				{/* Separator between navigation sections. */}
				<hr className="border-gray-200" />

				{/*
				 * Home Navigation:
				 * Navigates to the application's main feed.
				 *
				 * The active property applies the active
				 * navigation styling to this button.
				 */}
				<SidebarButton
					icon="/assets/icons/home.svg"
					label="Home"
					href="/main"
					active
				/>

				{/* Separator between navigation sections. */}
				<hr className="border-gray-200" />

				{/*
				 * Courses Section:
				 * Displays an expandable list of courses.
				 *
				 * Users can expand or collapse the course list
				 * and navigate to individual course pages.
				 */}
				<section>

					{/*
					 * Courses Toggle Button:
					 * Toggles the visibility of the course list.
					 *
					 * The aria-expanded attribute indicates
					 * whether the section is currently expanded.
					 */}
					<button
						type="button"
						onClick={() => setCoursesOpen(!coursesOpen)}
						aria-expanded={coursesOpen}
						className="flex w-full items-center gap-4 rounded-md px-4 py-2 font-semibold hover:bg-gray-100"
					>
						{/* Courses section icon. */}
						<Image
							src="/assets/icons/courses.svg"
							alt=""
							width={20}
							height={20}
						/>

						{/* Courses section label. */}
						<span>Courses</span>

						{/*
						 * Dropdown Indicator:
						 * Rotates depending on whether
						 * the Courses section is expanded.
						 */}
						<Image
							src="/assets/icons/dropdown.svg"
							alt=""
							width={10}
							height={10}
							className={`transition-transform duration-200 ${
								coursesOpen ? "" : "-rotate-90"
							}`}
						/>
					</button>

					{/*
					 * Courses List:
					 * Displays the predefined course links
					 * when coursesOpen is true.
					 *
					 * Each course code is converted to lowercase
					 * when generating its navigation URL.
					 */}
					{coursesOpen && (
						<div className="ml-14 mt-4 space-y-1 text-xs">
							{courses.map((course) => (
								<Link
									key={course}
									href={`/main/courses/${course.toLowerCase()}`}
									className="block rounded px-1 py-2 hover:bg-gray-100"
								>
								{course}
								</Link>
							))}
						</div>
					)}

					{/*
					 * Add a Course Navigation:
					 * Provides a link to the page
					 * for adding a new course.
					 */}
					<div className="mt-5">
						<SidebarButton
							icon="/assets/icons/add.svg"
							label="Add a Course"
							href="/main/add-course"
						/>
					</div>
				</section>

				{/* Separator between navigation sections. */}
				<hr className="border-gray-200" />

				{/*
				 * Quizbits Navigation:
				 * Navigates to the application's quiz section.
				 */}
				<SidebarButton
					icon="/assets/icons/quizbits.svg"
					label="Quizbits"
					href="/main/quizbits"
				/>

				{/*
				 * Create Quiz Navigation:
				 * Navigates to the page for creating a new quiz.
				 */}
				<SidebarButton
					icon="/assets/icons/add.svg"
					label="Create a Quiz"
					href="/main/create-quiz"
				/>

				{/* Separator between navigation sections. */}
				<hr className="border-gray-200" />

				{/*
				 * Saved Notes Section:
				 * Displays an expandable list of saved notes.
				 *
				 * Users can expand or collapse the list
				 * and navigate to individual saved notes.
				 */}
				<section>

					{/*
					 * Saved Notes Toggle Button:
					 * Toggles the visibility of the saved notes list.
					 *
					 * The aria-expanded attribute indicates
					 * whether the section is currently expanded.
					 */}
					<button
						type="button"
						onClick={() => setSavedNotesOpen(!savedNotesOpen)}
						aria-expanded={savedNotesOpen}
						className="flex w-full items-center gap-4 rounded-md px-4 py-2 font-semibold hover:bg-gray-100"
					>
						{/* Saved Notes section icon. */}
						<Image
							src="/assets/icons/bookmark.svg"
							alt=""
							width={20}
							height={20}
						/>

						{/* Saved Notes section label. */}
						<span>Saved Notes</span>

						{/*
						 * Dropdown Indicator:
						 * Rotates depending on whether
						 * the Saved Notes section is expanded.
						 */}
						<Image
							src="/assets/icons/dropdown.svg"
							alt=""
							width={10}
							height={10}
							className={`transition-transform duration-200 ${
								savedNotesOpen ? "" : "-rotate-90"
							}`}
						/>
					</button>

					{/*
					 * Saved Notes List:
					 * Displays the predefined saved notes
					 * when savedNotesOpen is true.
					 *
					 * Each note uses its array index plus one
					 * to generate the navigation URL.
					 */}
					{savedNotesOpen && (
						<div className="ml-14 mt-4 space-y-1 text-xs">
							{savedNotes.map((note, index) => (
								<Link
									key={note}
									href={`/main/saved-notes/${index + 1}`}
									className="block rounded px-1 py-2 hover:bg-gray-100"
								>
								{note}
								</Link>
							))}
						</div>
					)}
				</section>
			</nav>
		</aside>
	);
}
