
/**
 * File: components/admin/moderation-stats.tsx
 *
 * Description:
 * Displays moderation statistics for the Admin Dashboard.
 */

interface ModerationStatsProps {
    openReports: number;
    notesPostedToday: number;
    newUsers: number;
    suspendedAccounts: number;
}

export default function ModerationStats({
    openReports,
    notesPostedToday,
    newUsers,
    suspendedAccounts,
}: ModerationStatsProps) {
    const stats = [
        { label: "Open reports", value: openReports },
        { label: "Notes posted today", value: notesPostedToday },
        { label: "New users, 7 days", value: newUsers },
        { label: "Suspended Accounts", value: suspendedAccounts },
    ];

    return (
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
            {stats.map((stat) => (
                <div
                    key={stat.label}
                    className="rounded-[10px] border border-gray-200 bg-white px-4 py-4"
                >
                    <p className="text-2xl font-bold text-[#303a36]">
                        {stat.value}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                        {stat.label}
                    </p>
                </div>
            ))}
        </div>
    );
}
