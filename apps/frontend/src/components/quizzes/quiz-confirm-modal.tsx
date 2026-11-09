"use client";

import Image from "next/image";

import { createPortal } from "react-dom";

interface QuizConfirmModalProps {
	isOpen: boolean;
	message: string;
	confirmLabel?: string;
	variant?: "primary" | "danger";
	onClose: () => void;
	onConfirm: () => void;
}

export default function QuizConfirmModal({
	isOpen,
	message,
	confirmLabel = "Confirm",
	variant = "primary",
	onClose,
	onConfirm,
}: QuizConfirmModalProps) {
	if (!isOpen || typeof document === "undefined") return null;

	return createPortal(
		<div
			className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4"
			onClick={onClose}
		>
			<div
				role="dialog"
				aria-modal="true"
				aria-labelledby="quiz-confirm-title"
				onClick={(event) => event.stopPropagation()}
				className="relative w-full max-w-[650px] rounded-[30px] bg-white px-6 py-6"
			>

				<button
					type="button"
					onClick={onClose}
					aria-label="Close"
					className="absolute left-6 top-6 hover:opacity-60"
				>
					<Image
						src="/assets/icons/exit.svg"
						alt=""
						width={16}
						height={16}
						className="object-contain"
					/>
				</button>

				<p
					id="quiz-confirm-title"
					className="mt-14 text-center text-sm font-semibold"
				>
					{message}
				</p>

				<div className="mt-9 flex justify-end">
					<button
						type="button"
						onClick={onConfirm}
						className={`w-[155px] rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-colors ${
							variant === "danger"
								? "bg-[#FF7075] hover:bg-red-500"
								: "bg-[#00A651] hover:bg-[#008f45]"
						}`}
					>
						{confirmLabel}
					</button>
				</div>
			</div>
		</div>,
		document.body
	);
}
