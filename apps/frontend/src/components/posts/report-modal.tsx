/**
 * File: components/posts/report-modal.tsx
 *
 * Description:
 * Displays a report form for flagging content in Archer's Notes.
 * Users can select multiple report reasons, provide optional details,
 * and view a success confirmation after submitting the form.
 *
 * Features:
 * - Multi-select report reasons and optional written details.
 * - Validation requiring at least one reason.
 * - Dismissal by close button or clicking the report overlay.
 * - Success confirmation dialog after local submission handling.
 * - Portal rendering into document.body.
 *
 * Note: Reports are currently logged to the console, not sent to a backend.
 */


"use client";

// React hooks for local form state and client-side mount detection.
import { useState, useEffect } from "react";

// Renders the dialogs directly inside the document body.
import { createPortal } from "react-dom";

// Optimized icons used in the report form.
import Image from "next/image";

/**
 * Props controlling the report dialog.
 * @property isOpen Whether the report form should be visible.
 * @property onClose Callback for dismissing the report flow.
 */
interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
}

/** Available report categories displayed as selectable buttons. */
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

/**
 * ReportModal
 *
 * Presents a report form and a separate success confirmation.
 * Submission currently validates and logs data without contacting a server.
 *
 * @param isOpen Whether the report form is open.
 * @param onClose Called when the report flow is dismissed.
 * @returns The portal containing the report and success dialogs, or null before mount.
 */
export default function ReportModal({
    isOpen,
    onClose,
}: ReportModalProps) {

    // Currently selected report categories (multiple selections allowed).
    const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
    
    // Optional explanation entered by the user.
    const [details, setDetails] = useState("");
    
    // Validation feedback when the user submits without a reason.
    const [error, setError] = useState("");
    
    // Controls the confirmation dialog shown after submission.
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    
    // Ensures portal rendering only begins after client-side mounting.
    const [mounted, setMounted] = useState(false);

    // Mark the component as mounted after the first client-side render.
    useEffect(() => {
        setMounted(true);
    }, []);

    /** Toggle a report reason and clear any previous validation error. */
    const toggleReason = (reason: string) => {
        setError("");

        setSelectedReasons((prev) =>
            prev.includes(reason)
                ? prev.filter((r) => r !== reason)
                : [...prev, reason]
        );
    };

    /** Validate the selection, log the report, and show confirmation. */
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

    // Render the dialogs at document.body to avoid parent layout constraints.
    return createPortal(
        <> 
            {/* Show the report form only while open and before confirmation. */}
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

                        {/* Display validation feedback when no reason is selected. */}
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
                                {/* Render each reason as a toggleable selection button. */}
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
            {/* Show a separate confirmation after a valid local submission. */}
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