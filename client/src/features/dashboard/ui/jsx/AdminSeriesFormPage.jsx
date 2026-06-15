"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import DashboardShell from "./DashboardShell";
import SeriesForm from "./SeriesForm";
import { useSeries } from "@/features/cricket/hooks/useCricketQueries";
import { useCreateSeries, useUpdateSeries } from "../../hooks/useDashboardMutations";
import styles from "../css/Dashboard.module.css";

const AdminSeriesFormPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get("edit");
    const { data = [], isLoading } = useSeries();
    const createMutation = useCreateSeries();
    const updateMutation = useUpdateSeries();
    const editing = editId ? data.find((item) => (item.id || item._id) === editId) : null;

    const submit = (payload) => {
        const options = { onSuccess: () => router.push("/dashboard/series") };

        if (editId) {
            updateMutation.mutate({ id: editId, payload }, options);
            return;
        }

        createMutation.mutate(payload, options);
    };

    return (
        <DashboardShell>
            <div className={styles.pageHead}>
                <div>
                    <h1>{editId ? "Update Series" : "Add Series"}</h1>
                    <p className={styles.muted}>Create or edit cricket series details.</p>
                </div>
                <Link className={styles.button} href="/dashboard/series">
                    View Series
                </Link>
            </div>
            {editId && isLoading && <div className={styles.empty}>Loading series...</div>}
            {editId && !isLoading && !editing && <div className={styles.empty}>Series not found.</div>}
            {(!editId || editing) && (
                <SeriesForm
                    key={editId || "new-series"}
                    initialValues={editing}
                    onSubmit={submit}
                    isSubmitting={createMutation.isPending || updateMutation.isPending}
                />
            )}
        </DashboardShell>
    );
};

export default AdminSeriesFormPage;
