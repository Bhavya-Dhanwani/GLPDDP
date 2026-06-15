"use client";

import Button from "./Button";
import Separator from "./Seperator";

import OtpInput from "./OtpInput";

import VerifyEmailStructure from "./VerifyEmailStrucutre";

import useVerifyEmailForm from "../../hooks/useVerifyEmailForm";

import styles from "../css/VerifyEmail.module.css";

const VerifyEmail = () => {
    const {
        email,
        otp,
        inputRefs,
        handleChange,
        handleKeyDown,
        handlePaste,
        handleVerify,
        handleResend,
        isVerifying,
        canResend,
        seconds
    } = useVerifyEmailForm();

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
                {email}
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
                disabled={isVerifying}
            >
                {isVerifying ? "Verifying..." : "Verify Email"}
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
