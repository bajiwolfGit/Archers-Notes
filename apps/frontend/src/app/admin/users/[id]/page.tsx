import AdminLayout from "@/components/admin/admin-layout";
import AdminUserProfile from "@/components/admin/admin-user-profile";

interface AdminUserPageProps {
    params: Promise<{ id: string }>;
}

export default async function AdminUserPage({
    params,
}: AdminUserPageProps) {
    const { id } = await params;

    return (
        <AdminLayout>
            <AdminUserProfile userId={Number(id)} />
        </AdminLayout>
    );
}
