import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { login, signup, logout, verifyOtp, resendOtp, forgotPassword, resetPassword } from "../api/auth.api";
import { setUser, clearUser, updateUser } from "../state/authSlice";

export const useLogin = () => {
    const router = useRouter();
    const dispatch = useDispatch();

    return useMutation({
        mutationFn: login,
        onSuccess: (response) => {
            const { accessToken, ...user } = response.data;
            dispatch(setUser({ user, accessToken }));
            toast.success(response.message || "Logged in successfully");
            router.push("/");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Login failed");
        },
    });
};

export const useSignup = () => {
    const router = useRouter();
    const dispatch = useDispatch();

    return useMutation({
        mutationFn: signup,
        onSuccess: (response) => {
            const { accessToken, ...user } = response.data;
            dispatch(setUser({ user, accessToken }));
            toast.success(response.message || "Account created successfully");
            router.push("/verify-email");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Signup failed");
        },
    });
};

export const useLogout = () => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const dispatch = useDispatch();

    return useMutation({
        mutationFn: logout,
        onSuccess: () => {
            dispatch(clearUser());
            toast.success("Logged out successfully");
            queryClient.clear();
            router.push("/login");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Logout failed");
        },
    });
};

export const useVerifyOtp = () => {
    const dispatch = useDispatch();

    return useMutation({
        mutationFn: verifyOtp,
        onSuccess: (response) => {
            dispatch(updateUser({ isVerified: true }));
            toast.success(response.message || "Email verified successfully");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Verification failed");
        },
    });
};

export const useResendOtp = () => {
    return useMutation({
        mutationFn: resendOtp,
        onSuccess: (response) => {
            toast.success(response.message || "OTP sent successfully");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to resend OTP");
        },
    });
};

export const useForgotPassword = () => {
    return useMutation({
        mutationFn: forgotPassword,
        onSuccess: (response) => {
            toast.success(response.message || "Reset link sent successfully");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to send reset link");
        },
    });
};

export const useResetPassword = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: resetPassword,
        onSuccess: (response) => {
            toast.success(response.message || "Password reset successfully");
            router.push("/login");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Password reset failed");
        },
    });
};
