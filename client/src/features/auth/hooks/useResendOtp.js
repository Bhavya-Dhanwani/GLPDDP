import {
    useEffect,
    useState
} from "react";

const useResendOtp = (
    initialTime = 60
) => {
    const [seconds, setSeconds] =
        useState(initialTime);

    useEffect(() => {
        if (seconds === 0) return;

        const interval =
            setInterval(() => {
                setSeconds(
                    (prev) => prev - 1
                );
            }, 1000);

        return () =>
            clearInterval(
                interval
            );
    }, [seconds]);

    const restart = () => {
        setSeconds(initialTime);
    };

    return {
        seconds,
        restart,
        canResend: seconds === 0
    };
};

export default useResendOtp;