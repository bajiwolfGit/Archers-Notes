import Image from "next/image";

export default function Navbar() {
    return (
        <header className="h-[73px] flex items-center justify-between px-6 border-b border-gray-200">

            {/* Logo */}
            <Image
                src="/assets/logo.svg"
                alt="Archers Notes"
                width={48}
                height={48}
            />

            {/* Search Bar */}
            <div className="flex w-[480px] items-center gap-3 rounded-[10px] border border-[#E5E7EB] bg-white px-6 py-2">
            <Image
                src="/assets/icons/search.svg"
                alt=""
                width={20}
                height={20}
            />

            <input
                type="text"
                placeholder="Search"
                className="w-full bg-transparent text-sm font-semibold text-[#00A651] placeholder:text-[#00A651] outline-none"
            />
            </div>

            {/* Notifications */}
            <div className="flex items-center gap-6">
                <Image
                src="/assets/icons/notification.svg"
                alt="Notifications"
                width={20}
                height={20}
                />
            </div>

        </header>
    );
}
