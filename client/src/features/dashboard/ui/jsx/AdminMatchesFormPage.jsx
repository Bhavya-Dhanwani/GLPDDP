"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import DashboardShell from "./DashboardShell";
import MatchForm from "./MatchForm";
import { useMatches, useSeries, useTeams } from "@/features/cricket/hooks/useCricketQueries";
import { useCreateMatch, useUpdateMatch } from "../../hooks/useDashboardMutations";
import styles from "../css/Dashboard.module.css";

const AdminMatchesFormPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get("edit");
    const matchesQuery = useMatches();
    const seriesQuery = useSeries();
    const teamsQuery = useTeams();
    const createMutation = useCreateMatch();
    const updateMutation = useUpdateMatch();
    const editing = editId
        ? (matchesQuery.data || []).find((item) => (item.id || item._id) === editId)
        : null;

    const submit = (payload) => {
        const options = { onSuccess: () => router.push("/dashboard/matches") };

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
                    <h1>{editId ? "Update Match" : "Add Match"}</h1>
                    <p className={styles.muted}>Create fixtures and schedule match details.</p>
                </div>
                <Link className={styles.button} href="/dashboard/matches">
                    View Matches
                </Link>
            </div>
            {editId && matchesQuery.isLoading && <div className={styles.empty}>Loading match...</div>}
            {editId && !matchesQuery.isLoading && !editing && <div className={styles.empty}>Match not found.</div>}
            {(!editId || editing) && (
                <MatchForm
                    key={editId || "new-match"}
                    initialValues={editing}
                    series={seriesQuery.data || []}
                    teams={teamsQuery.data || []}
                    onSubmit={submit}
                    isSubmitting={createMutation.isPending || updateMutation.isPending}
                />
            )}
        </DashboardShell>
    );
};

export default AdminMatchesFormPage;
