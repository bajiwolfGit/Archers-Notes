
/**
 * File: components/admin/admin-overview.tsx
 *
 * Description:
 * Displays the Admin Dashboard's moderation overview.
 *
 * Features:
 * - Displays moderation statistics.
 * - Displays the moderation feed.
 * - Displays the report queue.
 * - Uses responsive layout styling.
 */

import ModerationStats from "./moderation-stats";
import ModerationFeed from "./moderation-feed";
import ReportQueue from "./report-queue";

export default function AdminOverview() {
    return (
        <div className="w-full px-6 py-6">

            {/* Page Title */}
            <h1 className="mb-6 text-2xl font-semibold text-[#303a36]">
                Moderation Overview
            </h1>

            {/* Dashboard Layout */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_230px]">

                {/* Main Moderation Section */}
                <div className="min-w-0 space-y-5">

                    {/* Moderation Statistics */}
                    <ModerationStats
                        openReports={14}
                        notesPostedToday={12}
                        newUsers={20}
                        suspendedAccounts={2}
                    />

                    {/* Moderation Feed */}
                    <ModerationFeed />
                </div>

                {/* Report Queue */}
                <div className="min-w-0">
                    <ReportQueue />
                </div>
            </div>
        </div>
    );
}
