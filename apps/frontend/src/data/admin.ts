export type UserRole = "Student" | "Admin";

export type UserStatus = "Active" | "Suspended";

export type ReportStatus = "Open" | "In Review" | "Resolved" | "Dismissed";

export type ReportTargetType = "Note" | "Comment";

export type SuspensionDuration = "24 hours" | "7 days" | "30 days" | "Permanent";

export const CURRENT_ADMIN = "Admin1";

export const colleges = [
	"CCS",
	"GCOE",
	"CLA",
	"COS",
	"RVRCOB",
	"SOE",
	"BAGCED",
];

export const courseOptions = [
	"CSADPRG",
	"CSARCH1",
	"CSARCH2",
	"CSNETWK",
	"DATA101",
	"DATA103",
	"STALGCM",
	"STADVDB",
	"STSWENG",
	"FNDACCT",
];

export const reportReasons = [
	"Harassment",
	"Threatening Violence",
	"Hate",
	"Spam",
	"Copyright",
	"Inappropriate",
	"Off-topic",
	"Impersonation",
];

export interface AdminUser {
	id: number;
	name: string;
	email: string;
	college: string;
	role: UserRole;
	status: UserStatus;
	joinedAt: string;
	courses: string[];
	following: number;
	followers: number;
	savedNotes: number;
	comments: number;
	suspension?: {
		duration: SuspensionDuration;
		reason: string;
		until: string | null;
	};
}

export interface AdminReport {
	id: number;
	targetType: ReportTargetType;
	postId: number;
	contentTitle: string;
	commentText?: string;
	authorId: number;
	reason: string;
	details: string;
	reporters: string[];
	createdAt: string;
	moderator: string | null;
	status: ReportStatus;
	resolutionNote: string;
}

export interface ActivityLogEntry {
	id: number;
	createdAt: string;
	admin: string;
	action: string;
	target: string;
	reason: string;
}

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

function ago(now: number, milliseconds: number) {
	return new Date(now - milliseconds).toISOString();
}

export function createMockUsers(now: number): AdminUser[] {
	return [
		{
			id: 1,
			name: "John Doe",
			email: "john_doe@dlsu.edu.ph",
			college: "CCS",
			role: "Student",
			status: "Active",
			joinedAt: ago(now, 30 * DAY),
			courses: ["CSADPRG", "CSARCH1", "CSNETWK", "DATA101"],
			following: 5,
			followers: 34,
			savedNotes: 4,
			comments: 14,
		},
		{
			id: 2,
			name: "Jane Doe",
			email: "jane_doe@dlsu.edu.ph",
			college: "CCS",
			role: "Student",
			status: "Suspended",
			joinedAt: ago(now, 340 * DAY),
			courses: ["STADVDB", "STALGCM", "FNDACCT"],
			following: 12,
			followers: 20,
			savedNotes: 9,
			comments: 31,
			suspension: {
				duration: "7 days",
				reason: "Repeated policy violations",
				until: ago(now, -5 * DAY),
			},
		},
		{
			id: 3,
			name: "Carmy Berzatto",
			email: "carmy_berzatto@dlsu.edu.ph",
			college: "GCOE",
			role: "Student",
			status: "Active",
			joinedAt: ago(now, 95 * DAY),
			courses: ["CSARCH2"],
			following: 8,
			followers: 15,
			savedNotes: 2,
			comments: 6,
		},
		{
			id: 4,
			name: "Alan Smith",
			email: "alan_smith@dlsu.edu.ph",
			college: "CCS",
			role: "Student",
			status: "Active",
			joinedAt: ago(now, 60 * DAY),
			courses: ["STSWENG"],
			following: 3,
			followers: 7,
			savedNotes: 1,
			comments: 2,
		},
		{
			id: 5,
			name: "Admin123",
			email: "admin_123@dlsu.edu.ph",
			college: "CCS",
			role: "Admin",
			status: "Active",
			joinedAt: ago(now, 680 * DAY),
			courses: [],
			following: 0,
			followers: 0,
			savedNotes: 0,
			comments: 0,
		},
	];
}

