"use client";

import { useEffect, useRef, useState } from "react";

interface AdminFilterDropdownProps {
	label: string;
	value: string;
	options: {
		value: string;
		label: string;
	}[];
	onChange: (value: string) => void;
}

export default function AdminFilterDropdown({
	label,
	value,
	options,
	onChange,
}: AdminFilterDropdownProps) {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const selectedOption = options.find((option) => option.value === value);

	return (
		<div ref={dropdownRef} className="relative shrink-0">

			<button
				type="button"
				aria-label={label}
				aria-haspopup="listbox"
				aria-expanded={isOpen}
				onClick={() => setIsOpen((previous) => !previous)}
				className="flex min-w-[110px] items-center justify-between gap-3 rounded-full bg-gray-100 px-4 py-2 text-xs font-semibold text-[#303a36] transition-colors hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-[#00A651]"
			>
				<span className="whitespace-nowrap">
					{label}: {selectedOption?.label}
				</span>

				<svg
					className={`h-4 w-4 shrink-0 text-gray-500 transition-transform duration-200 ${
						isOpen ? "rotate-180" : ""
					}`}
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					aria-hidden="true"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="m6 9 6 6 6-6"
					/>
				</svg>
			</button>

			{isOpen && (
				<div
					role="listbox"
					aria-label={label}
					className="absolute right-0 top-full z-30 mt-2 min-w-full overflow-hidden rounded-lg border border-gray-200 bg-white p-1.5 shadow-lg"
				>
					{options.map((option) => (
						<button
							key={option.value}
							type="button"
							role="option"
							aria-selected={value === option.value}
							onClick={() => {
								onChange(option.value);
								setIsOpen(false);
							}}
							className={`flex w-full items-center rounded-md px-3 py-2.5 text-left transition-colors ${
								value === option.value ? "bg-green-50" : "hover:bg-gray-50"
							}`}
						>
							<span className="whitespace-nowrap text-xs font-medium text-[#303a36]">
								{option.label}
							</span>
						</button>
					))}
				</div>
			)}
		</div>
	);
}

export function toOptions(values: string[]) {
	return ["All", ...values].map((value) => ({ value, label: value }));
}
