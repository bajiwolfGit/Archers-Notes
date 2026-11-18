"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

interface AdminModalProps {
	title: string;
	subtitle?: string;
	icon?: ReactNode;
	onClose: () => void;
	footer?: ReactNode;
	success?: { title: string; message: string } | null;
	maxWidth?: string;
	children: ReactNode;
}

export default function AdminModal({
	title,
	subtitle,
	icon,
	onClose,
	footer,
	success,
	maxWidth = "max-w-[560px]",
	children,
}: AdminModalProps) {
	const [mounted, setMounted] = useState(false);
	const titleId = useId();

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		function handleEscape(event: KeyboardEvent) {
			if (event.key === "Escape") onClose();
		}

		document.addEventListener("keydown", handleEscape);

		return () => document.removeEventListener("keydown", handleEscape);
	}, [onClose]);

	if (!mounted) return null;

	return createPortal(
		<div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-black/50 px-4 py-6">
			<div
				role="dialog"
				aria-modal="true"
				aria-labelledby={titleId}
				className={`my-auto w-full ${maxWidth} rounded-[28px] bg-white px-7 py-7 shadow-xl`}
			>
				{success ? (

					<div className="space-y-5 py-3 text-center">
						<div className="flex justify-center">
							<Image
								src="/assets/icons/check.svg"
								alt=""
								width={48}
								height={48}
								className="h-12 w-12 object-contain"
							/>
						</div>

						<h2 id={titleId} className="text-lg font-semibold text-[#303a36]">
							{success.title}
						</h2>

						<p className="text-sm text-gray-500">{success.message}</p>

						<button
							type="button"
							onClick={onClose}
							className="w-full rounded-md bg-[#00A651] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#008F45]"
						>
							Done
						</button>
					</div>
				) : (
					<div className="space-y-5">

						<div className="flex items-start gap-3">
							{icon ?? (
								<button
									type="button"
									onClick={onClose}
									aria-label="Close"
									className="mt-0.5 shrink-0 hover:opacity-60"
								>
									<Image
										src="/assets/icons/exit.svg"
										alt=""
										width={16}
										height={16}
										className="object-contain"
									/>
								</button>
							)}

							<div className="min-w-0">
								<h2
									id={titleId}
									className="text-base font-semibold text-[#303a36]"
								>
									{title}
								</h2>

								{subtitle && (
									<p className="mt-0.5 text-xs text-gray-500">{subtitle}</p>
								)}
							</div>
						</div>

						{children}

						{footer && (
							<div className="flex justify-end gap-3 pt-2">{footer}</div>
						)}
					</div>
				)}
			</div>
		</div>,
		document.body
	);
}

export const cancelButtonClass =
	"rounded-full border border-gray-300 px-5 py-2 text-xs font-semibold text-[#303a36] transition-colors hover:bg-gray-50";

export const primaryButtonClass =
	"rounded-full bg-[#00A651] px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#008F45] disabled:cursor-not-allowed disabled:opacity-50";

export const dangerButtonClass =
	"rounded-full bg-red-600 px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50";

export function fieldClass(invalid = false) {
	return `rounded-md border px-3 py-2 ${
		invalid ? "border-red-400" : "border-gray-300 focus-within:border-[#00A651]"
	}`;
}
