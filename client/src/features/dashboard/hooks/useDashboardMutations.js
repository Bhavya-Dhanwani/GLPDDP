import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
    createMatch,
    createPlayer,
    createSeries,
    createTeam,
    deleteMatch,
    deletePlayer,
    deleteSeries,
    deleteTeam,
    makeUserAdmin,
    publishMatch,
    updateMatch,
    updatePlayer,
    updateSeries,
    updateTeam,
} from "../api/dashboard.api";

const messageFromError = (error, fallback) =>
    error.response?.data?.message || fallback;

const invalidateCricket = (queryClient) => {
    queryClient.invalidateQueries({ queryKey: ["series"] });
    queryClient.invalidateQueries({ queryKey: ["matches"] });
    queryClient.invalidateQueries({ queryKey: ["players"] });
    queryClient.invalidateQueries({ queryKey: ["teams"] });
    queryClient.invalidateQueries({ queryKey: ["users"] });
};

const useDashboardMutation = (mutationFn, messages) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn,
        onSuccess: () => {
            invalidateCricket(queryClient);
            toast.success(messages.success);
        },
        onError: (error) => {
            toast.error(messageFromError(error, messages.error));
        },
    });
};

export const useCreateSeries = () =>
    useDashboardMutation(createSeries, {
        success: "Series created",
        error: "Unable to create series",
    });

export const useUpdateSeries = () =>
    useDashboardMutation(updateSeries, {
        success: "Series updated",
        error: "Unable to update series",
    });

export const useDeleteSeries = () =>
    useDashboardMutation(deleteSeries, {
        success: "Series deleted",
        error: "Unable to delete series",
    });

export const useCreatePlayer = () =>
    useDashboardMutation(createPlayer, {
        success: "Player created",
        error: "Unable to create player",
    });

export const useUpdatePlayer = () =>
    useDashboardMutation(updatePlayer, {
        success: "Player updated",
        error: "Unable to update player",
    });

export const useDeletePlayer = () =>
    useDashboardMutation(deletePlayer, {
        success: "Player deleted",
        error: "Unable to delete player",
    });

export const useCreateTeam = () =>
    useDashboardMutation(createTeam, {
        success: "Team created",
        error: "Unable to create team",
    });

export const useUpdateTeam = () =>
    useDashboardMutation(updateTeam, {
        success: "Team updated",
        error: "Unable to update team",
    });

export const useDeleteTeam = () =>
    useDashboardMutation(deleteTeam, {
        success: "Team deleted",
        error: "Unable to delete team",
    });

export const useCreateMatch = () =>
    useDashboardMutation(createMatch, {
        success: "Match created",
        error: "Unable to create match",
    });

export const useUpdateMatch = () =>
    useDashboardMutation(updateMatch, {
        success: "Match updated",
        error: "Unable to update match",
    });

export const useDeleteMatch = () =>
    useDashboardMutation(deleteMatch, {
        success: "Match deleted",
        error: "Unable to delete match",
    });

export const usePublishMatch = () =>
    useDashboardMutation(publishMatch, {
        success: "Match published",
        error: "Unable to publish match",
    });

export const useMakeUserAdmin = () =>
    useDashboardMutation(makeUserAdmin, {
        success: "User made admin",
        error: "Unable to make user admin",
    });
