
/**
 * File: components/posts/course-selector.tsx
 *
 * Description:
 * Provides a reusable course selection dropdown for
 * creating and editing notes in Archer's Notes.
 *
 * Features:
 * - Displays predefined course codes.
 * - Matches the College dropdown design.
 * - Highlights the selected course in green.
 * - Supports keyboard navigation.
 * - Closes when clicking outside.
 * - Uses a scrollable dropdown menu.
 */

"use client";

import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";

interface CourseSelectorProps {
    value: string;
    onChange: (course: string) => void;
}

/**
 * Courses Data
 *
 * Contains the predefined course codes available
 * for selection in the dropdown menu.
 *
 * Each course is represented by a string containing
 * its corresponding course code.
 *
 * Currently uses static data rather than retrieving
 * courses from a database or shared context.
 */
const courses = [
    "CSADPRG",
    "CSARCH1",
    "CSNETWK",
    "DATA103",
    "STALGCM",
    "FNDACCT",
];

/**
 * CourseSelector Component
 *
 * Displays a dropdown menu containing available courses.
 *
 * Uses a controlled select element, meaning the selected
 * value is managed by the parent component rather than
 * through local state.
 *
 * When the user selects a course, the component calls
 * the onChange callback with the selected course code.
 *
 * @param value - The currently selected course code.
 * @param onChange - Function called when the selected course changes.
 * @returns A labeled dropdown menu for selecting a course.
 */
export default function CourseSelector({
    value,
    onChange,
}: CourseSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

    // Close when clicking outside.
    useEffect(() => {
        function handleOutsideClick(event: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }

        document.addEventListener(
            "mousedown",
            handleOutsideClick
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );
        };
    }, []);

    // Focus the selected course when opened.
    useEffect(() => {
        if (!isOpen) return;

        const selectedIndex = Math.max(
            courses.indexOf(value),
            0
        );

        optionRefs.current[selectedIndex]?.focus();
    }, [isOpen, value]);

    // Select a course.
    function handleSelect(course: string) {
        onChange(course);
        setIsOpen(false);
        buttonRef.current?.focus();
    }

    // Keyboard navigation.
    function handleKeyDown(
        event: KeyboardEvent<HTMLDivElement>
    ) {
        if (!isOpen) return;

        const currentIndex = optionRefs.current.findIndex(
            (option) => option === document.activeElement
        );

        if (event.key === "Escape") {
            event.preventDefault();
            event.stopPropagation();

            setIsOpen(false);
            buttonRef.current?.focus();
        }

        if (event.key === "ArrowDown") {
            event.preventDefault();

            const nextIndex =
                (currentIndex + 1) % courses.length;

            optionRefs.current[nextIndex]?.focus();
        }

        if (event.key === "ArrowUp") {
            event.preventDefault();

            const previousIndex =
                (currentIndex - 1 + courses.length) %
                courses.length;

            optionRefs.current[previousIndex]?.focus();
        }
    }

    return (
        <div
            ref={containerRef}
            className="relative w-full"
            onKeyDown={handleKeyDown}
        >
            {/* Course Label */}
            <label
                id="note-course-label"
                className="mb-2 block text-sm font-medium text-gray-700"
            >
                Course
            </label>

            {/* Dropdown Trigger */}
            <button
                ref={buttonRef}
                id="note-course"
                type="button"
                aria-labelledby="note-course-label note-course"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                onClick={() => setIsOpen((previous) => !previous)}
                className={`
                    flex w-full items-center justify-between
                    rounded-md border bg-white
                    px-4 py-3 text-left text-sm
                    outline-none transition-colors
                    ${
                        isOpen
                            ? "border-[#00A651]"
                            : "border-gray-200 hover:border-gray-300"
                    }
                `}
            >
                <span
                    className={
                        value
                            ? "text-gray-800"
                            : "text-gray-400"
                    }
                >
                    {value || "Select a course"}
                </span>

                {/* Chevron */}
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className={`
                        shrink-0 text-gray-700
                        transition-transform duration-200
                        ${isOpen ? "rotate-180" : ""}
                    `}
                >
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div
                    role="listbox"
                    aria-labelledby="note-course-label"
                    className="
                        absolute left-0 top-full z-50 mt-1
                        max-h-[240px] w-full
                        overflow-y-auto
                        rounded-md border border-gray-200
                        bg-white py-1 shadow-md
                    "
                >
                    {courses.map((course, index) => {
                        const isSelected = value === course;

                        return (
                            <button
                                key={course}
                                ref={(element) => {
                                    optionRefs.current[index] =
                                        element;
                                }}
                                type="button"
                                role="option"
                                aria-selected={isSelected}
                                onClick={() => handleSelect(course)}
                                className={`
                                    flex w-full items-center
                                    px-4 py-3 text-left text-sm
                                    outline-none transition-colors
                                    ${
                                        isSelected
                                            ? "bg-[#E8F7EF] text-[#00A651]"
                                            : "text-gray-800 hover:bg-gray-50 focus:bg-gray-100"
                                    }
                                `}
                            >
                                {course}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
