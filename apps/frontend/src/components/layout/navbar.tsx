import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
    return (
        <header className="relative flex h-[73px] items-center justify-between border-b border-gray-200 px-6">

            {/* Logo */}
            <Link
                href="/main"
                aria-label="View my profile"
            >
                <Image
                    src="/assets/logo.svg"
                    alt="Archers Notes"
                    width={48}
                    height={48}
                    className="shrink-0"
                />
            </Link>

            {/* Search Bar - Centered on the page */}
            <div className="absolute left-1/2 flex w-[480px] max-w-[calc(100%-320px)] -translate-x-1/2 items-center gap-3 rounded-[10px] border border-[#E5E7EB] bg-white px-6 py-2">
                <Image
                    src="/assets/icons/search.svg"
                    alt=""
                    width={20}
                    height={20}
                    className="shrink-0"
                />

                <input
                    type="text"
                    placeholder="Search"
                    aria-label="Search"
                    className="w-full bg-transparent text-sm font-semibold text-[#00A651] placeholder:text-[#00A651] outline-none"
                />
            </div>

            {/* Right Side - Notifications and Profile */}
            <div className="ml-auto flex shrink-0 items-center gap-6">

                {/* Notifications */}
                <button
                    type="button"
                    aria-label="Notifications"
                    className="flex h-9 w-9 items-center justify-center"
                >
                <Image
                    src="/assets/icons/notification.svg"
                    alt=""
                    width={20}
                    height={20}
                    className="h-5 w-5 object-contain"
                />
                </button>

                {/* Profile Icon */}
                <Link
                    href="/profile"
                    aria-label="View my profile"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-opacity hover:opacity-75"
                >
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
