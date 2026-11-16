"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * File: components/settings/academic-settings.tsx
 *
 * Description:
 * Allows users to manage their academic information,
 * including college, course, and batch ID number.
 */

export interface AcademicSettingsData {
    college: string;
    course: string;
    batchId: string;
}

interface AcademicSettingsProps {
    initialData?: AcademicSettingsData;
    onChange?: (data: AcademicSettingsData) => void;
}

const colleges = [
    { value: "BAGCED", label: "BAGCED" },
    { value: "CCS", label: "CCS" },
    { value: "CLA", label: "CLA" },
    { value: "COB", label: "COB" },
    { value: "COS", label: "COS" },
    { value: "GCOE", label: "GCOE" },
    { value: "SOE", label: "SOE" },
];

export default function AcademicSettings({
    initialData = {
        college: "CCS",
        course: "Computer Science Major in Software Technology",
        batchId: "126",
    },
    onChange,
}: AcademicSettingsProps) {
    const [formData, setFormData] = useState<AcademicSettingsData>(initialData);

    const [isCollegeOpen, setIsCollegeOpen] = useState(false);
    const collegeDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                collegeDropdownRef.current &&
                !collegeDropdownRef.current.contains(event.target as Node)
            ) {
                setIsCollegeOpen(false);
            }
        }

        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setIsCollegeOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    function handleChange(
        field: keyof AcademicSettingsData,
        value: string
    ) {
        const updatedData = {
        ...formData,
        [field]: value,
        };

        setFormData(updatedData);
        onChange?.(updatedData);
    }

    const inputClassName =
        "mt-2 w-full rounded-md border border-gray-200 " +
        "bg-white px-4 py-3 text-sm text-[#343B36] " +
        "outline-none transition-colors " +
        "focus:border-[#00A651] focus:ring-1 focus:ring-[#00A651]";

    return (
        <section className="w-full">
            {/* Section Header */}
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-[#343B36]">
                    Academic Information
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    Make sure your information is accurate to help
                    keep our community safe and authentic to students.
                </p>
            </div>

            <div className="space-y-6">
                {/* College */}
                <div>
                    <label
                        htmlFor="college"
                        className="text-sm font-semibold text-[#343B36]"
                    >
                        College <span className="text-red-500">*</span>
                    </label>

                    <p className="mt-1 text-xs text-gray-500">
                        Select what college you are currently enrolled in.
                    </p>

                    <div ref={collegeDropdownRef} className="relative mt-2">

                        {/* Dropdown Trigger */}
                        <button
                            id="college"
                            type="button"
                            aria-expanded={isCollegeOpen}
                            aria-haspopup="true"
                            onClick={() => setIsCollegeOpen(!isCollegeOpen)}
                            className={`flex w-full items-center justify-between
                                rounded-md border bg-white px-4 py-3
                                text-left text-sm text-[#343B36]
                                transition-colors
                                ${
                                    isCollegeOpen
                                        ? "border-[#00A651]"
                                        : "border-gray-200 hover:border-gray-300"
                                }`}
                        >
                            <span>
                                {formData.college || "Select your college"}
                            </span>

                            <Image
                                src="/assets/icons/dropdown.svg"
                                alt=""
                                width={12}
                                height={12}
                                className={`transition-transform duration-200 ${
                                    isCollegeOpen ? "rotate-180" : ""
                                }`}
                            />
                        </button>

                        {/* Dropdown Options */}
                        {isCollegeOpen && (
                            <div
                                className="absolute left-0 top-full z-30 mt-1
                                    max-h-60 w-full overflow-y-auto rounded-md
                                    border border-gray-200 bg-white py-1 shadow-md"
                            >
                                {colleges.map((college) => (
                                    <button
                                        key={college.value}
                                        type="button"
                                        onClick={() => {
                                            handleChange("college", college.value);
                                            setIsCollegeOpen(false);
                                        }}
                                        className={`w-full px-4 py-2.5 text-left
                                            text-sm transition-colors
                                            ${
                                                formData.college === college.value
                                                    ? "bg-[#EAF8EF] font-medium text-[#00A651]"
                                                    : "text-[#343B36] hover:bg-gray-50"
                                            }`}
                                    >
                                        {college.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Course */}
                <div>
                    <label
                        htmlFor="course"
                        className="text-sm font-semibold text-[#343B36]"
                    >
                        Course <span className="text-red-500">*</span>
                    </label>

                    <p className="mt-1 text-xs text-gray-500">
                        Provide your full course name as seen on your
                        flowchart.
                    </p>

                    <input
                        id="course"
                        name="course"
                        type="text"
                        required
                        value={formData.course}
                        onChange={(e) =>
                            handleChange("course", e.target.value)
                        }
                        placeholder="Enter your full course name"
                        className={inputClassName}
                    />
                </div>

                {/* Batch ID Number */}
                <div>
                    <label
                        htmlFor="batchId"
                        className="text-sm font-semibold text-[#343B36]"
                    >
                        Batch ID Number{" "}
                        <span className="text-red-500">*</span>
                    </label>

                    <p className="mt-1 text-xs text-gray-500">
                        Provide your batch ID number (ex. 126).
                    </p>

                    <input
                        id="batchId"
                        name="batchId"
                        type="text"
                        inputMode="numeric"
                        maxLength={3}
                        pattern="[0-9]{3}"
                        title="Enter a three-digit batch ID number"
                        required
                        value={formData.batchId}
                        onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        handleChange("batchId", value);
                        }}
                        placeholder="Enter your batch ID number"
                        className={inputClassName}
                    />
                </div>
            </div>
        </section>
    );
}
