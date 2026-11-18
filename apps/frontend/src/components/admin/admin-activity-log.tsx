"use client";

import { useMemo, useState } from "react";

import AdminFilterDropdown, { toOptions } from "./admin-filter-dropdown";

import { useAdmin } from "@/context/admin-context";
import { downloadCsv, formatRelativeTime } from "@/data/admin";

function actionType(action: string) {
	return action.replace(/\s*\(.*\)$/, "");
}

export default function AdminActivityLog() {
	const { activityLog, now, loaded } = useAdmin();

	const [search, setSearch] = useState("");
	const [admin, setAdmin] = useState("All");
	const [action, setAction] = useState("All");

	const admins = useMemo(
		() => Array.from(new Set(activityLog.map((entry) => entry.admin))).sort(),
		[activityLog]
	);

	const actions = useMemo(
		() =>
			Array.from(new Set(activityLog.map((entry) => actionType(entry.action)))).sort(),
		[activityLog]
	);

	const filteredEntries = useMemo(() => {
		const query = search.trim().toLowerCase();

		return activityLog.filter((entry) => {
			const matchesSearch = [entry.admin, entry.action, entry.target, entry.reason]
				.join(" ")
				.toLowerCase()
				.includes(query);

			return (
				matchesSearch &&
				(admin === "All" || entry.admin === admin) &&
				(action === "All" || actionType(entry.action) === action)
			);
		});
	}, [activityLog, search, admin, action]);

	function handleExport() {
		downloadCsv(
			"activity-log.csv",
			["Time", "Admin", "Action", "Target", "Reason"],
			filteredEntries.map((entry) => [
				entry.createdAt,
				entry.admin,
				entry.action,
				entry.target,
				entry.reason,
			])
		);
	}

	return (
		<div className="w-full px-6 py-6">

			<div className="mb-5 flex items-center justify-between gap-4">
				<h1 className="text-2xl font-semibold text-[#303a36]">Activity Log</h1>

				<button
					type="button"
					onClick={handleExport}
					disabled={filteredEntries.length === 0}
					className="rounded-full border border-[#303a36] px-4 py-1.5 text-xs font-semibold text-[#303a36] transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
				>
					Export CSV
				</button>
			</div>

			<div className="mb-7 flex flex-wrap items-center gap-2">
				<div className="min-w-[220px] flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2">
					<label
						htmlFor="activity-search"
						className="block text-[10px] font-medium text-[#00A651]"
					>
						Search
					</label>
					<input
						id="activity-search"
						type="text"
						value={search}
						onChange={(event) => setSearch(event.target.value)}
						placeholder="Admin, target, or reason"
						className="w-full bg-transparent text-xs text-[#303a36] outline-none placeholder:text-gray-400"
					/>
				</div>

				<AdminFilterDropdown
					label="Admin"
					value={admin}
					onChange={setAdmin}
					options={toOptions(admins)}
				/>
				<AdminFilterDropdown
					label="Action"
					value={action}
					onChange={setAction}
					options={toOptions(actions)}
				/>
			</div>

			<div className="w-full overflow-x-auto">
				<table className="w-full border-collapse text-left">
					<thead>
						<tr className="border-b border-gray-200 text-xs font-semibold text-[#303a36]">
							<th className="px-2 py-4">Time</th>
							<th className="px-2 py-4">Admin</th>
							<th className="px-2 py-4">Action</th>
							<th className="px-2 py-4">Target</th>
							<th className="px-2 py-4">Reason</th>
						</tr>
					</thead>

					<tbody>
						{loaded &&
							filteredEntries.map((entry) => (
								<tr
									key={entry.id}
									className="border-b border-gray-100 text-xs text-[#303a36]"
								>
									<td
										className="whitespace-nowrap px-2 py-4 font-semibold"
										title={new Date(entry.createdAt).toLocaleString()}
									>
										{formatRelativeTime(entry.createdAt, now)}
									</td>
									<td className="px-2 py-4">{entry.admin}</td>
									<td className="px-2 py-4 font-semibold">{entry.action}</td>
									<td className="px-2 py-4">{entry.target}</td>
									<td className="px-2 py-4">{entry.reason || "-"}</td>
								</tr>
							))}
					</tbody>
				</table>

				{loaded && filteredEntries.length === 0 && (
					<div className="py-12 text-center text-sm text-gray-500">
						No activity matches your search or filters.
					</div>
				)}
			</div>

			<p className="mt-4 text-xs text-gray-400">
				Entries cannot be edited or deleted.
			</p>
		</div>
	);
}
