import Image from "next/image";
import styles from "../css/AuthNav.module.css";

import Logo from "@/assets/images/logo.png";

const AuthNav = () => {
    return (
        <nav className={styles.nav}>
            <Image
                src={Logo}
                alt="GLPDDP Logo"
                priority
                className={styles.logo}
            />
        </nav>
    );
};

export default AuthNav;