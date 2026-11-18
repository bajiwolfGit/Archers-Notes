import type { ReportStatus, UserStatus } from "@/data/admin";

const statusStyles: Record<UserStatus | ReportStatus, string> = {
	Active: "bg-green-100 text-green-700",
	Suspended: "bg-red-100 text-red-600",
	Open: "bg-red-100 text-red-600",
	"In Review": "bg-amber-100 text-amber-700",
	Resolved: "bg-green-100 text-green-700",
	Dismissed: "bg-gray-200 text-gray-700",
};

export default function AdminStatusBadge({
	status,
}: {
	status: UserStatus | ReportStatus;
}) {
	return (
		<span
			className={`inline-flex min-w-[70px] justify-center whitespace-nowrap rounded-full px-3 py-1 text-[10px] font-semibold ${statusStyles[status]}`}
		>
			{status}
		</span>
	);
}
