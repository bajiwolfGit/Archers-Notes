import AdminLayout from "@/components/admin/admin-layout";
import AdminReportReview from "@/components/admin/admin-report-review";

interface AdminReportPageProps {
    params: Promise<{ id: string }>;
}

export default async function AdminReportPage({
    params,
}: AdminReportPageProps) {
    const { id } = await params;

    return (
        <AdminLayout>
            <AdminReportReview reportId={Number(id)} />
        </AdminLayout>
    );
}
