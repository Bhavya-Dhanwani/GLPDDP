import styles from "../css/FormBox.module.css";

const FormBox = ({ children }) => {
    return (
        <div className={styles.formBox}>
            {children}
        </div>
    );
};

export default FormBox;