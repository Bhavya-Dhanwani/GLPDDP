"use client";

import Button from "./Button";
import Separator from "./Seperator";

import OtpInput from "./OtpInput";

import VerifyEmailStructure from "./VerifyEmailStrucutre";

import useOtpInput from "../../hooks/useOtpInput";
import useResendOtp from "../../hooks/useResendOtp";

import styles from "../css/VerifyEmail.module.css";

const VerifyEmail = () => {
    const {
        otp,
        otpValue,
        inputRefs,
        handleChange,
        handleKeyDown,
        handlePaste
    } = useOtpInput(6);

    const {
        seconds,
        canResend,
        restart
    } = useResendOtp(60);

    const handleVerify = () => {
        console.log(otpValue);
    };

    const handleResend = () => {
        restart();
    };

    return (
        <VerifyEmailStructure>
            <h1 className={styles.title}>
                Verify Your Email
            </h1>

            <p
                className={
                    styles.description
                }
            >
                Enter the 6-digit
                verification code
                sent to
            </p>

            <span
                className={
                    styles.email
                }
            >
                example@gmail.com
            </span>

            <OtpInput
                otp={otp}
                inputRefs={
                    inputRefs
                }
                handleChange={
                    handleChange
                }
                handleKeyDown={
                    handleKeyDown
                }
                handlePaste={
                    handlePaste
                }
            />

            <Button
                onClick={
                    handleVerify
                }
            >
                Verify Email
            </Button>

            <Separator text="or" />

            <button
                type="button"
                disabled={!canResend}
                onClick={
                    handleResend
                }
                className={
                    styles.resend
                }
            >
                {canResend
                    ? "Resend OTP"
                    : `Resend OTP (${seconds}s)`}
            </button>
        </VerifyEmailStructure>
    );
};

export default VerifyEmail;