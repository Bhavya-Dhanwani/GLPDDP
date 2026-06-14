import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import styles from "../css/InputFeild.module.css";

const InputField = ({
    label,
    icon: Icon,
    type = "text",
    placeholder,
    value,
    onChange,
    name
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const inputType =
        type === "password"
            ? showPassword
                ? "text"
                : "password"
            : type;

    return (
        <div className={styles.field}>
            {label && (
                <label className={styles.label}>
                    {label}
                </label>
            )}

            <div className={styles.inputWrapper}>
                {Icon && (
                    <Icon
                        size={20}
                        className={styles.leadingIcon}
                    />
                )}

                <input
                    name={name}
                    type={inputType}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={styles.input}
                />

                {type === "password" && (
                    <button
                        type="button"
                        className={styles.eyeButton}
                        onClick={() =>
                            setShowPassword(
                                !showPassword
                            )
                        }
                    >
                        {showPassword ? (
                            <EyeOff size={20} />
                        ) : (
                            <Eye size={20} />
                        )}
                    </button>
                )}
            </div>
        </div>
    );
};

export default InputField;