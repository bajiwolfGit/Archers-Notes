"use client";

import {
	createContext,
	useContext,
	useEffect,
	useState,
	type ReactNode,
} from "react";

import {
	CURRENT_ADMIN,
	createMockActivityLog,
	createMockReports,
	createMockUsers,
	type ActivityLogEntry,
	type AdminReport,
	type AdminUser,
} from "@/data/admin";

const USERS_STORAGE_KEY = "archers-notes-admin-users";
const REPORTS_STORAGE_KEY = "archers-notes-admin-reports";
const ACTIVITY_STORAGE_KEY = "archers-notes-admin-activity";

interface AdminContextType {
	loaded: boolean;
	now: number;
	users: AdminUser[];
	reports: AdminReport[];
	activityLog: ActivityLogEntry[];
	getUser: (id: number) => AdminUser | undefined;
	addUser: (user: Omit<AdminUser, "id">) => AdminUser;
	updateUser: (id: number, updates: Partial<AdminUser>) => void;
	deleteUser: (id: number) => void;
	updateReports: (ids: number[], updates: Partial<AdminReport>) => void;
	logAction: (action: string, target: string, reason?: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

function readStorage<T>(key: string): T | null {
	try {
		const stored = localStorage.getItem(key);

		return stored ? (JSON.parse(stored) as T) : null;
	} catch (error) {
		console.error(`Failed to load ${key}:`, error);
		return null;
	}
}

function writeStorage<T>(key: string, value: T) {
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch (error) {
		console.error(`Failed to save ${key}:`, error);
	}
}

export function AdminProvider({ children }: { children: ReactNode }) {
	const [loaded, setLoaded] = useState(false);
	const [now, setNow] = useState(0);
	const [users, setUsers] = useState<AdminUser[]>([]);
	const [reports, setReports] = useState<AdminReport[]>([]);
	const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([]);

	useEffect(() => {
		const current = Date.now();

		setNow(current);
		setUsers(
			readStorage<AdminUser[]>(USERS_STORAGE_KEY) ?? createMockUsers(current)
		);
		setReports(
			readStorage<AdminReport[]>(REPORTS_STORAGE_KEY) ??
				createMockReports(current)
		);
		setActivityLog(
			readStorage<ActivityLogEntry[]>(ACTIVITY_STORAGE_KEY) ??
				createMockActivityLog(current)
		);
		setLoaded(true);

		const interval = window.setInterval(() => setNow(Date.now()), 60000);

		return () => window.clearInterval(interval);
	}, []);

	useEffect(() => {
		if (loaded) writeStorage(USERS_STORAGE_KEY, users);
	}, [users, loaded]);

	useEffect(() => {
		if (loaded) writeStorage(REPORTS_STORAGE_KEY, reports);
	}, [reports, loaded]);

	useEffect(() => {
		if (loaded) writeStorage(ACTIVITY_STORAGE_KEY, activityLog);
	}, [activityLog, loaded]);

	function getUser(id: number) {
		return users.find((user) => user.id === id);
	}

	function addUser(user: Omit<AdminUser, "id">): AdminUser {
		const created: AdminUser = {
			...user,
			id: Math.max(0, ...users.map((item) => item.id)) + 1,
		};

		setUsers((previous) => [created, ...previous]);

		return created;
	}

	function updateUser(id: number, updates: Partial<AdminUser>) {
		setUsers((previous) =>
			previous.map((user) => (user.id === id ? { ...user, ...updates } : user))
		);
	}

	function deleteUser(id: number) {
		setUsers((previous) => previous.filter((user) => user.id !== id));
	}

	function updateReports(ids: number[], updates: Partial<AdminReport>) {
		setReports((previous) =>
			previous.map((report) =>
				ids.includes(report.id) ? { ...report, ...updates } : report
			)
		);
	}

	function logAction(action: string, target: string, reason = "") {
		const timestamp = Date.now();

		setActivityLog((previous) => [
			{
				id: timestamp + Math.random(),
				createdAt: new Date(timestamp).toISOString(),
				admin: CURRENT_ADMIN,
				action,
				target,
				reason,
			},
			...previous,
		]);

		setNow(timestamp);
	}

	return (
		<AdminContext.Provider
			value={{
				loaded,
				now,
				users,
				reports,
				activityLog,
				getUser,
				addUser,
				updateUser,
				deleteUser,
				updateReports,
				logAction,
			}}
		>
			{children}
		</AdminContext.Provider>
	);
}

export function useAdmin() {
	const context = useContext(AdminContext);

	if (!context) {
		throw new Error("useAdmin must be used within an AdminProvider");
	}

	return context;
}
