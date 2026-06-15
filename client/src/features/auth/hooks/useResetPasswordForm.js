import { useState } from "react";
import { useParams } from "next/navigation";
import { useResetPassword } from "./useAuth";

const useResetPasswordForm = () => {
    const { token } = useParams();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const resetPasswordMutation = useResetPassword();

    const passwordsMatch = password === confirmPassword;
    const isEmpty = password === "" || confirmPassword === "";

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!passwordsMatch) return;

        resetPasswordMutation.mutate({ token, password });
    };

    return {
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        handleSubmit,
        isPending: resetPasswordMutation.isPending,
        passwordsMatch,
        isEmpty,
    };
};

export default useResetPasswordForm;
