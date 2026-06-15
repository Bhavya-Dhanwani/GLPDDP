"use client";

import Link from "next/link";
import { useState } from "react";

import { Mail, Lock } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

import { useLogin } from "../../hooks/useAuth";
import useGoogleAuth from "../../hooks/useGoogleAuth";

import LoginStructure from "./LoginStrucutre";

import AuthHeading from "./AuthHeading";
import AuthSubHeading from "./AuthSubHeading";

import FormBox from "./FormBox";
import FormHeading from "./FormHeading";
import InputField from "./InputFeild";
import Button from "./Button";
import Separator from "./Seperator";
import AuthSwitch from "./AuthSwitch";

import styles from "../css/Login.module.css";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const loginMutation = useLogin();
    const { redirectToGoogle } = useGoogleAuth();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        loginMutation.mutate(formData);
    };

    return (
        <LoginStructure
            leftContent={
                <>
                    <AuthHeading>
                        Welcome
                        <br />
                        Back
                    </AuthHeading>

                    <AuthSubHeading>
                        Login to continue your journey with{" "}
                        <strong>GLPDDP</strong>
                    </AuthSubHeading>
                </>
            }
            rightContent={
                <FormBox>
                    <FormHeading
                        title="Login"
                        subtitle="Enter your credentials to continue"
                    />

                    <form className={styles.form} onSubmit={handleSubmit}>
                        <InputField
                            label="Email Address"
                            type="email"
                            icon={Mail}
                            name="email"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={handleChange}
                        />

                        <InputField
                            label="Password"
                            type="password"
                            icon={Lock}
                            name="password"
                            placeholder="Enter password"
                            value={formData.password}
                            onChange={handleChange}
                        />

                        <div className={styles.options}>
                            <div></div>

                            <Link
                                href="/forgot-password"
                                className={styles.forgot}
                            >
                                Forgot Password?
                            </Link>
                        </div>

                        <Button type="submit" disabled={loginMutation.isPending}>
                            {loginMutation.isPending ? "Logging in..." : "Login"}
                        </Button>

                        <Separator text="OR" />

                        <Button
                            variant="secondary"
                            icon={<FcGoogle size={24} />}
                            onClick={redirectToGoogle}
                            type="button"
                        >
                            Continue with Google
                        </Button>

                        <AuthSwitch
                            text="Don't have an account?"
                            linkText="Sign Up"
                            href="/signup"
                        />
                    </form>
                </FormBox>
            }
        />
    );
};

export default Login;
