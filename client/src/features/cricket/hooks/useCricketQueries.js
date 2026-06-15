import { useQuery } from "@tanstack/react-query";
import {
    getMatchById,
    getMatches,
    getMatchesBySeriesId,
    getPlayerById,
    getPlayers,
    getSeries,
    getSeriesById,
    getTeams,
} from "../api/cricket.api";

export const cricketKeys = {
    series: (params = {}) => ["series", params],
    seriesDetail: (id) => ["series", id],
    matches: (params = {}) => ["matches", params],
    matchDetail: (id) => ["matches", id],
    seriesMatches: (id) => ["series", id, "matches"],
    players: (params = {}) => ["players", params],
    playerDetail: (id) => ["players", id],
    teams: (params = {}) => ["teams", params],
};

export const useSeries = (params = {}) =>
    useQuery({
        queryKey: cricketKeys.series(params),
        queryFn: () => getSeries(params),
    });

export const useSeriesDetail = (id) =>
    useQuery({
        queryKey: cricketKeys.seriesDetail(id),
        queryFn: () => getSeriesById(id),
        enabled: Boolean(id),
    });

export const useMatches = (params = {}) =>
    useQuery({
        queryKey: cricketKeys.matches(params),
        queryFn: () => getMatches(params),
    });

export const useMatchDetail = (id) =>
    useQuery({
        queryKey: cricketKeys.matchDetail(id),
        queryFn: () => getMatchById(id),
        enabled: Boolean(id),
    });

export const useSeriesMatches = (seriesId) =>
    useQuery({
        queryKey: cricketKeys.seriesMatches(seriesId),
        queryFn: () => getMatchesBySeriesId(seriesId),
        enabled: Boolean(seriesId),
    });

export const usePlayers = (params = {}) =>
    useQuery({
        queryKey: cricketKeys.players(params),
        queryFn: () => getPlayers(params),
    });

export const usePlayerDetail = (id) =>
    useQuery({
        queryKey: cricketKeys.playerDetail(id),
        queryFn: () => getPlayerById(id),
        enabled: Boolean(id),
    });

export const useTeams = (params = {}) =>
    useQuery({
        queryKey: cricketKeys.teams(params),
        queryFn: () => getTeams(params),
    });
