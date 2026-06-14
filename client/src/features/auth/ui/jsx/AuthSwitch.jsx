import Link from "next/link";

import styles from "../css/AuthSwitch.module.css";

const AuthSwitch = ({
    text,
    linkText,
    href
}) => {
    return (
        <p className={styles.text}>
            {text}

            <Link
                href={href}
                className={styles.link}
            >
                {linkText}
            </Link>
        </p>
    );
};

export default AuthSwitch;