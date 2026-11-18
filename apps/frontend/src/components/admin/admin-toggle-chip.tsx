"use client";

import type { ReactNode } from "react";

interface AdminToggleChipProps {
	selected: boolean;
	onClick: () => void;
	variant?: "primary" | "danger";
	children: ReactNode;
}

export default function AdminToggleChip({
	selected,
	onClick,
	variant = "primary",
	children,
}: AdminToggleChipProps) {
	const selectedClass =
		variant === "danger" ? "bg-red-500 text-white" : "bg-[#00A651] text-white";

	return (
		<button
			type="button"
			onClick={onClick}
			aria-pressed={selected}
			className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
				selected ? selectedClass : "bg-gray-100 text-[#303a36] hover:bg-gray-200"
			}`}
		>
			{children}
		</button>
	);
}
