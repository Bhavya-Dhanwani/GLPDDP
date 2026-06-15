import { useRef, useState } from "react";

const useOtpInput = (length = 6) => {
    const [otp, setOtp] = useState(
        Array(length).fill("")
    );

    const inputRefs = useRef([]);

    const handleChange = (value, index) => {
        if (!/^\d?$/.test(value)) return;

        const updatedOtp = [...otp];
        updatedOtp[index] = value;

        setOtp(updatedOtp);

        if (
            value &&
            index < length - 1
        ) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (
        e,
        index
    ) => {
        if (
            e.key === "Backspace"
        ) {
            if (
                otp[index] === "" &&
                index > 0
            ) {
                const updatedOtp = [...otp];

                updatedOtp[index - 1] = "";

                setOtp(updatedOtp);

                inputRefs.current[
                    index - 1
                ]?.focus();
            }
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();

        const pastedData =
            e.clipboardData
                .getData("text")
                .trim();

        if (
            !/^\d+$/.test(
                pastedData
            )
        )
            return;

        const digits =
            pastedData
                .slice(0, length)
                .split("");

        const updatedOtp =
            Array(length).fill("");

        digits.forEach(
            (digit, index) => {
                updatedOtp[index] =
                    digit;
            }
        );

        setOtp(updatedOtp);

        const lastIndex =
            Math.min(
                digits.length - 1,
                length - 1
            );

        inputRefs.current[
            lastIndex
        ]?.focus();
    };

    return {
        otp,
        setOtp,
        inputRefs,
        handleChange,
        handleKeyDown,
        handlePaste,
        otpValue: otp.join("")
    };
};

export default useOtpInput;