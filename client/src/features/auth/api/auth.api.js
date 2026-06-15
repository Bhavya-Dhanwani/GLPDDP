import axiosInstance from "@/lib/axios";

export const signup = async ({ name, email, password }) => {
    const { data } = await axiosInstance.post("/auth/signup", {
        name,
        email,
        password,
    });
    return data;
};

export const login = async ({ email, password }) => {
    const { data } = await axiosInstance.post("/auth/login", {
        email,
        password,
    });
    return data;
};

export const logout = async () => {
    const { data } = await axiosInstance.post("/auth/logout");
    return data;
};

export const verifyOtp = async ({ otp }) => {
    const { data } = await axiosInstance.post("/auth/verify", { otp });
    return data;
};

export const resendOtp = async () => {
    const { data } = await axiosInstance.post("/auth/resend-otp");
    return data;
};

export const forgotPassword = async ({ email }) => {
    const { data } = await axiosInstance.post("/auth/forgot-password", {
        email,
    });
    return data;
};

export const resetPassword = async ({ token, password }) => {
    const { data } = await axiosInstance.post("/auth/reset-password", {
        token,
        password,
    });
    return data;
};
