import Link from "next/link";

export default function QuizNotFound() {
	return (
		<div className="mx-auto w-full max-w-[480px] px-6 py-20 text-center">
			<h1 className="text-lg font-semibold text-[#343B36]">
				Quiz not found
			</h1>

			<p className="mt-2 text-sm text-gray-500">
				This quiz may have been deleted or does not exist.
			</p>

			<Link
				href="/main/quizbits"
				className="mt-6 inline-block rounded-full border border-[#00A651] px-6 py-2 text-sm text-[#00A651] hover:bg-green-50"
			>
				Back to Quizbits
			</Link>
		</div>
	);
}
