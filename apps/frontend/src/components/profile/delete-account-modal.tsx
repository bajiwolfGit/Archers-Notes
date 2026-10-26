"use client";

import { useState } from "react";
import Image from "next/image";

interface DeleteAccountModalProps {
  onClose: () => void;
  onConfirm: (password: string) => void;
}

export default function DeleteAccountModal({
  onClose,
  onConfirm,
}: DeleteAccountModalProps) {
  const [step, setStep] = useState<"confirm" | "password">("confirm");
  const [password, setPassword] = useState("");

	return (
		<div
			className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4"
			onMouseDown={(e) => {
				if (e.target === e.currentTarget) {
				onClose();
				}
			}}
		>
			<div
				role="alertdialog"
				aria-modal="true"
				aria-labelledby="delete-account-title"
				className="relative flex min-h-[175px] w-full max-w-[525px] flex-col rounded-[30px] bg-white p-6 shadow-xl"
			>
				{/* Close Button */}
				<button
					type="button"
					onClick={onClose}
					aria-label="Close"
					className="absolute left-5 top-5 flex h-8 w-8 items-center justify-center text-2xl text-[#343B36] hover:text-black"
				>
				<Image
					src="/assets/icons/exit.svg"
					alt=""
					width={16}
					height={16}
					className="object-contain"
				/>
				</button>

				{step === "confirm" ? (
					<>
						{/* First Confirmation */}
						<div className="flex flex-1 items-center justify-center px-8 pt-5">
							<h2
								id="delete-account-title"
								className="text-center text-xs font-semibold text-[#343B36]"
							>
								Are you sure you want to delete your account?
							</h2>
						</div>

						<div className="flex justify-end">
							<button
								type="button"
								onClick={() => setStep("password")}
								className="min-w-[125px] rounded-full border border-[#343B36] px-6 py-2 text-xs font-medium text-[#343B36] transition hover:bg-gray-100"
							>
								Yes
							</button>
						</div>
					</>
				) : (
					<>
						{/* Password Confirmation */}
						<form
							id="delete-account-form"
							autoComplete="off"
							onSubmit={(e) => {
								e.preventDefault();

								if (password.trim()) {
								onConfirm(password);
								}
							}}
							className="mx-auto mt-9 w-full max-w-[380px]"
						>
							<label
								htmlFor="delete-password"
								className="mb-1 block text-[10px] text-gray-400"
							>
								Enter password to confirm
							</label>

							<input
								id="delete-password"
								name="account-deletion-password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								autoComplete="current-password"
								autoFocus
								className="h-[45px] w-full rounded-md border border-gray-200 px-3 text-sm outline-none focus:border-[#00A651]"
							/>
						</form>

						<div className="mt-4 flex justify-end">
							<button
								type="button"
								disabled={!password.trim()}
								onClick={() => onConfirm(password)}
								className="min-w-[125px] rounded-full bg-[#FA7075] px-6 py-2 text-xs font-semibold text-white transition hover:bg-[#E95C62] disabled:cursor-not-allowed disabled:opacity-50"
							>
								Delete
							</button>
						</div>
					</>
				)}
			</div>
		</div>
	);
}