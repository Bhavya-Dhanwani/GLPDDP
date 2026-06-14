"use client";

import {
    Mail,
    Lock,
    User
} from "lucide-react";

import { FcGoogle } from "react-icons/fc";

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

                    <form className={styles.form}>
                        <InputField
                            label="Full Name"
                            icon={User}
                            placeholder="John Doe"
                        />

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
                            placeholder="Create password"
                        />

                        <InputField
                            label="Confirm Password"
                            type="password"
                            icon={Lock}
                            placeholder="Confirm password"
                        />

                        {/* <div className={styles.terms}>
                            <input type="checkbox" />

                            <span>
                                I agree to the Terms &
                                Conditions and Privacy
                                Policy
                            </span>
                        </div> */}

                        <Button type="submit">
                            Create Account
                        </Button>

                        <Separator text="OR" />

                        <Button
                            variant="secondary"
                            icon={<FcGoogle size={24} />}
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