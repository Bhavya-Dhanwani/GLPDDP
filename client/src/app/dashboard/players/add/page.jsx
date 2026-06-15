import { Suspense } from "react";
import AdminPlayersFormPage from "@/features/dashboard/ui/jsx/AdminPlayersFormPage";

export default function Page() {
    return (
        <Suspense fallback={null}>
            <AdminPlayersFormPage />
        </Suspense>
    );
}
