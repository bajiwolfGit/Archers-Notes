
"use client";

import { useRouter, useSearchParams } from "next/navigation";

import InformationSidebar, {
    adminSections,
    userSections,
    type InformationRole,
} from "./information-sidebar";

import InformationContent from "./information-content";

interface InformationPageProps {
    role: InformationRole;
}

export default function InformationPage({
    role,
}: InformationPageProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const sections = role === "admin" ? adminSections : userSections;

    const requestedSection = searchParams.get("section");

    const activeSection = sections.some(
        (section) => section.id === requestedSection
    )
        ? requestedSection!
        : sections[0].id;

    function handleSelect(section: string) {
        const params = new URLSearchParams();

        if (role === "admin") {
            params.set("role", "admin");
        }

        params.set("section", section);

        router.push(`/information?${params.toString()}`);
    }

    return (
        <div className="min-w-0 w-full px-6 py-6">
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-[#303a36]">
                    Information & Support
                </h1>

                <p className="mt-2 text-sm text-gray-500">
                    Everything you need to know about Archer's Notes.
                </p>
            </div>

            {/* Page Layout */}
            <div className="flex min-w-0 flex-col items-start gap-5 xl:flex-row">
                <InformationSidebar
                    role={role}
                    activeSection={activeSection}
                />
                <InformationContent section={activeSection} />
            </div>
        </div>
    );
}
