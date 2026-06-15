import { useState } from "react";
import useCooldown from "./useCooldown";
import { useForgotPassword } from "./useAuth";

const useForgotPasswordForm = () => {
    const [email, setEmail] = useState("");
    const forgotPasswordMutation = useForgotPassword();
    const { seconds, isCoolingDown, startCooldown } = useCooldown(60);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isCoolingDown) return;

        forgotPasswordMutation.mutate(
            { email },
            {
                onSuccess: () => {
                    startCooldown();
                },
            }
        );
    };

    return {
        email,
        setEmail,
        handleSubmit,
        isPending: forgotPasswordMutation.isPending,
        isCoolingDown,
        seconds,
    };
};

export default useForgotPasswordForm;
