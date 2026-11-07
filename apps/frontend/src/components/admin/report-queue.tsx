
/**
 * File: components/admin/report-queue.tsx
 *
 * Description:
 * Displays recent reports submitted by users.
 *
 * Features:
 * - Displays the report reason and related note.
 * - Shows report submission information.
 * - Provides navigation to the reports page.
 *
 * Currently uses mock data.
 */

import Link from "next/link";

/**
 * Mock Reports
 *
 * Temporary reports displayed in the Admin Dashboard.
 */
const reports = [
    {
        id: 1,
        reason: "Spam",
        title: "Midterms Reviewer",
        description: "Reported by 2 users · 2h ago",
    },
    {
        id: 2,
        reason: "Inappropriate comment",
        title: "Midterms Reviewer",
        description: "On Midterms Reviewer · 2h ago",
    },
    {
        id: 3,
        reason: "Copyright",
        title: "Midterms Reviewer",
        description: "On Midterms Reviewer · 2h ago",
    },
];

export default function ReportQueue() {
    return (
        <aside className="rounded-[10px] border border-gray-200 bg-white p-4">

            {/* Report Queue Header */}
            <div className="mb-4 flex items-center justify-between gap-2">
                <h2 className="text-sm font-semibold text-[#303a36]">
                    Report Queue
                </h2>

                <Link
                    href="/admin/reports"
                    className="text-xs font-semibold text-green-600 hover:underline"
                >
                    View All
                </Link>
            </div>

            {/* Recent Reports */}
            <div className="space-y-3">
                {reports.map((report) => (
                    <Link
                        key={report.id}
                        href="/admin/reports"
                        className="block rounded-[10px] border border-gray-200 p-3 transition-colors hover:bg-gray-50"
                    >
                        {/* Report Reason */}
                        <p className="text-xs font-medium text-[#303a36]">
                            {report.reason} · {report.title}
                        </p>

                        {/* Report Information */}
                        <p className="mt-1 text-[11px] text-gray-400">
                            {report.description}
                        </p>
                    </Link>
                ))}
            </div>
        </aside>
    );
}
