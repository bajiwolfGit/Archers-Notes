/**
 * File: app/page.tsx
 *
 * Description:
 * Serves as the landing page of the Archer's Notes application.
 * Displays the application's branding, Google sign-in button,
 * and terms and conditions.
 *
 * Features:
 * - Displays the Archer's Notes logo.
 * - Provides a Google sign-in button.
 * - Displays the application's terms and conditions notice.
 * - Uses a decorative background component.
 * - Organizes the main content on the left side of the page.
 * - Uses viewport-based dimensions for the landing page layout.
 */

// Component responsible for displaying the Archer's Notes logo.
import { ArcherLogo } from "@/components/archers-notes-logo";

// Component responsible for displaying the Google sign-in button.
import { GoogleButton } from "@/components/google-button";

// Component responsible for rendering the decorative landing page background.
import { LandingPageDesign } from "@/components/landing-page-design";

/**
 * Home Component
 *
 * Serves as the application's main landing page.
 *
 * Displays the Archer's Notes branding and provides
 * users with an interface for signing in through Google.
 *
 * The page consists of two main sections:
 * - Decorative background rendered by LandingPageDesign.
 * - Left-aligned content containing the logo, sign-in button,
 *   and terms and conditions notice.
 *
 * Uses absolute positioning to place the content over
 * the decorative background.
 *
 * @returns The Archer's Notes landing page.
 */
export default function Home() {
	return (
		/*
		 * Landing Page Container:
		 * Wraps all elements displayed on the landing page.
		 *
		 * Uses the dynamic viewport height (h-dvh) to occupy
		 * the available viewport height.
		 *
		 * Relative positioning provides a reference for
		 * absolutely positioned child elements.
		 *
		 * Overflow is hidden to prevent decorative elements
		 * from extending beyond the visible page.
		 */
		<main className="relative h-dvh w-full overflow-hidden bg-white">

			{/*
			 * Decorative Background:
			 * Renders the visual design elements used
			 * as the background of the landing page.
			 *
			 * The background design is implemented
			 * separately in LandingPageDesign.
			 */}
			<LandingPageDesign />

			{/*
			 * Landing Page Content:
			 * Contains the application's logo, Google sign-in
			 * button, and terms and conditions notice.
			 *
			 * Uses absolute positioning to cover the
			 * landing page container.
			 *
			 * The z-10 class places this content above
			 * lower-stacking decorative background elements.
			 */}
			<section className="absolute inset-0 z-10 flex items-center">
				
				{/*
				 * Left Content Container:
				 * Organizes the landing page elements vertically.
				 *
				 * Uses a left margin of 4% and a width of 26%
				 * of the available container.
				 *
				 * The maximum width is limited to 368px,
				 * while the minimum width is set to 280px.
				 *
				 * Flexbox is used to arrange and center
				 * the child elements vertically.
				 */}
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

					{/*
					 * Archer's Notes Logo:
					 * Displays the application's primary branding.
					 *
					 * Uses the reusable ArcherLogo component.
					 *
					 * The bottom margin of 48px creates spacing
					 * between the logo and Google sign-in button.
					 */}
					<div className="mb-[48px] w-full">
						<ArcherLogo />
					</div>

					{/*
					 * Google Sign-In Button:
					 * Displays the authentication button
					 * used for signing in through Google.
					 *
					 * The GoogleButton component handles
					 * its own appearance and behavior.
					 */}
					<div className="w-full">
						<GoogleButton />
					</div>

					{/*
					 * Terms and Conditions Notice:
					 * Informs users that continuing indicates
					 * agreement with the application's terms,
					 * privacy policy, and cookie use.
					 *
					 * Uses a custom font stack with SF Pro Display
					 * as the preferred font.
					 *
					 * Different text colors visually distinguish
					 * the introductory statement from the
					 * names of the policies.
					 */}
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
						{/*
						 * Introductory Text:
						 * Displays the statement informing users
						 * that continuing indicates agreement.
						 */}
						<span className="text-[#A3A3A3]">
							By continuing, you agree to our{" "}
						</span>

						{/*
						 * Policy Names:
						 * Displays the terms, privacy policy,
						 * and cookie use information.
						 */}
						<span className="text-[#343B37]">
							Terms of Service, Privacy Policy and Cookie Use.
						</span>
					</p>
				</div>
			</section>
		</main>
	);
}