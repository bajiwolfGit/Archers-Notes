
/**
 * File: components/admin/admin-sidebar-footer.tsx
 *
 * Description:
 * Displays the administrator footer in the
 * Archer's Notes admin sidebar.
 *
 * Features:
 * - Displays application branding.
 * - Shows administrator status.
 * - Provides Resources, Support, and Legal links.
 * - Displays system status information.
 */

import Image from "next/image";
import Link from "next/link";

export default function AdminSidebarFooter() {
    return (
        <footer className="mt-8 border-t border-gray-200 pt-5 text-[#303a36]">
            {/* Application Branding */}
            <div className="mb-2 flex items-center gap-2">
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

            {/* Admin Information */}
            <p className="text-[10px] text-gray-500">
                © {new Date().getFullYear()} · Signed in as Admin
            </p>

            {/* System Status */}
            <div className="mt-2">
                <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-[10px] font-medium text-green-700">
                    All systems operational
                </span>
            </div>

            {/* Footer Links */}
            <div className="mt-5 grid grid-cols-2 gap-x-3 gap-y-5">
                {/* Resources */}
                <div className="space-y-2">
                    <h3 className="text-[10px] font-semibold text-green-700">
                        RESOURCES
                    </h3>

                    <Link
                        href="/admin/guide"
                        className="block text-[11px] hover:text-[#00A651]"
                    >
                        Admin Guide
                    </Link>

                    <Link
                        href="/admin/moderation-policy"
                        className="block text-[11px] leading-relaxed hover:text-[#00A651]"
                    >
                        Moderation Policy
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
        </footer>
    );
}
