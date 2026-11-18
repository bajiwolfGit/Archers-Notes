"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import AdminFilterDropdown, { toOptions } from "./admin-filter-dropdown";
import AdminStatusBadge from "./admin-status-badge";
import AdminUserDialogs, {
	useUnsuspendUser,
	type AdminUserDialog,
} from "./admin-user-dialogs";

import { useAdmin } from "@/context/admin-context";
import { colleges, formatMonthYear } from "@/data/admin";

export default function AdminUsersDirectory() {
	const { users, reports, loaded } = useAdmin();
	const unsuspendUser = useUnsuspendUser();

	const [search, setSearch] = useState("");
	const [college, setCollege] = useState("All");
	const [role, setRole] = useState("All");
	const [status, setStatus] = useState("All");

	const [selectedId, setSelectedId] = useState<number | null>(null);
	const [dialog, setDialog] = useState<AdminUserDialog | null>(null);

	const selectedUser = users.find((user) => user.id === selectedId);

	const reportCounts = useMemo(() => {
		const counts = new Map<number, number>();

		reports.forEach((report) => {
			counts.set(report.authorId, (counts.get(report.authorId) ?? 0) + 1);
		});

		return counts;
	}, [reports]);

	const filteredUsers = useMemo(() => {
		const query = search.trim().toLowerCase();

		return users.filter((user) => {
			const matchesSearch =
				user.name.toLowerCase().includes(query) ||
				user.email.toLowerCase().includes(query);

			return (
				matchesSearch &&
				(college === "All" || user.college === college) &&
				(role === "All" || user.role === role) &&
				(status === "All" || user.status === status)
			);
		});
	}, [users, search, college, role, status]);

	return (
		<>
			<div className="w-full px-6 py-6">

				<div className="mb-5 flex items-center justify-between gap-4">
					<h1 className="text-2xl font-semibold text-[#303a36]">Users</h1>

					<button
						type="button"
						onClick={() => setDialog({ type: "add" })}
						className="rounded-full bg-[#00A651] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#008F45]"
					>
						Add User
					</button>
				</div>

				<div className="mb-7 flex flex-wrap items-center gap-2">
					<div className="min-w-[220px] flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2">
						<label
							htmlFor="users-search"
							className="block text-[10px] font-medium text-[#00A651]"
						>
							Search
						</label>
						<input
							id="users-search"
							type="text"
							value={search}
							onChange={(event) => setSearch(event.target.value)}
							placeholder="Name or email"
							className="w-full bg-transparent text-xs text-[#303a36] outline-none placeholder:text-gray-400"
						/>
					</div>

					<AdminFilterDropdown
						label="College"
						value={college}
						onChange={setCollege}
						options={toOptions(colleges)}
					/>
					<AdminFilterDropdown
						label="Role"
						value={role}
						onChange={setRole}
						options={toOptions(["Student", "Admin"])}
					/>
					<AdminFilterDropdown
						label="Status"
						value={status}
						onChange={setStatus}
						options={toOptions(["Active", "Suspended"])}
					/>
				</div>

				<div className="w-full overflow-x-auto">
					<table className="w-full border-collapse text-left">
						<thead>
							<tr className="border-b border-gray-200 text-xs font-semibold text-[#303a36]">
								<th className="px-2 py-4">Users</th>
								<th className="px-2 py-4">Email</th>
								<th className="px-2 py-4">College</th>
								<th className="px-2 py-4">Role</th>
								<th className="px-2 py-4">Status</th>
								<th className="px-2 py-4">Joined</th>
								<th className="px-2 py-4">Reports</th>
							</tr>
						</thead>

						<tbody>
							{loaded &&
								filteredUsers.map((user) => {
									const isSelected = user.id === selectedId;

									return (
										<tr
											key={user.id}
											onClick={() =>
												setSelectedId(isSelected ? null : user.id)
											}
											aria-selected={isSelected}
											className={`cursor-pointer border-b border-gray-100 text-xs text-[#303a36] transition-colors ${
												isSelected ? "bg-green-50" : "hover:bg-gray-50"
											}`}
										>
											<td className="px-2 py-4">
												<div className="flex items-center gap-2">
													<Image
														src="/assets/icons/profile.svg"
														alt=""
														width={28}
														height={28}
														className="h-7 w-7 shrink-0"
													/>

													<button
														type="button"
														onClick={(event) => {
															event.stopPropagation();
															setSelectedId(isSelected ? null : user.id);
														}}
														aria-pressed={isSelected}
														className="font-semibold hover:text-[#00A651]"
													>
														{user.name}
													</button>
												</div>
											</td>
											<td className="px-2 py-4">{user.email}</td>
											<td className="px-2 py-4">{user.college}</td>
											<td className="px-2 py-4">{user.role}</td>
											<td className="px-2 py-4">
												<AdminStatusBadge status={user.status} />
											</td>
											<td className="px-2 py-4">
												{formatMonthYear(user.joinedAt)}
											</td>
											<td className="px-2 py-4">
												{reportCounts.get(user.id) ?? 0}
											</td>
										</tr>
									);
								})}
						</tbody>
					</table>

					{loaded && filteredUsers.length === 0 && (
						<div className="py-12 text-center text-sm text-gray-500">
							No users match your search or filters.
						</div>
					)}
				</div>

				{selectedUser && (
					<div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-md border border-gray-200 bg-[#F7FAF8] px-5 py-3">
						<p className="text-sm font-semibold text-[#303a36]">
							Selected: {selectedUser.name}
						</p>

						<div className="flex flex-wrap items-center gap-2">
							<Link
								href={`/admin/users/${selectedUser.id}`}
								className="rounded-full bg-[#00A651] px-5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#008F45]"
							>
								View
							</Link>

							<button
								type="button"
								onClick={() => setDialog({ type: "edit", user: selectedUser })}
								className="rounded-full border border-[#00A651] px-5 py-1.5 text-xs font-semibold text-[#00A651] transition-colors hover:bg-green-50"
							>
								Edit
							</button>

							{selectedUser.status === "Suspended" ? (
								<button
									type="button"
									onClick={() => unsuspendUser(selectedUser)}
									className="rounded-full border border-[#00A651] px-5 py-1.5 text-xs font-semibold text-[#00A651] transition-colors hover:bg-green-50"
								>
									Unsuspend
								</button>
							) : (
								<button
									type="button"
									onClick={() =>
										setDialog({ type: "suspend", user: selectedUser })
									}
									className="rounded-full border border-red-400 px-5 py-1.5 text-xs font-semibold text-red-500 transition-colors hover:bg-red-50"
								>
									Suspend
								</button>
							)}
						</div>
					</div>
				)}

				<p className="mt-4 text-xs text-gray-400">
					{loaded ? filteredUsers.length : 0} users found
				</p>
			</div>

			<AdminUserDialogs dialog={dialog} onClose={() => setDialog(null)} />
		</>
	);
}
