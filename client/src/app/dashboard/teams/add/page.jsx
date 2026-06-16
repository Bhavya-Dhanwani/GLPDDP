import { Suspense } from "react";
import AdminTeamsFormPage from "@/features/dashboard/ui/jsx/AdminTeamsFormPage";

export default function Page() {
    return (
        <Suspense fallback={null}>
            <AdminTeamsFormPage />
        </Suspense>
    );
}
