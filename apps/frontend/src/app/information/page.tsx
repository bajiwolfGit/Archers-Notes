
import { Suspense } from "react";

import MainLayout from "@/components/layout/main-layout";
import AdminLayout from "@/components/admin/admin-layout";

import InformationPage from "@/components/information/information-page";

interface PageProps {
    searchParams: Promise<{
        role?: string;
    }>;
}

export default async function Page({
    searchParams,
}: PageProps) {
    const params = await searchParams;

    // Temporary role selection for frontend testing.
    const role: "user" | "admin" =
        params.role === "admin" ? "admin" : "user";

    const content = (
        <Suspense fallback={<p className="p-6">Loading...</p>}>
            <InformationPage role={role} />
        </Suspense>
    );

    if (role === "admin") {
        return <AdminLayout>{content}</AdminLayout>;
    }

    return <MainLayout>{content}</MainLayout>;
}
