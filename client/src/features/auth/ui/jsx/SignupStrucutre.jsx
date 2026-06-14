import Image from "next/image";

import AuthNav from "./AuthNav";

import styles from "../css/SignupStructure.module.css";

import SignupImage from "@/assets/images/signup.png";

const SignupStructure = ({
    leftContent,
    rightContent
}) => {
    return (
        <main className={styles.wrapper}>
            <AuthNav />

            <section className={styles.container}>
                <div className={styles.left}>
                    <div className={styles.content}>
                        {leftContent}
                    </div>

                    <div className={styles.imageContainer}>
                        <Image
                            src={SignupImage}
                            alt="Signup Illustration"
                            className={styles.image}
                            priority
                        />
                    </div>
                </div>

                <div className={styles.right}>
                    {rightContent}
                </div>
            </section>
        </main>
    );
};

export default SignupStructure;