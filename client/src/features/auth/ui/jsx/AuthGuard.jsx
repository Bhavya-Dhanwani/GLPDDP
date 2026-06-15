"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";

const authRoutes = ["/login", "/signup", "/forgot-password"];
const resetPasswordPattern = /^\/reset-password\//;

const AuthGuard = ({ children }) => {
    const router = useRouter();
    const pathname = usePathname();
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    const isVerified = user?.isVerified;
    const isAuthRoute =
        authRoutes.includes(pathname) ||
        resetPasswordPattern.test(pathname);
    const isVerifyEmailRoute = pathname === "/verify-email";

    useEffect(() => {
        if (!isAuthenticated && isVerifyEmailRoute) {
            router.replace("/login");
            return;
        }

        if (isAuthenticated && isVerified && isAuthRoute) {
            router.replace("/");
            return;
        }

        if (isAuthenticated && !isVerified && isAuthRoute) {
            router.replace("/verify-email");
            return;
        }

        if (isAuthenticated && isVerified && isVerifyEmailRoute) {
            router.replace("/");
            return;
        }
    }, [isAuthenticated, isVerified, pathname, router, isAuthRoute, isVerifyEmailRoute]);

    if (!isAuthenticated && isVerifyEmailRoute) return null;
    if (isAuthenticated && isVerified && isAuthRoute) return null;
    if (isAuthenticated && !isVerified && isAuthRoute) return null;
    if (isAuthenticated && isVerified && isVerifyEmailRoute) return null;

    return children;
};

export default AuthGuard;
