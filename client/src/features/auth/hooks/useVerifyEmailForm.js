import { useSelector } from "react-redux";
import useOtpInput from "./useOtpInput";
import useResendOtp from "./useResendOtp";
import { useVerifyOtp, useResendOtp as useResendOtpMutation } from "./useAuth";

const useVerifyEmailForm = () => {
    const user = useSelector((state) => state.auth.user);
    const verifyOtpMutation = useVerifyOtp();
    const resendOtpMutation = useResendOtpMutation();

    const {
        otp,
        otpValue,
        inputRefs,
        handleChange,
        handleKeyDown,
        handlePaste,
    } = useOtpInput(6);

    const {
        seconds,
        canResend,
        restart,
    } = useResendOtp(60);

    const handleVerify = () => {
        verifyOtpMutation.mutate({ otp: otpValue });
    };

    const handleResend = () => {
        resendOtpMutation.mutate(undefined, {
            onSuccess: () => {
                restart();
            },
        });
    };

    return {
        email: user?.email || "",
        otp,
        otpValue,
        inputRefs,
        handleChange,
        handleKeyDown,
        handlePaste,
        handleVerify,
        handleResend,
        isVerifying: verifyOtpMutation.isPending,
        isResending: resendOtpMutation.isPending,
        canResend,
        seconds,
    };
};

export default useVerifyEmailForm;
