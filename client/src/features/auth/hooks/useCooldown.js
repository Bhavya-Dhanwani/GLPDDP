import { useEffect, useState } from "react";

const useCooldown = (
    initialSeconds = 60
) => {
    const [seconds, setSeconds] =
        useState(0);

    useEffect(() => {
        if (seconds <= 0) return;

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

    const startCooldown = () => {
        setSeconds(initialSeconds);
    };

    return {
        seconds,
        isCoolingDown:
            seconds > 0,
        startCooldown
    };
};

export default useCooldown;