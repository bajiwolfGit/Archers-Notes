"use client";

interface CourseSelectorProps {
    value: string;
    onChange: (course: string) => void;
}

const courses = [
    "CSADPRG",
    "CSARCH1",
    "CSNETWK",
    "DATA103",
    "STALGCM",
    "FNDACCT",
];

export default function CourseSelector({
    value,
    onChange,
}: CourseSelectorProps) {
    return (
        <div className="w-full">
            <label
                htmlFor="note-course"
                className="mb-2 block text-sm font-medium text-gray-700"
            >
                Course
            </label>

            <select
                id="note-course"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-md border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-green-600"
            >
                <option value="" disabled>
                    Select a course
                </option>

                {courses.map((course) => (
                    <option key={course} value={course}>
                        {course}
                    </option>
                ))}
            </select>
        </div>
    );
}