export function createMockReports(now: number): AdminReport[] {
	return [
		{
			id: 1,
			targetType: "Note",
			postId: 1,
			contentTitle: "Midterms Reviewer",
			authorId: 1,
			reason: "Copyright",
			details: "These look like scanned pages from the official textbook.",
			reporters: ["Jane Doe", "Alan Smith"],
			createdAt: ago(now, HOUR),
			moderator: "Admin1",
			status: "Open",
			resolutionNote: "",
		},
		{
			id: 2,
			targetType: "Comment",
			postId: 1,
			contentTitle: "Comment in Midterms Reviewer",
			commentText: "This reviewer is useless, whoever wrote this should quit.",
			authorId: 1,
			reason: "Inappropriate",
			details: "Rude comment directed at the author.",
			reporters: ["Jane Doe"],
			createdAt: ago(now, 2 * DAY),
			moderator: "Admin2",
			status: "Resolved",
			resolutionNote: "Comment removed and user warned.",
		},
		{
			id: 3,
			targetType: "Note",
			postId: 2,
			contentTitle: "Lorem Ipsum",
			authorId: 2,
			reason: "Off-topic",
			details: "This post has nothing to do with FNDACCT.",
			reporters: ["Jane Doe"],
			createdAt: ago(now, 2 * HOUR),
			moderator: null,
			status: "Open",
			resolutionNote: "",
		},
		{
			id: 4,
			targetType: "Note",
			postId: 101,
			contentTitle: "Advanced Database Midterm Reviewer",
			authorId: 2,
			reason: "Spam",
			details: "Same reviewer posted several times.",
			reporters: ["John Doe", "Carmy Berzatto", "Alan Smith"],
			createdAt: ago(now, 5 * HOUR),
			moderator: "Admin3",
			status: "In Review",
			resolutionNote: "",
		},
		{
			id: 5,
			targetType: "Comment",
			postId: 1,
			contentTitle: "Comment in Midterms Reviewer",
			commentText: "Check out my page for FREE answer keys!!! link in bio",
			authorId: 3,
			reason: "Spam",
			details: "",
			reporters: ["John Doe", "Jane Doe", "Alan Smith", "Admin123", "Carmy Berzatto"],
			createdAt: ago(now, 7 * DAY),
			moderator: "Admin4",
			status: "Dismissed",
			resolutionNote: "Not spam, link was to a study group.",
		},
		{
			id: 6,
			targetType: "Note",
			postId: 104,
			contentTitle: "Graph Algorithms Cheat Sheet",
			authorId: 2,
			reason: "Copyright",
			details: "Copied from a paid course.",
			reporters: ["Carmy Berzatto"],
			createdAt: ago(now, 3 * HOUR),
			moderator: null,
			status: "Open",
			resolutionNote: "",
		},
	];
}

export function createMockActivityLog(now: number): ActivityLogEntry[] {
	return [
		{
			id: 1,
			createdAt: ago(now, HOUR),
			admin: "Admin1",
			action: "Hid note",
			target: "Midterms Reviewer",
			reason: "Spam report",
		},
		{
			id: 2,
			createdAt: ago(now, 5 * DAY),
			admin: "Admin2",
			action: "Edited note",
			target: "Midterms Reviewer",
			reason: "Remove duplicate files",
		},
		{
			id: 3,
			createdAt: ago(now, 7 * DAY),
			admin: "Admin3",
			action: "Suspended user",
			target: "Jane Doe",
			reason: "Repeated violations",
		},
		{
			id: 4,
			createdAt: ago(now, 30 * DAY),
			admin: "Admin4",
			action: "Posted announcement",
			target: "All users",
			reason: "",
		},
	];
}

export function formatRelativeTime(iso: string, now: number): string {
	const elapsed = Math.max(0, now - new Date(iso).getTime());
	const minutes = Math.floor(elapsed / 60000);

	if (minutes < 1) return "Just now";
	if (minutes < 60) return `${minutes} min`;

	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `${hours} hr`;

	const days = Math.floor(hours / 24);
	if (days < 7) return `${days} ${days === 1 ? "day" : "days"}`;

	const weeks = Math.floor(days / 7);
	if (days < 30) return `${weeks} ${weeks === 1 ? "week" : "weeks"}`;

	const months = Math.floor(days / 30);
	if (months < 12) return `${months} ${months === 1 ? "month" : "months"}`;

	const years = Math.floor(days / 365);
	return `${years} ${years === 1 ? "year" : "years"}`;
}

export function formatMonthYear(iso: string): string {
	return new Date(iso).toLocaleDateString("en-US", {
		month: "short",
		year: "numeric",
	});
}

export function formatReporters(reporters: string[]): string {
	return reporters.length === 1 ? reporters[0] : `${reporters.length} users`;
}

export function isValidDlsuEmail(email: string): boolean {
	return /^[^\s@]+@dlsu\.edu\.ph$/i.test(email.trim());
}

export function downloadCsv(
	filename: string,
	headers: string[],
	rows: (string | number)[][]
) {
	const escape = (value: string | number) => {
		let text = String(value);

		if (/^[=+\-@]/.test(text)) text = `'${text}`;

		return `"${text.replace(/"/g, '""')}"`;
	};

	const csv = [headers, ...rows]
		.map((row) => row.map(escape).join(","))
		.join("\n");

	const url = URL.createObjectURL(
		new Blob([csv], { type: "text/csv;charset=utf-8" })
	);

	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	link.click();

	URL.revokeObjectURL(url);
}
