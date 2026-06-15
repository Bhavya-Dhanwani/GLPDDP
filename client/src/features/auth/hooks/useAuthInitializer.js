import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../state/authSlice";
import axiosInstance from "@/lib/axios";

const useAuthInitializer = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { data } = await axiosInstance.get("/auth/me");

                if (data?.data) {
                    const { accessToken, ...user } = data.data;
                    dispatch(setUser({ user, accessToken }));
                }
            } catch {
                // User is not logged in or session expired - do nothing
            }
        };

        checkAuth();
    }, [dispatch]);
};

export default useAuthInitializer;
