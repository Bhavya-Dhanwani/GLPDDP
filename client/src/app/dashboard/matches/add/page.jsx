import { Suspense } from "react";
import AdminMatchesFormPage from "@/features/dashboard/ui/jsx/AdminMatchesFormPage";

export default function Page() {
    return (
        <Suspense fallback={null}>
            <AdminMatchesFormPage />
        </Suspense>
    );
}
