
"use client";

import Link from "next/link";

export type InformationRole = "user" | "admin";

export interface InformationSection {
    id: string;
    label: string;
    group: string;
}

export const userSections: InformationSection[] = [
    { id: "about", label: "About", group: "PRODUCT" },
    { id: "guidelines", label: "Community Guidelines", group: "PRODUCT" },
    { id: "help", label: "Help Center", group: "SUPPORT" },
    { id: "contact", label: "Contact Us", group: "SUPPORT" },
    { id: "report", label: "Report", group: "SUPPORT" },
    { id: "privacy", label: "Privacy Policy", group: "LEGAL" },
    { id: "terms", label: "Terms of Service", group: "LEGAL" },
];

export const adminSections: InformationSection[] = [
    { id: "guide", label: "Admin Guide", group: "RESOURCES" },
    { id: "moderation", label: "Moderation Policy", group: "RESOURCES" },
    { id: "help", label: "Help Center", group: "SUPPORT" },
    { id: "privacy", label: "Privacy Policy", group: "LEGAL" },
    { id: "terms", label: "Terms of Service", group: "LEGAL" },
];

interface InformationSidebarProps {
    role: InformationRole;
    activeSection: string;
}

export default function InformationSidebar({
    role,
    activeSection,
}: InformationSidebarProps) {
    const sections = role === "admin" ? adminSections : userSections;

    const groups = Array.from(
        new Set(sections.map((section) => section.group))
    );

    return (
        <aside className="w-full min-w-0 rounded-lg border border-gray-200 bg-white px-4 py-6 xl:w-[240px] xl:shrink-0">

            {/* Navigation */}
            <nav
                aria-label="Information navigation"
                className="space-y-5 text-sm"
            >
                {groups.map((group, groupIndex) => (
                    <div key={group}>
                        {/* Section Divider */}
                        {groupIndex > 0 && (
                            <hr className="mb-5 border-gray-200" />
                        )}

                        {/* Section Label */}
                        <p className="mb-3 px-4 text-[11px] font-semibold tracking-wider text-gray-400">
                            {group}
                        </p>

                        {/* Section Links */}
                        <div className="space-y-1">
                            {sections
                                .filter(
                                    (section) =>
                                        section.group === group
                                )
                                .map((section) => {
                                    const active =
                                        activeSection === section.id;

                                    return (
                                        <Link
                                            key={section.id}
                                            href={`/information?${role === "admin" ? "role=admin&" : ""}section=${section.id}`}
                                            aria-current={active ? "page" : undefined}
                                            className={`flex w-full items-center rounded-md px-3 py-2.5 text-sm font-semibold whitespace-normal break-words transition-colors ${
                                                active
                                                    ? "bg-[#E8F7EF] text-[#00A651]"
                                                    : "text-[#303a36] hover:bg-gray-100"
                                            }`}
                                        >
                                            {section.label}
                                        </Link>
                                    );
                                })}
                        </div>
                    </div>
                ))}
            </nav>
        </aside>
    );
}
