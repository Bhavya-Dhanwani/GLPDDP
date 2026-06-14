import Image from "next/image";

import AuthNav from "./AuthNav";

import styles from "../css/LoginStrucutre.module.css";

import LoginImage from "@/assets/images/login.png";

const LoginStructure = ({
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
                            alt="Login Illustration"
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

export default LoginStructure;