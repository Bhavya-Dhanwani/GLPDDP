import Image from "next/image";

import AuthNav from "./AuthNav";

import styles from "../css/ForgotPasswordStructure.module.css";

import LoginImage from "@/assets/images/login.png";

const ForgotPasswordStructure = ({
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
                            src={LoginImage}
                            alt="Forgot Password"
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

export default ForgotPasswordStructure;