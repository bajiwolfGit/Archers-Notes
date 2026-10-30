/**
 * File: components/posts/course-selector.tsx
 *
 * Description:
 * Provides a reusable course selection dropdown for the
 * Archer's Notes application. Allows users to select a course
 * when creating or editing a post.
 *
 * Features:
 * - Displays a dropdown containing predefined course codes.
 * - Allows users to select a course from the available options.
 * - Receives the currently selected course from a parent component.
 * - Notifies the parent component when the selected course changes.
 * - Provides a default placeholder option.
 * - Uses a controlled select element for consistent state management.
 */

"use client";

/**
 * CourseSelectorProps Interface
 *
 * Defines the properties required by the CourseSelector component.
 *
 * @property value - The currently selected course code.
 * @property onChange - Callback function executed when the user
 *                      selects a course. Receives the selected
 *                      course code as a string.
 */
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
    return (

        /*
         * Course Selector Container:
         * Wraps the course label and dropdown menu.
         *
         * Uses the full available width of the parent container.
         */
        <div className="w-full">
            
            {/*
             * Course Label:
             * Displays the label for the course selection field.
             *
             * The htmlFor attribute associates the label
             * with the select element using its ID.
             *
             * This improves accessibility by allowing users
             * to focus the dropdown when clicking the label.
             */}
            <label
                htmlFor="note-course"
                className="mb-2 block text-sm font-medium text-gray-700"
            >
                Course
            </label>

            {/*
             * Course Dropdown:
             * Displays the available courses for selection.
             *
             * The value property determines which course
             * is currently selected.
             *
             * The onChange handler retrieves the selected
             * course code and passes it to the parent
             * component through the onChange callback.
             *
             * The dropdown includes a green border
             * when focused.
             */}
            <select
                id="note-course"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-md border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-green-600"
            >

                {/*
                 * Default Placeholder Option:
                 * Prompts the user to select a course.
                 *
                 * Uses an empty string as its value.
                 * The disabled attribute prevents users
                 * from selecting it after choosing a course.
                 */}
                <option value="" disabled>
                    Select a course
                </option>

                {/*
                 * Course Options:
                 * Iterates through the predefined courses array
                 * and creates an option for each course.
                 *
                 * Each option uses the course code as its
                 * unique React key and selection value.
                 */}
                {courses.map((course) => (
                    <option key={course} value={course}>
                        {course}
                    </option>
                ))}
            </select>
        </div>
    );
}