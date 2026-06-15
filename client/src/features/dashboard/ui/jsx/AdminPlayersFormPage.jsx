"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import DashboardShell from "./DashboardShell";
import PlayerForm from "./PlayerForm";
import { usePlayers } from "@/features/cricket/hooks/useCricketQueries";
import { useCreatePlayer, useUpdatePlayer } from "../../hooks/useDashboardMutations";
import styles from "../css/Dashboard.module.css";

const AdminPlayersFormPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get("edit");
    const { data = [], isLoading } = usePlayers();
    const createMutation = useCreatePlayer();
    const updateMutation = useUpdatePlayer();
    const editing = editId ? data.find((item) => (item.id || item._id) === editId) : null;

    const submit = (payload) => {
        const options = { onSuccess: () => router.push("/dashboard/players") };

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
                    <h1>{editId ? "Update Player" : "Add Player"}</h1>
                    <p className={styles.muted}>Create or edit player profile details.</p>
                </div>
                <Link className={styles.button} href="/dashboard/players">
                    View Players
                </Link>
            </div>
            {editId && isLoading && <div className={styles.empty}>Loading player...</div>}
            {editId && !isLoading && !editing && <div className={styles.empty}>Player not found.</div>}
            {(!editId || editing) && (
                <PlayerForm
                    key={editId || "new-player"}
                    initialValues={editing}
                    onSubmit={submit}
                    isSubmitting={createMutation.isPending || updateMutation.isPending}
                />
            )}
        </DashboardShell>
    );
};

export default AdminPlayersFormPage;
