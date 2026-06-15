import axiosInstance from "@/lib/axios";

const unwrap = (response) => response.data?.data ?? response.data;

export const getSeries = async (params = {}) => {
    const response = await axiosInstance.get("/series", { params });
    return unwrap(response);
};

export const getSeriesById = async (id) => {
    const response = await axiosInstance.get(`/series/${id}`);
    return unwrap(response);
};

export const getMatches = async (params = {}) => {
    const response = await axiosInstance.get("/matches", { params });
    return unwrap(response);
};

export const getMatchById = async (id) => {
    const response = await axiosInstance.get(`/matches/${id}`);
    return unwrap(response);
};

export const getMatchesBySeriesId = async (seriesId) => {
    const response = await axiosInstance.get(`/matches/series/${seriesId}`);
    return unwrap(response);
};

export const getPlayers = async (params = {}) => {
    const response = await axiosInstance.get("/players", { params });
    return unwrap(response);
};

export const getPlayerById = async (id) => {
    const response = await axiosInstance.get(`/players/${id}`);
    return unwrap(response);
};

export const getTeams = async (params = {}) => {
    const response = await axiosInstance.get("/teams", { params });
    return unwrap(response);
};
