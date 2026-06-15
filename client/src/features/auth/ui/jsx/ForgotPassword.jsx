"use client";

import Link from "next/link";

import {
    Mail,
    ArrowLeft
} from "lucide-react";

import AuthHeading from "./AuthHeading";
import AuthSubHeading from "./AuthSubHeading";

import FormBox from "./FormBox";
import FormHeading from "./FormHeading";

import InputField from "./InputFeild";
import Button from "./Button";
import Separator from "./Seperator";

import ForgotPasswordStructure from "./ForgotPasswordStructure";

import useForgotPasswordForm from "../../hooks/useForgotPasswordForm";

import styles from "../css/ForgotPassword.module.css";

const ForgotPassword = () => {
    const {
        email,
        setEmail,
        handleSubmit,
        isPending,
        isCoolingDown,
        seconds
    } = useForgotPasswordForm();

    return (
        <ForgotPasswordStructure
            leftContent={
                <>
                    <AuthHeading>
                        Forgot
                        <br />
                        Password?
                    </AuthHeading>

                    <AuthSubHeading>
                        No worries! Enter
                        your registered
                        email address and
                        we&apos;ll send you a
                        link to reset your
                        password.
                    </AuthSubHeading>
                </>
            }
            rightContent={
                <FormBox>
                    <div
                        className={
                            styles.iconWrapper
                        }
                    >
                        <Mail
                            size={
                                40
                            }
                        />
                    </div>

                    <FormHeading
                        title="Reset Your Password"
                        subtitle="Enter your email address associated with your account and we'll send you a reset link."
                    />

                    <form
                        onSubmit={
                            handleSubmit
                        }
                    >
                        <InputField
                            label="Email Address"
                            icon={
                                Mail
                            }
                            type="email"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <Button
                            type="submit"
                            disabled={isPending}
                        >
                            {isPending
                                ? "Sending..."
                                : isCoolingDown
                                    ? `Send Again (${seconds}s)`
                                    : "Send Reset Link"}
                        </Button>
                    </form>

                    <Separator />

                    <Link
                        href="/login"
                        className={
                            styles.backLink
                        }
                    >
                        <ArrowLeft
                            size={
                                18
                            }
                        />
                        Back to Login
                    </Link>
                </FormBox>
            }
        />
    );
};

export default ForgotPassword;
