"use client";

import Link from "next/link";

import { Mail, Lock } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

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

                    <form className={styles.form}>
                        <InputField
                            label="Email Address"
                            type="email"
                            icon={Mail}
                            placeholder="john@example.com"
                        />

                        <InputField
                            label="Password"
                            type="password"
                            icon={Lock}
                            placeholder="Enter password"
                        />

                        <div className={styles.options}>
                            <div></div>
                            {/* <label className={styles.checkbox}>
                                <input type="checkbox" />
                                <span>Remember me</span>
                            </label> */}

                            <Link
                                href="/forgot-password"
                                className={styles.forgot}
                            >
                                Forgot Password?
                            </Link>
                        </div>

                        <Button type="submit">
                            Login
                        </Button>

                        <Separator text="OR" />

                        <Button
                            variant="secondary"
                            icon={<FcGoogle size={24} />}
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