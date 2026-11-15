import AdminLayout from "@/components/admin/admin-layout";
import AdminCoursesDirectory from "@/components/admin/admin-courses-directory";

export default function AdminCoursesPage() {
    return (
        <AdminLayout>
            <AdminCoursesDirectory />
        </AdminLayout>
    );
}