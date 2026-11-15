"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type CourseStatus = "Active" | "Archived";
type Course = { id: number; code: string; name: string; college: string; status: CourseStatus };
type CourseForm = { code: string; name: string; college: string };

const initialCourses: Course[] = [
    { id: 1, code: "CSADPRG", name: "Advanced Programming and Theory of Programming Languages", college: "CCS", status: "Active" },
    { id: 2, code: "CSARCH1", name: "Introduction to Computer Organization and Architecture 1", college: "CCS", status: "Active" },
    { id: 3, code: "CSNETWK", name: "Introduction to Computer Networks", college: "CCS", status: "Active" },
    { id: 4, code: "DATA101", name: "Introduction to Data Science", college: "CCS", status: "Archived" },
];


function DirectoryDropdown({
    label,
    value,
    options,
    onChange,
    placeholder,
    fullWidth = false,
}: {
    label: string;
    value: string;
    options: string[];
    onChange: (value: string) => void;
    placeholder?: string;
    fullWidth?: boolean;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function close(event: MouseEvent) {
            if (
                ref.current &&
                !ref.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", close);

        return () =>
            document.removeEventListener("mousedown", close);
    }, []);

    return (
        <div
            ref={ref}
            className={`relative ${
                fullWidth ? "w-full" : "shrink-0"
            }`}
        >
            <button
                type="button"
                aria-label={label}
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={() => setOpen((previous) => !previous)}
                className={`flex items-center justify-between gap-3 text-xs font-semibold text-[#303a36] transition-colors focus:outline-none focus:ring-1 focus:ring-[#00A651] ${
                    fullWidth
                        ? "w-full rounded-md border border-gray-300 bg-white px-3 py-3 text-left hover:border-gray-400"
                        : "rounded-full bg-gray-100 px-4 py-2 hover:bg-gray-200"
                }`}
            >
                <span className="truncate">
                    {fullWidth
                        ? value || placeholder || label
                        : `${label}: ${value}`}
                </span>

                <svg
                    className={`h-4 w-4 shrink-0 text-gray-500 transition-transform duration-200 ${
                        open ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="m6 9 6 6 6-6"
                    />
                </svg>
            </button>

            {open && (
                <div
                    role="listbox"
                    aria-label={label}
                    className="absolute left-0 right-0 top-full z-30 mt-2 max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1.5 shadow-lg"
                >
                    {options.map((option) => (
                        <button
                            key={option}
                            type="button"
                            role="option"
                            aria-selected={option === value}
                            onClick={() => {
                                onChange(option);
                                setOpen(false);
                            }}
                            className={`block w-full rounded-md px-3 py-2.5 text-left text-xs font-medium transition-colors ${
                                option === value
                                    ? "bg-green-50 text-[#303a36]"
                                    : "text-[#303a36] hover:bg-gray-50"
                            }`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

const emptyForm: CourseForm = { code: "", name: "", college: "CCS" };

export default function AdminCoursesDirectory() {
    const [courses, setCourses] = useState<Course[]>(initialCourses);
    const [search, setSearch] = useState("");
    const [college, setCollege] = useState("All");
    const [status, setStatus] = useState("All");
    const [editingId, setEditingId] = useState<number | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState<CourseForm>(emptyForm);
    const [formError, setFormError] = useState("");
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [mergeTarget, setMergeTarget] = useState("");
    const [mergeOpen, setMergeOpen] = useState(false);

    const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
    const [deleteMode, setDeleteMode] = useState<"move" | "archive">("move");
    const [destinationCourseId, setDestinationCourseId] = useState("");
    const [deleteConfirmation, setDeleteConfirmation] = useState("");
    
    const colleges = useMemo(() => ["All", ...Array.from(new Set(courses.map((c) => c.college))).sort()], [courses]);

    const visible = useMemo(() => courses.filter((c) =>
        (c.code.toLowerCase().includes(search.toLowerCase().trim()) || c.name.toLowerCase().includes(search.toLowerCase().trim())) &&
        (college === "All" || c.college === college) &&
        (status === "All" || c.status === status)
    ), [courses, search, college, status]);

    const selected = courses.filter((c) => selectedIds.includes(c.id));

    function openAdd() { setEditingId(null); setForm(emptyForm); setFormError(""); setModalOpen(true); }

    function openEdit(course: Course) {
        setEditingId(course.id);
        setForm({ code: course.code, name: course.name, college: course.college });
        setFormError(""); setModalOpen(true);
    }
    function saveCourse(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const code = form.code.trim().toUpperCase();
        const name = form.name.trim();
        const collegeName = form.college.trim().toUpperCase();

        if (!code || !name || !collegeName) { setFormError("All fields are required."); return; }

        if (courses.some((c) => c.code.toLowerCase() === code.toLowerCase() && c.id !== editingId)) {
            setFormError("A course with this code already exists."); return;
        }
        if (editingId !== null) {
            setCourses((prev) => prev.map((c) => c.id === editingId ? { ...c, code, name, college: collegeName } : c));
        } else {
            setCourses((prev) => [...prev, { id: Math.max(0, ...prev.map((c) => c.id)) + 1, code, name, college: collegeName, status: "Active" }]);
        }
        setModalOpen(false);
    }
    function toggleSelected(id: number) {
        setSelectedIds((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]);
    }
    function openMerge() {
        if (selected.length < 2) return;
        setMergeTarget(String(selected[0].id));
        setMergeOpen(true);
    }
    function confirmMerge() {
        const targetId = Number(mergeTarget);
        if (!selectedIds.includes(targetId)) return;
        // Remove duplicate course entries while retaining the selected target course.
        // Note associations are not updated by this operation.
        setCourses((prev) => prev.filter((c) => !selectedIds.includes(c.id) || c.id === targetId));
        setSelectedIds([]);
        setMergeOpen(false);
    }

    function openDelete(course: Course) {
        setCourseToDelete(course);
        setDeleteMode("move");
        setDestinationCourseId("");
        setDeleteConfirmation("");
    }

    function closeDelete() {
        setCourseToDelete(null);
        setDeleteConfirmation("");
    }

    function confirmDelete() {
        if (!courseToDelete) return;

        if (deleteConfirmation !== courseToDelete.code) return;

        if (deleteMode === "archive") {
            setCourses((previous) =>
                previous.map((course) =>
                    course.id === courseToDelete.id
                        ? { ...course, status: "Archived" }
                        : course
                )
            );
        } else {
            if (!destinationCourseId) return;

            // Frontend-only: this removes the course entry.
            // Moving associated notes requires backend integration.
            setCourses((previous) =>
                previous.filter((course) => course.id !== courseToDelete.id)
            );

            setSelectedIds((previous) =>
                previous.filter((id) => id !== courseToDelete.id)
            );
        }

        closeDelete();
    }

    return (
        <div className="w-full px-6 py-6 text-[#303a36]">
            <div className="mb-3 flex items-center justify-between gap-4">
                <h1 className="text-2xl font-semibold">Courses</h1>
                <button type="button" onClick={openAdd} className="inline-flex items-center gap-2 rounded-full bg-[#00A651] px-4 py-2 text-xs font-semibold text-white hover:bg-[#008c45]">
                    <span className="text-base leading-none">+</span> Add Course
                </button>
            </div>

            <div className="mb-7 flex flex-wrap items-center gap-3">
                <div className="min-w-[220px] flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2">
                    <label htmlFor="course-search" className="block text-[10px] font-medium text-[#00A651]">Search</label>
                    <input id="course-search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Name or code"
                        className="w-full bg-transparent text-xs outline-none placeholder:text-gray-400" />
                </div>
                <DirectoryDropdown label="College" value={college} options={colleges} onChange={setCollege} />
                <DirectoryDropdown label="Status" value={status} options={["All", "Active", "Archived"]} onChange={setStatus} />
            </div>

            <div className="w-full overflow-x-auto">
                <table className="w-full min-w-[850px] table-fixed border-collapse text-left text-xs">
                    <colgroup>
                        <col className="w-[4%]" />   {/* Checkbox */}
                        <col className="w-[13%]" />  {/* Code */}
                        <col className="w-[35%]" />  {/* Name */}
                        <col className="w-[10%]" />  {/* College */}
                        <col className="w-[12%]" />  {/* Status */}
                        <col className="w-[26%]" />  {/* Actions */}
                    </colgroup>
                    <thead>
                        <tr className="border-b border-gray-200 font-medium">
                            <th className="px-2 py-4">
                                <span className="sr-only">Select</span>
                            </th>
                            <th className="px-2 py-4">Code</th>
                            <th className="px-2 py-4">Name</th>
                            <th className="px-2 py-4">College</th>
                            <th className="px-2 py-4">Status</th>
                            <th className="px-2 py-4 text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {visible.map((course) => (
                            <tr key={course.id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="px-2 py-4"><input type="checkbox" aria-label={`Select ${course.code} for merge`} checked={selectedIds.includes(course.id)} onChange={() => toggleSelected(course.id)} className="accent-[#00A651]" /></td>
                                <td className="px-2 py-4 font-semibold">{course.code}</td>
                                <td className="break-words whitespace-normal px-2 py-4 font-semibold leading-relaxed">
                                    {course.name}
                                </td>
                                <td className="px-2 py-4 font-medium">{course.college}</td>
                                <td className="px-2 py-4"><span className={`inline-flex min-w-[68px] justify-center rounded-full px-3 py-1 text-[10px] font-semibold ${course.status === "Active" ? "bg-green-50 text-[#00A651]" : "bg-gray-100 text-gray-600"}`}>{course.status}</span></td>
                                
                                <td className="px-2 py-4">
                                    <div className="flex flex-nowrap items-center justify-end gap-2 whitespace-nowrap">
                                        {/* Edit Course */}
                                        <button
                                            type="button"
                                            onClick={() => openEdit(course)}
                                            className="rounded-md border border-gray-200 px-2 py-1.5 text-xs font-medium text-[#303a36] transition-colors hover:bg-gray-100"
                                        >
                                            Edit
                                        </button>

                                        {/* Archive / Unarchive Course */}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setCourses((previous) =>
                                                    previous.map((item) =>
                                                        item.id === course.id
                                                            ? {
                                                                ...item,
                                                                status:
                                                                    item.status === "Active"
                                                                        ? "Archived"
                                                                        : "Active",
                                                            }
                                                            : item
                                                    )
                                                )
                                            }
                                            className="rounded-md border border-gray-200 px-2 py-1.5 text-xs font-medium text-[#303a36] transition-colors hover:bg-gray-100"
                                        >
                                            {course.status === "Active" ? "Archive" : "Unarchive"}
                                        </button>

                                        {/* Delete Course */}
                                        <button
                                            type="button"
                                            onClick={() => openDelete(course)}
                                            className="rounded-md border border-red-200 px-2 py-1.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-50"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
                {visible.length === 0 && <p className="py-10 text-center text-sm text-gray-500">No courses match your search or filters.</p>}
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-md border border-[#e4efe7] bg-[#f5faf6] px-5 py-4">
                <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm font-semibold">Merge duplicates</span>
                    <span className="text-xs text-gray-500">Select two or more course codes to merge ({selectedIds.length} selected)</span>
                </div>

                <button type="button" disabled={selected.length < 2} onClick={openMerge} className="rounded-full border border-gray-500 px-5 py-1 text-xs font-semibold hover:bg-white disabled:cursor-not-allowed disabled:opacity-40">Merge</button>
            </div>

            {modalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4" onMouseDown={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}>
                    <form onSubmit={saveCourse} className="w-full max-w-md space-y-4 rounded-lg bg-white p-6 shadow-xl">
                        <div className="flex items-center justify-between"><h2 className="text-lg font-semibold">{editingId === null ? "Add Course" : "Edit Course"}</h2><button type="button" onClick={() => setModalOpen(false)} aria-label="Close" className="text-xl">×</button></div>
                        
                        <label className="block text-sm font-medium">Course Code<input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#00A651]" placeholder="e.g. CSADPRG" /></label>
                        <label className="block text-sm font-medium">Course Name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#00A651]" placeholder="Course name" /></label>
                        <label className="block text-sm font-medium">College<input value={form.college} onChange={(e) => setForm({ ...form, college: e.target.value })} className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-[#00A651]" placeholder="e.g. CCS" /></label>
                        
                        {formError && <p role="alert" className="text-xs text-red-600">{formError}</p>}
                        
                        <div className="flex justify-end gap-2"><button type="button" onClick={() => setModalOpen(false)} className="rounded-md border px-4 py-2 text-sm">Cancel</button><button type="submit" className="rounded-md bg-[#00A651] px-4 py-2 text-sm font-semibold text-white">Save Course</button></div>
                    </form>
                </div>
            )}

            {mergeOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4" onMouseDown={(e) => { if (e.target === e.currentTarget) setMergeOpen(false); }}>
                    <div role="dialog" aria-modal="true" aria-labelledby="merge-title" className="w-full max-w-md space-y-4 rounded-lg bg-white p-6 shadow-xl">
                        <h2 id="merge-title" className="text-lg font-semibold">Merge duplicate courses</h2>

                        <p className="text-sm text-gray-600">Choose which course to keep. Other selected course entries will be removed from this local directory.</p>
                        
                        <label className="block text-sm font-medium">Keep course
                            <select value={mergeTarget} onChange={(e) => setMergeTarget(e.target.value)} className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2">
                                {selected.map((course) => <option key={course.id} value={course.id}>{course.code} — {course.name}</option>)}
                            </select>
                        </label>
                        
                        <p className="text-xs text-gray-500">
                            The selected courses will be combined into one course. Please review your selection before confirming.
                        </p>

                        <div className="flex justify-end gap-2"><button type="button" onClick={() => setMergeOpen(false)} className="rounded-md border px-4 py-2 text-sm">Cancel</button><button type="button" onClick={confirmMerge} className="rounded-md bg-[#00A651] px-4 py-2 text-sm font-semibold text-white">Confirm Merge</button></div>
                    </div>
                </div>
            )}

            {/* Delete Course Modal */}
            {courseToDelete && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="delete-course-title"
                        className="w-full max-w-xl space-y-4 rounded-3xl bg-white p-8 shadow-xl"
                    >
                        {/* Header */}
                        <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                                <span className="text-lg">⚑</span>
                            </div>

                            <div>
                                <h2
                                    id="delete-course-title"
                                    className="text-lg font-semibold text-[#303a36]"
                                >
                                    Delete {courseToDelete.code}?
                                </h2>

                                <p className="text-xs text-gray-500">
                                    Courses with notes should be archived or merged instead.
                                </p>
                            </div>
                        </div>

                        {/* Course Information */}
                        <div className="rounded-md border border-gray-300 px-3 py-2">
                            <p className="text-sm font-semibold">
                                {courseToDelete.code}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                                {courseToDelete.name}
                            </p>
                        </div>

                        {/* Delete Options */}
                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => setDeleteMode("move")}
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                    deleteMode === "move"
                                        ? "bg-[#00A651] text-white"
                                        : "bg-gray-100 text-[#303a36]"
                                }`}
                            >
                                Move notes to another course
                            </button>

                            <button
                                type="button"
                                onClick={() => setDeleteMode("archive")}
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                    deleteMode === "archive"
                                        ? "bg-[#00A651] text-white"
                                        : "bg-gray-100 text-[#303a36]"
                                }`}
                            >
                                Archive instead
                            </button>
                        </div>

                        {/* Destination Course */}
                        {deleteMode === "move" && (
                            <div>
                                <label
                                    htmlFor="destination-course"
                                    className="mb-1 block text-xs text-gray-500"
                                >
                                    Move notes to
                                </label>

                                <DirectoryDropdown
                                    label="Move notes to"
                                    value={
                                        courses.find(
                                            (course) => String(course.id) === destinationCourseId
                                        )?.code ?? ""
                                    }
                                    placeholder="Select a course"
                                    fullWidth
                                    options={courses
                                        .filter(
                                            (course) =>
                                                course.id !== courseToDelete.id &&
                                                course.status === "Active"
                                        )
                                        .map((course) => course.code)}
                                    onChange={(code) => {
                                        const destination = courses.find(
                                            (course) => course.code === code
                                        );

                                        setDestinationCourseId(
                                            destination ? String(destination.id) : ""
                                        );
                                    }}
                                />
                            </div>
                        )}

                        {/* Confirmation */}
                        <div>
                            <label
                                htmlFor="delete-course-confirmation"
                                className="mb-1 block text-xs text-gray-500"
                            >
                                Type {courseToDelete.code} to confirm
                            </label>

                            <input
                                id="delete-course-confirmation"
                                type="text"
                                value={deleteConfirmation}
                                onChange={(event) =>
                                    setDeleteConfirmation(event.target.value)
                                }
                                placeholder={courseToDelete.code}
                                className="w-full rounded-md border border-gray-300 px-3 py-3 text-sm outline-none focus:border-red-400"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={closeDelete}
                                className="rounded-full border border-gray-300 px-5 py-2 text-xs font-semibold hover:bg-gray-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={confirmDelete}
                                disabled={
                                    deleteConfirmation !== courseToDelete.code ||
                                    deleteMode === "move"
                                }
                                className={`rounded-md border px-4 py-2 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                                    deleteMode === "archive"
                                        ? "border-gray-300 bg-white text-[#303a36] hover:bg-gray-100"
                                        : "border-red-600 bg-red-600 text-white hover:bg-red-700"
                                }`}
                            >
                                {deleteMode === "archive"
                                    ? "Archive Course"
                                    : "Delete Course"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
