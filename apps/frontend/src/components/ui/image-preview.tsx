"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

interface ImagePreviewProps {
	images: string[];
	initialIndex: number;
	alt: string;
	onClose: () => void;
}

export default function ImagePreview({
	images,
	initialIndex,
	alt,
 	onClose,
}: ImagePreviewProps) {
	const [isVisible, setIsVisible] = useState(false);
	const [currentIndex, setCurrentIndex] = useState(initialIndex);
	const isClosing = useRef(false);

	// Smooth opening animation
	useEffect(() => {
		const timer = requestAnimationFrame(() => {
			setIsVisible(true);
		});

		return () => cancelAnimationFrame(timer);
	}, []);

	// Smooth closing animation
	const handleClose = () => {
		if (isClosing.current) return;

		isClosing.current = true;
		setIsVisible(false);

		setTimeout(() => {
			onClose();
		}, 300);
	};

	// Previous image
	const previousImage = () => {
		setCurrentIndex((prev) =>
			prev === 0 ? images.length - 1 : prev - 1
		);
	};

	// Next image
	const nextImage = () => {
		setCurrentIndex((prev) =>
			prev === images.length - 1 ? 0 : prev + 1
		);
	};

	// Keyboard navigation
	useEffect(() => {
		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === "Escape") {
				handleClose();
			}

			if (images.length > 1) {
				if (event.key === "ArrowLeft") {
				previousImage();
				}

				if (event.key === "ArrowRight") {
				nextImage();
				}
			}
		}

		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	});

 	if (images.length === 0) return null;

	return createPortal(
		<div
			onClick={handleClose}
			className={`
				fixed inset-0 z-[9999] flex items-center justify-center
				bg-black/80 p-6 transition-opacity duration-300
				${isVisible ? "opacity-100" : "opacity-0"}
			`}
		>
			{/* Close Button */}
			<button
				type="button"
				onClick={(e) => {
					e.stopPropagation();
					handleClose();
				}}
				aria-label="Close image preview"
				className="absolute right-6 top-6 z-20 text-3xl text-white"
			>
				x
			</button>

			{/* Previous Image Button */}
			{images.length > 1 && (
				<button
					type="button"
					onClick={(e) => {
						e.stopPropagation();
						previousImage();
					}}
					aria-label="Previous image"
					className="
						absolute left-4 top-1/2 z-20
						flex h-10 w-10 -translate-y-1/2
						items-center justify-center
						rounded-full bg-black/20 text-white
						opacity-60 backdrop-blur-sm
						transition-all duration-200
						hover:bg-black/50 hover:opacity-100
						md:left-[calc(50%-340px)]
					"
				>
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="m15 18-6-6 6-6" />
					</svg>
				</button>
			)}

			{/* Image */}
			<div
				role="dialog"
				aria-modal="true"
				aria-label="Image preview"
				className={`
					relative h-[80vh] w-[75vw] max-w-[900px]
					transition-all duration-300 ease-out
					${
					isVisible
						? "scale-100 opacity-100"
						: "scale-95 opacity-0"
					}
				`}
			>
				<Image
					src={images[currentIndex]}
					alt={`${alt} - Image ${currentIndex + 1}`}
					fill
					sizes="(max-width: 768px) 90vw, 900px"
					onClick={(e) => e.stopPropagation()}
					className="object-contain"
				/>
			</div>

			{/* Next Image Button */}
			{images.length > 1 && (
				<button
					type="button"
					onClick={(e) => {
						e.stopPropagation();
						nextImage();
					}}
					aria-label="Next image"
					className="
						absolute right-4 top-1/2 z-20
						flex h-10 w-10 -translate-y-1/2
						items-center justify-center
						rounded-full bg-black/20 text-white
						opacity-60 backdrop-blur-sm
						transition-all duration-200
						hover:bg-black/50 hover:opacity-100
						md:right-[calc(50%-340px)]
					"
				>
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="m9 18 6-6-6-6" />
					</svg>
				</button>
			)}

			{/* Image Counter */}
			{images.length > 1 && (
				<div
				onClick={(e) => e.stopPropagation()}
				className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-4 py-2 text-sm text-white"
				>
				{currentIndex + 1} / {images.length}
				</div>
			)}
		</div>,
		document.body
	);
}