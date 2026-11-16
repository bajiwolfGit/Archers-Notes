
/**
 * File: components/layout/sidebar-footer.tsx
 *
 * Description:
 * Displays the Archer's Notes footer at the bottom
 * of the user sidebar.
 *
 * Features:
 * - Displays application branding.
 * - Provides Product, Support, and Legal links.
 * - Displays copyright information and tagline.
 */

import Image from "next/image";
import Link from "next/link";

export default function SidebarFooter() {
    return (
        <footer className="mt-8 border-t border-gray-200 pt-5 text-[#303a36]">
            {/* Application Branding */}
            <div className="mb-5 flex items-center gap-2">
                <Image
                    src="/assets/logo.svg"
                    alt="Archer's Notes"
                    width={28}
                    height={28}
                    className="object-contain"
                />

                <h2 className="text-sm font-semibold">
                    Archer&apos;s Notes
                </h2>
            </div>

            {/* Footer Links */}
            <div className="grid grid-cols-2 gap-x-3 gap-y-5">
                {/* Product */}
                <div className="space-y-2">
                    <h3 className="text-[10px] font-semibold text-green-700">
                        PRODUCT
                    </h3>

                    <Link
                        href="/about"
                        className="block text-[11px] hover:text-[#00A651]"
                    >
                        About
                    </Link>

                    <Link
                        href="/community-guidelines"
                        className="block text-[11px] leading-relaxed hover:text-[#00A651]"
                    >
                        Community Guidelines
                    </Link>
                </div>

                {/* Support */}
                <div className="space-y-2">
                    <h3 className="text-[10px] font-semibold text-green-700">
                        SUPPORT
                    </h3>

                    <Link
                        href="/help"
                        className="block text-[11px] hover:text-[#00A651]"
                    >
                        Help Center
                    </Link>

                    <Link
                        href="/contact"
                        className="block text-[11px] hover:text-[#00A651]"
                    >
                        Contact Us
                    </Link>

                    <Link
                        href="/report"
                        className="block text-[11px] hover:text-[#00A651]"
                    >
                        Report
                    </Link>
                </div>

                {/* Legal */}
                <div className="col-span-2 space-y-2">
                    <h3 className="text-[10px] font-semibold text-green-700">
                        LEGAL
                    </h3>

                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                        <Link
                            href="/privacy"
                            className="text-[11px] hover:text-[#00A651]"
                        >
                            Privacy Policy
                        </Link>

                        <Link
                            href="/terms"
                            className="text-[11px] hover:text-[#00A651]"
                        >
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="mt-5 border-t border-gray-200 pt-4">
                <p className="text-[10px] text-gray-500">
                    © {new Date().getFullYear()} Archer&apos;s Notes
                </p>

                <p className="mt-1 text-[10px] leading-relaxed text-gray-400">
                    Notes by students, for students.
                </p>
            </div>
        </footer>
    );
}
