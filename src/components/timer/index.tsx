import { useEffect, useRef, useState } from "react";
import style from "./style.module.scss";
import classNames from "classnames";
export interface Props {
    seconds: number;
    redTime?: number;
    onEnd: () => any;
    state?: boolean;
}
function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(remainingSeconds).padStart(2, "0");
    return `${formattedMinutes}:${formattedSeconds}`;
}
type StatesType = "Red" | "";
export default function Timer({
    seconds,
    redTime,
    onEnd: onEnd,
    state,
}: Props) {
    const timerSpan = useRef<HTMLSpanElement>(null);
    const timer = useRef<HTMLDivElement>(null);
    const [timerState, setTimerState] = useState<StatesType>("");

    useEffect(() => {
        let time = seconds;
        if (state == false) return;
        const finish: ReturnType<typeof setInterval> = setInterval(() => {
            if (!timerSpan.current || !timer.current) return;
            if (redTime && time < redTime) setTimerState("Red");

            if (time < 0) {
                onEnd();
                return clearInterval(finish);
            }
            timerSpan.current.innerText = formatTime(time--);
        }, 1000);
        if (timer.current) setTimerState("");
        return () => clearInterval(finish);
    }, [seconds, timerSpan, state]);
    return (
        <div
            className={classNames(style.timer, {
                [style.redTime]: timerState == "Red",
            })}
            ref={timer}
        >
            <p className="text-lg">
                <span>Time Remaining:</span>
                <span
                    className={style["timer-container"]}
                    ref={timerSpan}
                >
                    {formatTime(seconds)}
                </span>
            </p>
        </div>
    );
}
