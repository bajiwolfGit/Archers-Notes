
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SidebarButton from "../ui/sidebar-button";

const courses = [
  "CSADPRG",
  "CSARCH1",
  "CSNETWK",
  "DATA103",
];

const savedNotes = [
  "Midterms Reviewer",
  "Quiz 3 Notes",
  "C Pointers",
  "Calculus",
];

export default function Sidebar() {
  const [coursesOpen, setCoursesOpen] = useState(true);
  const [savedNotesOpen, setSavedNotesOpen] = useState(true);

  return (
    <aside className="w-[223px] shrink-0 min-h-[calc(100vh-73px)] border-r border-gray-200 bg-white px-4 py-6">

      {/* Post Notes */}
      <Link
        href="/main/post-notes"
        className="flex w-full items-center gap-3 rounded bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700"
      >
        <Image
          src="/assets/icons/create-post.svg"
          alt=""
          width={20}
          height={20}
        />
        Post Notes
      </Link>

      <nav className="mt-6 space-y-5 text-sm">

        {/* Drafts */}
        <SidebarButton
          icon="/assets/icons/drafts.svg"
          label="Drafts"
          href="/main/drafts"
        />

        <hr className="border-gray-200" />

        {/* Home */}
        <SidebarButton
          icon="/assets/icons/home.svg"
          label="Home"
          href="/main"
          active
        />

        <hr className="border-gray-200" />

        {/* Courses */}
        <section>
          <button
            type="button"
            onClick={() => setCoursesOpen(!coursesOpen)}
            aria-expanded={coursesOpen}
            className="flex w-full items-center gap-4 rounded-md px-4 py-2 font-semibold hover:bg-gray-100"
          >
            <Image
              src="/assets/icons/courses.svg"
              alt=""
              width={20}
              height={20}
            />

            <span>Courses</span>

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

          <div className="mt-5">
            <SidebarButton
              icon="/assets/icons/add.svg"
              label="Add a Course"
              href="/main/add-course"
            />
          </div>
        </section>

        <hr className="border-gray-200" />

        {/* Quizbits */}
        <SidebarButton
          icon="/assets/icons/quizbits.svg"
          label="Quizbits"
          href="/main/quizbits"
        />

        <SidebarButton
          icon="/assets/icons/my-quizzes.svg"
          label="My Quizzes"
          href="/main/my-quizzes"
        />

        <SidebarButton
          icon="/assets/icons/add.svg"
          label="Create a Quiz"
          href="/main/create-quiz"
        />

        <hr className="border-gray-200" />

        {/* Saved Notes */}
        <section>
          <button
            type="button"
            onClick={() => setSavedNotesOpen(!savedNotesOpen)}
            aria-expanded={savedNotesOpen}
            className="flex w-full items-center gap-4 rounded-md px-4 py-2 font-semibold hover:bg-gray-100"
          >
            <Image
              src="/assets/icons/bookmark.svg"
              alt=""
              width={20}
              height={20}
            />

            <span>Saved Notes</span>

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
