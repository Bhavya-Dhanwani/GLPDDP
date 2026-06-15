import { Suspense } from "react";
import AdminSeriesFormPage from "@/features/dashboard/ui/jsx/AdminSeriesFormPage";

export default function Page() {
    return (
        <Suspense fallback={null}>
            <AdminSeriesFormPage />
        </Suspense>
    );
}
