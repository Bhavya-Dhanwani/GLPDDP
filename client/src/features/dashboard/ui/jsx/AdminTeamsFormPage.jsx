"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import DashboardShell from "./DashboardShell";
import TeamForm from "./TeamForm";
import { usePlayers, useTeams } from "@/features/cricket/hooks/useCricketQueries";
import { useCreateTeam, useUpdateTeam } from "../../hooks/useDashboardMutations";
import styles from "../css/Dashboard.module.css";

const AdminTeamsFormPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get("edit");
    const { data: teams = [], isLoading: isTeamsLoading } = useTeams();
    const { data: players = [], isLoading: isPlayersLoading } = usePlayers();
    const createMutation = useCreateTeam();
    const updateMutation = useUpdateTeam();
    const editing = editId ? teams.find((item) => (item.id || item._id) === editId) : null;

    const submit = (payload) => {
        const options = { onSuccess: () => router.push("/dashboard/teams") };

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
                    <h1>{editId ? "Update Team" : "Add Team"}</h1>
                    <p className={styles.muted}>Create or edit teams and squad players.</p>
                </div>
                <Link className={styles.button} href="/dashboard/teams">
                    View Teams
                </Link>
            </div>
            {editId && isTeamsLoading && <div className={styles.empty}>Loading team...</div>}
            {editId && !isTeamsLoading && !editing && <div className={styles.empty}>Team not found.</div>}
            {isPlayersLoading && <div className={styles.empty}>Loading players...</div>}
            {(!editId || editing) && !isPlayersLoading && (
                <TeamForm
                    key={editId || "new-team"}
                    initialValues={editing}
                    players={players}
                    onSubmit={submit}
                    isSubmitting={createMutation.isPending || updateMutation.isPending}
                />
            )}
        </DashboardShell>
    );
};

export default AdminTeamsFormPage;
