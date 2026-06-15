import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
    createMatch,
    createPlayer,
    createSeries,
    deleteMatch,
    deletePlayer,
    deleteSeries,
    publishMatch,
    updateMatch,
    updatePlayer,
    updateSeries,
} from "../api/dashboard.api";

const messageFromError = (error, fallback) =>
    error.response?.data?.message || fallback;

const invalidateCricket = (queryClient) => {
    queryClient.invalidateQueries({ queryKey: ["series"] });
    queryClient.invalidateQueries({ queryKey: ["matches"] });
    queryClient.invalidateQueries({ queryKey: ["players"] });
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
