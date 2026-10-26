import { ArcherLogo } from "@/components/archers-notes-logo";
import { GoogleButton } from "@/components/google-button";
import { LandingPageDesign } from "@/components/landing-page-design";

export default function Home() {
	return (
		<main className="relative h-dvh w-full overflow-hidden bg-white">

			{/* Decorative background */}
			<LandingPageDesign />

			{/* Left-side content */}
			<section className="absolute inset-0 z-10 flex items-center">
				<div
					className="
						ml-[4%]
						flex w-[26%]
						max-w-[368px]
						min-w-[280px]
						flex-col
						items-center
					"
				>

					{/* Archer's Notes logo */}
					<div className="mb-[48px] w-full">
						<ArcherLogo />
					</div>

					{/* Google sign-in button */}
					<div className="w-full">
						<GoogleButton />
					</div>

					{/* Terms and conditions */}
					<p
						className="
						mt-[12px]
						w-full
						text-center
						text-[14px]
						font-bold
						leading-[28px]
						tracking-[0px]
						"
						style={{
							fontFamily:
								'"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
						}}
					>
						<span className="text-[#A3A3A3]">
							By continuing, you agree to our{" "}
						</span>
						<span className="text-[#343B37]">
							Terms of Service, Privacy Policy and Cookie Use.
						</span>
					</p>
				</div>
			</section>
		</main>
	);
}
