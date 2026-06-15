"use client";

import Link from "next/link";

import {
    ArrowLeft,
    LockKeyhole
} from "lucide-react";

import SignupStructure from "./SignupStrucutre";

import AuthHeading from "./AuthHeading";
import AuthSubHeading from "./AuthSubHeading";

import FormBox from "./FormBox";
import FormHeading from "./FormHeading";

import InputField from "./InputFeild";
import Button from "./Button";
import Separator from "./Seperator";

import useResetPasswordForm from "../../hooks/useResetPasswordForm";

import styles from "../css/ResetPassword.module.css";

const ResetPassword = () => {
    const {
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        handleSubmit,
        isPending,
        passwordsMatch,
        isEmpty
    } = useResetPasswordForm();

    return (
        <SignupStructure
            leftContent={
                <>
                    <AuthHeading>
                        Reset Your
                        <br />
                        Password
                    </AuthHeading>

                    <AuthSubHeading>
                        Enter a new password for your account
                        to continue your cricket journey.
                        <span className={styles.brand}>
                            {" "}GLPDDP
                        </span>
                    </AuthSubHeading>
                </>
            }
            rightContent={
                <FormBox>
                    <div className={styles.iconWrapper}>
                        <LockKeyhole size={42} />
                    </div>

                    <FormHeading
                        title="Reset Password"
                        subtitle="Enter your new password below."
                    />

                    <form onSubmit={handleSubmit}>
                        <InputField
                            label="New Password"
                            type="password"
                            placeholder="Enter new password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <InputField
                            label="Confirm New Password"
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />

                        {!passwordsMatch && !isEmpty && (
                            <p className={styles.error}>Passwords do not match</p>
                        )}

                        <Button
                            type="submit"
                            disabled={isPending || !passwordsMatch}
                        >
                            {isPending ? "Resetting..." : "Reset Password"}
                        </Button>
                    </form>

                    <Separator />

                    <div className={styles.backLinkWrapper}>
                        <Link
                            href="/login"
                            className={styles.backLink}
                        >
                            <ArrowLeft size={18} />
                            Back to Login
                        </Link>
                    </div>
                </FormBox>
            }
        />
    );
};

export default ResetPassword;
