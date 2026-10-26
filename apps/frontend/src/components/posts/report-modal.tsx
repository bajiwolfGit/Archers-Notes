"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const reportReasons = [
    "Harassment",
    "Threatening Violence",
    "Hate",
    "Minor abuse or sexualization",
    "Sharing personal information",
    "Non-consensual intimate media",
    "Prohibited transaction",
    "Impersonation",
    "Copyright violation",
    "Self-harm or suicide",
    "Spam"
];

export default function ReportModal({
    isOpen,
    onClose,
}: ReportModalProps) {
    const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
    const [details, setDetails] = useState("");
    const [error, setError] = useState("");
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleReason = (reason: string) => {
        setError("");

        setSelectedReasons((prev) =>
            prev.includes(reason)
                ? prev.filter((r) => r !== reason)
                : [...prev, reason]
        );
    };

    const handleSubmit = () => {
        if (selectedReasons.length === 0) {
            setError("Please select at least one reason.");
            return;
        }

        setError("");

        // TODO: Send report to backend
        console.log({
            reasons: selectedReasons,
            details,
        });

        setSelectedReasons([]);
        setDetails("");

        setShowSuccessModal(true);
    };

    if (!mounted) return null;

    return createPortal(
        <> 
            {isOpen && !showSuccessModal &&
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4"
                    onClick={onClose}
                >
                    <div
                        className="relative w-full max-w-[600px] rounded-[30px] bg-white px-8 py-6 shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                    >

                        {/* Header */}
                        <div className="mb-5 flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="text-xl text-gray-700 hover:text-black"
                                    aria-label="Close report modal"
                                >
                                    <Image
                                        src="/assets/icons/exit.svg"
                                        alt=""
                                        width={16}
                                        height={16}
                                        className="object-contain"
                                    />
                                </button>

                                <h2 className="text-sm font-semibold text-gray-800">
                                    Submit a Report
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="rounded-full bg-[#00A651] px-10 py-2 text-sm font-semibold text-white hover:bg-[#008f45]"
                            >
                                Submit
                            </button>
                        </div>

                        {/* Description */}
                        <p className="mb-5 ml-10 text-sm text-gray-600">
                            Thanks for looking out for yourself and your fellow note takers
                            by reporting things that break the rules. Let us know what&apos;s
                            happening, and we&apos;ll look into it.
                        </p>

                        {error && (
                            <p role="alert" className="mb-3 ml-10 text-xs text-red-500">
                                {error}
                            </p>
                        )}

                        {/* Reasons */}
                        <div className="mb-3 ml-10 rounded-lg border border-gray-200 p-4">
                            <p className="mb-3 text-xs text-gray-400">
                                Select Reason/s
                            </p>

                            <div className="flex flex-wrap gap-2">
                                {reportReasons.map((reason) => {
                                    const selected = selectedReasons.includes(reason);

                                    return (
                                        <button
                                            key={reason}
                                            type="button"
                                            onClick={() => toggleReason(reason)}
                                            className={`rounded-full px-3 py-1.5 text-xs transition ${selected
                                                    ? "bg-[#00A651] text-white"
                                                    : "bg-[#E7EEE9] text-gray-700 hover:bg-[#D5E5DA]"
                                                }`}
                                        >
                                            {reason}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Additional Details */}
                        <div className="ml-10 rounded-lg border border-gray-200 p-3">
                            <label
                                htmlFor="report-details"
                                className="mb-2 block text-xs text-gray-400"
                            >
                                Share with Us
                            </label>

                            <textarea
                                id="report-details"
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                                placeholder="Provide additional details..."
                                className="h-[140px] w-full resize-none text-sm text-gray-700 outline-none placeholder:text-gray-300"
                            />

                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setDetails("")}
                                    className="text-red-400 hover:text-red-600"
                                    aria-label="Clear details"
                                >
                                    <Image
                                        src="/assets/icons/delete.svg"
                                        alt=""
                                        width={16}
                                        height={16}
                                        className="object-contain"
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            }

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 px-4">
                    <div
                        className="w-full max-w-[440px] rounded-[24px] bg-white px-8 py-10 text-center shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >

                        {/* Success Icon */}
                        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                            <svg
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#00A651"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M20 6 9 17l-5-5" />
                            </svg>
                        </div>

                        {/* Title */}
                        <h2 className="mb-3 text-lg font-semibold text-gray-900">
                            Report Submitted Successfully!
                        </h2>

                        {/* Description */}
                        <p className="mb-6 text-sm leading-relaxed text-gray-500">
                            Thank you for helping keep Archer's Notes a safe and
                            welcoming community.
                            <br /><br />
                            Your report has been received and will be reviewed
                            by our team. Please check your email or notifications
                            for updates regarding your report.
                        </p>

                        {/* Done Button */}
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowSuccessModal(false);
                                onClose();
                            }}
                            className="w-full rounded-full bg-[#00A651] py-3 text-sm font-semibold text-white transition hover:bg-[#008f45]"
                        >
                            Done
                        </button>
                    </div>
                </div>
            )}
        </>,
        document.body
    );
}