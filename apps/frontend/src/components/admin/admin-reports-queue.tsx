"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import AdminFilterDropdown, { toOptions } from "./admin-filter-dropdown";
import AdminStatusBadge from "./admin-status-badge";
import AdminToggleChip from "./admin-toggle-chip";
import AdminModal, { cancelButtonClass, dangerButtonClass } from "./admin-modal";

import { useAdmin } from "@/context/admin-context";

import {
	CURRENT_ADMIN,
	downloadCsv,
	formatRelativeTime,
	formatReporters,
	type ReportStatus,
} from "@/data/admin";

/** Status filter chips. */
const statusFilters: (ReportStatus | "All")[] = [
	"Open",
	"In Review",
	"Resolved",
	"Dismissed",
	"All",
];

export default function AdminReportsQueue() {
	const router = useRouter();
	const { reports, users, now, loaded, updateReports, logAction } = useAdmin();

	const [statusFilter, setStatusFilter] = useState<ReportStatus | "All">("Open");
	const [typeFilter, setTypeFilter] = useState("All");
	const [selectedIds, setSelectedIds] = useState<number[]>([]);
	const [confirmRemove, setConfirmRemove] = useState(false);

	const filteredReports = useMemo(
		() =>
			reports
				.filter(
					(report) =>
						(statusFilter === "All" || report.status === statusFilter) &&
						(typeFilter === "All" || report.targetType === typeFilter)
				)
				.sort(
					(a, b) =>
						new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
				),
		[reports, statusFilter, typeFilter]
	);

	const visibleSelectedIds = selectedIds.filter((id) =>
		filteredReports.some((report) => report.id === id)
	);

	const selectedReports = reports.filter((report) =>
		visibleSelectedIds.includes(report.id)
	);

	const allSelected =
		filteredReports.length > 0 &&
		visibleSelectedIds.length === filteredReports.length;

	function authorName(authorId: number) {
		return users.find((user) => user.id === authorId)?.name ?? "Deleted user";
	}

	function toggleSelected(id: number) {
		setSelectedIds((previous) =>
			previous.includes(id)
				? previous.filter((item) => item !== id)
				: [...previous, id]
		);
	}

	function toggleAll() {
		setSelectedIds(allSelected ? [] : filteredReports.map((report) => report.id));
	}

	function handleDismiss() {
		updateReports(visibleSelectedIds, { status: "Dismissed", moderator: CURRENT_ADMIN });
		selectedReports.forEach((report) =>
			logAction("Dismissed report", report.contentTitle, report.reason)
		);
		setSelectedIds([]);
	}

	function handleAssign() {
		updateReports(visibleSelectedIds, {
			status: "In Review",
			moderator: CURRENT_ADMIN,
		});
		selectedReports.forEach((report) =>
			logAction("Assigned report", report.contentTitle, `Assigned to ${CURRENT_ADMIN}`)
		);
		setSelectedIds([]);
	}

	function handleRemoveContent() {
		updateReports(visibleSelectedIds, {
			status: "Resolved",
			moderator: CURRENT_ADMIN,
			resolutionNote: "Content removed.",
		});
		selectedReports.forEach((report) =>
			logAction(
				report.targetType === "Comment" ? "Removed comment" : "Removed note",
				report.contentTitle,
				report.reason
			)
		);
		setSelectedIds([]);
		setConfirmRemove(false);
	}

	function handleExport() {
		downloadCsv(
			"reports.csv",
			["User", "Content", "Type", "Reason", "Reporters", "Reported At", "Moderator", "Status"],
			filteredReports.map((report) => [
				authorName(report.authorId),
				report.contentTitle,
				report.targetType,
				report.reason,
				report.reporters.join("; "),
				report.createdAt,
				report.moderator ?? "",
				report.status,
			])
		);
	}

	return (
		<>
			<div className="w-full px-6 py-6">

				<div className="mb-5 flex items-center justify-between gap-4">
					<h1 className="text-2xl font-semibold text-[#303a36]">Reports</h1>

					<button
						type="button"
						onClick={handleExport}
						disabled={filteredReports.length === 0}
						className="rounded-full border border-[#303a36] px-4 py-1.5 text-xs font-semibold text-[#303a36] transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
					>
						Export CSV
					</button>
				</div>

				<div className="mb-5 flex flex-wrap items-center gap-2">
					{statusFilters.map((status) => (
						<AdminToggleChip
							key={status}
							selected={statusFilter === status}
							onClick={() => setStatusFilter(status)}
						>
							{status}
						</AdminToggleChip>
					))}

					<AdminFilterDropdown
						label="Type"
						value={typeFilter}
						onChange={setTypeFilter}
						options={toOptions(["Note", "Comment"])}
					/>
				</div>

				{visibleSelectedIds.length > 0 && (
					<div className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-md border border-gray-200 bg-[#F7FAF8] px-5 py-3">
						<p className="text-sm font-semibold text-[#303a36]">
							{visibleSelectedIds.length} Selected
						</p>

						<div className="flex flex-wrap items-center gap-2">
							<button
								type="button"
								onClick={handleDismiss}
								className="rounded-full bg-[#00A651] px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#008F45]"
							>
								Dismiss
							</button>
							<button
								type="button"
								onClick={handleAssign}
								className="rounded-full border border-[#303a36] px-4 py-1.5 text-xs font-semibold text-[#303a36] transition-colors hover:bg-gray-50"
							>
								Assign to me
							</button>
							<button
								type="button"
								onClick={() => setConfirmRemove(true)}
								className="rounded-full bg-red-600 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-red-700"
							>
								Remove Content
							</button>
						</div>
					</div>
				)}

				<div className="w-full overflow-x-auto">
					<table className="w-full border-collapse text-left">
						<thead>
							<tr className="border-b border-gray-200 text-xs font-semibold text-[#303a36]">
								<th className="w-10 px-2 py-4">
									<input
										type="checkbox"
										checked={allSelected}
										onChange={toggleAll}
										aria-label="Select all reports"
										className="h-4 w-4 accent-[#00A651]"
									/>
								</th>
								<th className="px-2 py-4">User</th>
								<th className="px-2 py-4">Content</th>
								<th className="px-2 py-4">Reason</th>
								<th className="px-2 py-4">Reporter</th>
								<th className="px-2 py-4">Time</th>
								<th className="px-2 py-4">Moderator</th>
								<th className="px-2 py-4">Status</th>
							</tr>
						</thead>

						<tbody>
							{loaded &&
								filteredReports.map((report) => {
									const isSelected = visibleSelectedIds.includes(report.id);

									return (
										<tr
											key={report.id}
											onClick={() => router.push(`/admin/reports/${report.id}`)}
											className={`cursor-pointer border-b border-gray-100 text-xs text-[#303a36] transition-colors ${
												isSelected ? "bg-gray-100" : "hover:bg-gray-50"
											}`}
										>
											<td
												className="px-2 py-4"
												onClick={(event) => event.stopPropagation()}
											>
												<input
													type="checkbox"
													checked={isSelected}
													onChange={() => toggleSelected(report.id)}
													aria-label={`Select report on ${report.contentTitle}`}
													className="h-4 w-4 accent-[#00A651]"
												/>
											</td>
											<td className="px-2 py-4">
												<div className="flex items-center gap-2">
													<Image
														src="/assets/icons/profile.svg"
														alt=""
														width={26}
														height={26}
														className="h-6.5 w-6.5 shrink-0"
													/>
													<span className="font-semibold">
														{authorName(report.authorId)}
													</span>
												</div>
											</td>
											<td className="max-w-[180px] px-2 py-4 font-semibold">
												{report.contentTitle}
											</td>
											<td className="px-2 py-4">{report.reason}</td>
											<td className="px-2 py-4">{formatReporters(report.reporters)}</td>
											<td className="whitespace-nowrap px-2 py-4">
												{formatRelativeTime(report.createdAt, now)}
											</td>
											<td className="px-2 py-4">{report.moderator ?? "—"}</td>
											<td className="px-2 py-4">
												<AdminStatusBadge status={report.status} />
											</td>
										</tr>
									);
								})}
						</tbody>
					</table>

					{loaded && filteredReports.length === 0 && (
						<div className="py-12 text-center text-sm text-gray-500">
							No reports match these filters.
						</div>
					)}
				</div>

				<p className="mt-4 text-xs text-gray-400">
					{loaded ? filteredReports.length : 0} reports found
				</p>
			</div>

			{confirmRemove && (
				<AdminModal
					title={`Remove content for ${visibleSelectedIds.length} ${
						visibleSelectedIds.length === 1 ? "report" : "reports"
					}?`}
					onClose={() => setConfirmRemove(false)}
					footer={
						<>
							<button
								type="button"
								onClick={() => setConfirmRemove(false)}
								className={cancelButtonClass}
							>
								Cancel
							</button>
							<button
								type="button"
								onClick={handleRemoveContent}
								className={dangerButtonClass}
							>
								Remove Content
							</button>
						</>
					}
				>
					<ul className="space-y-1 text-sm text-gray-600">
						{selectedReports.map((report) => (
							<li key={report.id}>
								• {report.contentTitle}{" "}
								<span className="text-xs text-gray-400">({report.reason})</span>
							</li>
						))}
					</ul>
					<p className="text-xs text-gray-400">
						The reported notes or comments will be removed and the reports
						marked as resolved.
					</p>
				</AdminModal>
			)}
		</>
	);
}
