/**
 * File: components/layout/navbar.tsx
 *
 * Description:
 * Provides the main navigation bar for the Archer's Notes application.
 * Displays the application logo, search bar, notifications button,
 * and user profile navigation.
 *
 * Features:
 * - Displays the Archer's Notes logo with navigation to the main page.
 * - Provides a search input for entering search queries.
 * - Displays a notifications button.
 * - Allows users to navigate to their profile page.
 * - Uses a horizontally centered search bar.
 * - Maintains consistent navigation styling across application pages.
 */

// Next.js component for optimized image rendering.
import Image from "next/image";

// Next.js component for client-side navigation between pages.
import Link from "next/link";

/**
 * Navbar Component
 *
 * Displays the application's primary navigation bar.
 *
 * Organizes the navigation elements into three sections:
 * - Left: Application logo linking to the main page.
 * - Center: Search bar for entering search queries.
 * - Right: Notifications button and user profile link.
 *
 * The navigation bar uses relative positioning to allow
 * the search bar to remain horizontally centered.
 *
 * @returns The application's main navigation bar.
 */
export default function Navbar() {
    return (

        /*
         * Navigation Bar Container:
         * Displays the main navigation elements horizontally.
         *
         * Uses a fixed height of 73px and a bottom border
         * to separate the navigation bar from page content.
         *
         * Relative positioning provides the reference
         * for the absolutely positioned search bar.
         */
        <header className="relative flex h-[73px] items-center justify-between border-b border-gray-200 px-6">

            {/*
             * Application Logo:
             * Displays the Archer's Notes logo.
             *
             * Clicking the logo navigates the user
             * to the application's main page.
             */}
            <Link
                href="/main"
                aria-label="View my profile"
            >
                {/* Application logo image. */}
                <Image
                    src="/assets/logo.svg"
                    alt="Archers Notes"
                    width={48}
                    height={48}
                    className="shrink-0"
                />
            </Link>

            {/*
             * Search Bar:
             * Provides an input field for entering search queries.
             *
             * Uses absolute positioning to center the search bar
             * horizontally within the navigation bar.
             *
             * The search bar has a width of 480px, with a
             * responsive maximum width based on available space.
             */}
            <div className="absolute left-1/2 flex w-[480px] max-w-[calc(100%-320px)] -translate-x-1/2 items-center gap-3 rounded-[10px] border border-[#E5E7EB] bg-white px-6 py-2">
                
                {/*
                 * Search Icon:
                 * Displays a visual indicator for the search field.
                 */}
                <Image
                    src="/assets/icons/search.svg"
                    alt=""
                    width={20}
                    height={20}
                    className="shrink-0"
                />

                {/*
                 * Search Input:
                 * Allows users to enter text for searching.
                 *
                 * Uses the HTML search input type.
                 * Browser autocomplete is disabled to prevent
                 * unwanted autofill suggestions.
                 *
                 * The input currently provides the search interface
                 * but does not implement search functionality.
                 */}
                <input
                    id="site-search"
                    name="site-search"
                    type="search"
                    autoComplete="off"
                    placeholder="Search"
                    aria-label="Search"
                    className="w-full bg-transparent text-sm font-semibold text-[#00A651] placeholder:text-[#00A651] outline-none"
                />
            </div>

            {/*
             * Right Navigation Section:
             * Contains the notifications button and
             * the current user's profile navigation.
             *
             * Uses ml-auto to position the elements
             * on the right side of the navigation bar.
             */}
            <div className="ml-auto flex shrink-0 items-center gap-6">

                {/*
                 * Notifications Button:
                 * Displays the notifications icon.
                 *
                 * Currently serves as a visual interface element.
                 * Notification handling functionality has not
                 * yet been implemented.
                 */}
                <button
                    type="button"
                    aria-label="Notifications"
                    className="flex h-9 w-9 items-center justify-center"
                >
                    {/* Notifications icon. */}
                    <Image
                        src="/assets/icons/notification.svg"
                        alt=""
                        width={20}
                        height={20}
                        className="h-5 w-5 object-contain"
                    />
                </button>

                {/*
                 * Profile Navigation:
                 * Displays the current user's profile icon.
                 *
                 * Clicking the icon navigates to the
                 * user's personal profile page.
                 *
                 * Includes a hover effect to provide
                 * visual feedback during interaction.
                 */}
                <Link
                    href="/profile"
                    aria-label="View my profile"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-opacity hover:opacity-75"
                >
                    {/* Default user profile icon. */}
                    <Image
                        src="/assets/icons/profile.svg"
                        alt="Profile"
                        width={36}
                        height={36}
                        className="h-9 w-9 object-contain"
                    />
                </Link>
            </div>
        </header>
    );
}