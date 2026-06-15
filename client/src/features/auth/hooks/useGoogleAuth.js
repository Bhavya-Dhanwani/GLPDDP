"use client";

import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { setUser } from "../state/authSlice";
import axiosInstance from "@/lib/axios";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

const useGoogleAuth = () => {
    const dispatch = useDispatch();
    const router = useRouter();

    const handleCredentialResponse = useCallback(async (response) => {
        try {
            const { data } = await axiosInstance.post("/auth/google", {
                credential: response.credential,
            });

            if (data?.data) {
                const { accessToken, ...user } = data.data;
                dispatch(setUser({ user, accessToken }));
                toast.success("Google login successful");
                router.push("/");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Google login failed");
        }
    }, [dispatch, router]);

    const openPopup = useCallback(() => {
        if (!GOOGLE_CLIENT_ID) {
            toast.error("Google Client ID not configured");
            return;
        }

        if (!window.google?.accounts?.id) {
            toast.error("Google auth is loading, please try again");
            return;
        }

        window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse,
        });

        window.google.accounts.id.prompt();
    }, [handleCredentialResponse]);

    const redirectToGoogle = useCallback(() => {
        window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000/api"}/auth/google`;
    }, []);

    return { openPopup, redirectToGoogle };
};

export default useGoogleAuth;
