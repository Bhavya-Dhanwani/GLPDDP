import axios from "axios";

let token = "";

const setToken = (newToken) => {
    token = newToken;
};

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000/api",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

axiosInstance.interceptors.request.use(
    (config) => {
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }
);

axiosInstance.interceptors.response.use(
    
    (response) => {
        const accessToken = response.data?.data?.accessToken;

        if (accessToken) {
            setToken(accessToken);
        }

        return response;
    },

    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status !== 401 ||
            originalRequest._retry
        ) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
            const { data } = await axios.post(
                "/auth/refresh",
                {},
                { withCredentials: true }
            );

            setToken(data.accessToken);

            return axiosInstance(originalRequest);
        } catch (err) {
            return Promise.reject(err);
        }
    }
);

export { setToken };

export default axiosInstance;