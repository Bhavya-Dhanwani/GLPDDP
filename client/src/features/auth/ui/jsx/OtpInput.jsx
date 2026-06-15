import styles from "../css/OtpInput.module.css";

const OtpInput = ({
    otp,
    inputRefs,
    handleChange,
    handleKeyDown,
    handlePaste
}) => {
    return (
        <div
            className={
                styles.container
            }
            onPaste={
                handlePaste
            }
        >
            {otp.map(
                (
                    digit,
                    index
                ) => (
                    <input
                        key={index}
                        ref={(el) =>
                            (inputRefs.current[
                                index
                            ] = el)
                        }
                        value={digit}
                        maxLength={1}
                        inputMode="numeric"
                        className={
                            styles.input
                        }
                        onChange={(e) =>
                            handleChange(
                                e.target
                                    .value,
                                index
                            )
                        }
                        onKeyDown={(e) =>
                            handleKeyDown(
                                e,
                                index
                            )
                        }
                    />
                )
            )}
        </div>
    );
};

export default OtpInput;