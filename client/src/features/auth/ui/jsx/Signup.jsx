"use client";

import { useState } from "react";

import {
    Mail,
    Lock,
    User
} from "lucide-react";

import { FcGoogle } from "react-icons/fc";

import { useSignup } from "../../hooks/useAuth";
import useGoogleAuth from "../../hooks/useGoogleAuth";

import SignupStructure from "./SignupStrucutre";

import AuthHeading from "./AuthHeading";
import AuthSubHeading from "./AuthSubHeading";

import FormBox from "./FormBox";
import FormHeading from "./FormHeading";
import InputField from "./InputFeild";
import Button from "./Button";
import Separator from "./Seperator";
import AuthSwitch from "./AuthSwitch";

import styles from "../css/Signup.module.css";

const Signup = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const signupMutation = useSignup();
    const { openPopup } = useGoogleAuth();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            return;
        }

        const { confirmPassword, ...submitData } = formData;
        signupMutation.mutate(submitData);
    };

    return (
        <SignupStructure
            leftContent={
                <>
                    <AuthHeading>
                        Create
                        <br />
                        Account
                    </AuthHeading>

                    <AuthSubHeading>
                        Join <strong>GLPDDP</strong> and
                        start managing your cricket
                        journey smarter.
                    </AuthSubHeading>
                </>
            }
            rightContent={
                <FormBox>
                    <FormHeading
                        title="Sign Up"
                        subtitle="Create your account to get started"
                    />

                    <form className={styles.form} onSubmit={handleSubmit}>
                        <InputField
                            label="Full Name"
                            icon={User}
                            name="name"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                        />

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
                            placeholder="Create password"
                            value={formData.password}
                            onChange={handleChange}
                        />

                        <InputField
                            label="Confirm Password"
                            type="password"
                            icon={Lock}
                            name="confirmPassword"
                            placeholder="Confirm password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />

                        <Button type="submit" disabled={signupMutation.isPending}>
                            {signupMutation.isPending ? "Creating Account..." : "Create Account"}
                        </Button>

                        <Separator text="OR" />

                        <Button
                            variant="secondary"
                            icon={<FcGoogle size={24} />}
                            onClick={openPopup}
                            type="button"
                        >
                            Continue with Google
                        </Button>

                        <AuthSwitch
                            text="Already have an account?"
                            linkText="Login"
                            href="/login"
                        />
                    </form>
                </FormBox>
            }
        />
    );
};

export default Signup;