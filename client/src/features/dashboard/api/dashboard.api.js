import axios from "axios";
import axiosInstance from "@/lib/axios";

const unwrap = (response) => response.data?.data ?? response.data;

export const createSeries = async (payload) => {
    const response = await axiosInstance.post("/series", payload);
    return unwrap(response);
};

export const updateSeries = async ({ id, payload }) => {
    const response = await axiosInstance.patch(`/series/${id}`, payload);
    return unwrap(response);
};

export const deleteSeries = async (id) => {
    const response = await axiosInstance.delete(`/series/${id}`);
    return unwrap(response);
};

export const createPlayer = async (payload) => {
    const response = await axiosInstance.post("/players", payload);
    return unwrap(response);
};

export const updatePlayer = async ({ id, payload }) => {
    const response = await axiosInstance.put(`/players/${id}`, payload);
    return unwrap(response);
};

export const deletePlayer = async (id) => {
    const response = await axiosInstance.delete(`/players/${id}`);
    return unwrap(response);
};

export const createTeam = async (payload) => {
    const response = await axiosInstance.post("/teams", payload);
    return unwrap(response);
};

export const updateTeam = async ({ id, payload }) => {
    const response = await axiosInstance.patch(`/teams/${id}`, payload);
    return unwrap(response);
};

export const deleteTeam = async (id) => {
    const response = await axiosInstance.delete(`/teams/${id}`);
    return unwrap(response);
};

export const createMatch = async (payload) => {
    const response = await axiosInstance.post("/matches", payload);
    return unwrap(response);
};

export const updateMatch = async ({ id, payload }) => {
    const response = await axiosInstance.patch(`/matches/${id}`, payload);
    return unwrap(response);
};

export const deleteMatch = async (id) => {
    const response = await axiosInstance.delete(`/matches/${id}`);
    return unwrap(response);
};

export const getDashboardMatchById = async (id) => {
    const response = await axiosInstance.get(`/matches/${id}`);
    return unwrap(response);
};

export const publishMatch = async (id) => {
    const response = await axiosInstance.patch(`/matches/${id}/publish`);
    return unwrap(response);
};

export const updateToss = async ({ id, payload }) => {
    const response = await axiosInstance.patch(`/matches/${id}/toss`, payload);
    return unwrap(response);
};

export const startMatch = async (id) => {
    const response = await axiosInstance.patch(`/matches/${id}/start`);
    return unwrap(response);
};

export const getImageKitAuth = async () => {
    const response = await axiosInstance.get("/uploads/imagekit-auth");
    return unwrap(response);
};

export const uploadImage = async (file, folder = "/glpddp") => {
    if (!file) return "";

    const auth = await getImageKitAuth();
    const formData = new FormData();

    formData.append("file", file);
    formData.append("fileName", file.name);
    formData.append("folder", folder);
    formData.append("publicKey", auth.publicKey);
    formData.append("signature", auth.signature);
    formData.append("expire", auth.expire);
    formData.append("token", auth.token);

    const response = await axios.post(auth.uploadUrl, formData);
    return response.data?.url;
};

export const startInnings = async ({ matchId, payload }) => {
    const response = await axiosInstance.post(`/scoring/matches/${matchId}/innings`, payload);
    return unwrap(response);
};

export const recordDelivery = async ({ inningsId, payload }) => {
    const response = await axiosInstance.post(`/scoring/innings/${inningsId}/deliveries`, payload);
    return unwrap(response);
};

export const updateCurrentPlayers = async ({ inningsId, payload }) => {
    const response = await axiosInstance.patch(`/scoring/innings/${inningsId}/current-players`, payload);
    return unwrap(response);
};

export const addManualCommentary = async ({ matchId, payload }) => {
    const response = await axiosInstance.post(`/scoring/matches/${matchId}/commentary`, payload);
    return unwrap(response);
};

export const getUsers = async () => {
    const response = await axiosInstance.get("/users");
    return unwrap(response);
};

export const makeUserAdmin = async (id) => {
    const response = await axiosInstance.put(`/users/make-admin/${id}`);
    return unwrap(response);
};
