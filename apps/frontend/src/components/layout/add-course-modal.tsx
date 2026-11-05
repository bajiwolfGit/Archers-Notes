
"use client";

import { useEffect, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";

interface AddCourseModalProps {
    onClose: () => void;
    onAddCourse: (code: string, name: string) => boolean;
}

export default function AddCourseModal({
    onClose,
    onAddCourse,
}: AddCourseModalProps) {
    const [courseCode, setCourseCode] = useState("");
    const [courseName, setCourseName] = useState("");
    const [error, setError] = useState("");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleEscape);

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = previousOverflow;
        };
    }, [onClose]);

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const code = courseCode.trim().toUpperCase();
        const name = courseName.trim();

        if (!code || !name) {
            setError("Please fill in all fields.");
            return;
        }

        const success = onAddCourse(code, name);

        if (!success) {
            setError("This course already exists.");
            return;
        }

        onClose();
    }

    if (!mounted) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="add-course-title"
                className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
            >
                {/* Modal Header */}
                <div className="mb-6 flex items-center justify-between">
                    <h2
                        id="add-course-title"
                        className="text-lg font-semibold text-[#343B36]"
                    >
                        Add a Course
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close modal"
                        className="text-xl text-gray-500 hover:text-gray-800"
                    >
                        &times;
                    </button>
                </div>

                {/* Course Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label
                            htmlFor="course-code"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Course Code
                        </label>

                        <input
                            id="course-code"
                            type="text"
                            value={courseCode}
                            onChange={(event) => {
                                setCourseCode(event.target.value);
                                setError("");
                            }}
                            placeholder="e.g. CS1130"
                            maxLength={30}
                            autoFocus
                            className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none focus:border-green-600"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="course-name"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Course Name
                        </label>

                        <input
                            id="course-name"
                            type="text"
                            value={courseName}
                            onChange={(event) => {
                                setCourseName(event.target.value);
                                setError("");
                            }}
                            placeholder="e.g. Introduction to Computing"
                            maxLength={100}
                            className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none focus:border-green-600"
                        />
                    </div>

                    {error && (
                        <p role="alert" className="text-xs text-red-600">
                            {error}
                        </p>
                    )}

                    {/* Modal Actions */}
                    <div className="flex justify-end gap-3 pt-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-md border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="rounded-md bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
                        >
                            Add Course
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}
