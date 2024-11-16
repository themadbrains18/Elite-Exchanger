import React, { useState, useRef, useEffect } from "react";
const TimerCountDown = () => {

    const Ref = useRef(null);
    const [timer, setTimer] = useState("00:00:00");

    /**
   * Calculates the time remaining until the deadline.
   * 
   * @param {any} e - The deadline date as a string or Date object.
   * @returns {Object} An object containing total time in milliseconds, and the breakdown of hours, minutes, and seconds.
   */
    const getTimeRemaining = (e: any) => {
        let deadline: any = new Date();
        const total = Date.parse(e) - Date.parse(deadline);
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor(
            (total / 1000 / 60) % 60
        );
        const hours = Math.floor(
            (total / 1000 / 60 / 60) % 24
        );
        return {
            total,
            hours,
            minutes,
            seconds,
        };
    };

    /**
   * Starts the countdown timer by setting the time based on the remaining time.
   * Updates the `timer` state with a formatted string (HH:MM:SS).
   * 
   * @param {any} e - The deadline date as a string or Date object.
   */
    const startTimer = (e: any) => {
        let { total, hours, minutes, seconds } =
            getTimeRemaining(e);
        if (total >= 0) {
            setTimer(
                (hours > 9 ? hours : "0" + hours) +
                ":" +
                (minutes > 9
                    ? minutes
                    : "0" + minutes) +
                ":" +
                (seconds > 9 ? seconds : "0" + seconds)
            );
        }
    };

    /**
   * Clears any existing timer interval and starts a new countdown.
   * Resets the timer to a predefined value (10 seconds) and starts the countdown based on the given deadline.
   * 
   * @param {any} e - The deadline date as a string or Date object.
   */
    const clearTimer = (e: any) => {
        setTimer("00:00:10");
        if (Ref.current) clearInterval(Ref.current);
        const id = setInterval(() => {
            startTimer(e);
        }, 1000);
    };

    /**
  * Gets the deadline time which is 8 hours from the current time.
  * 
  * @returns {Date} The new deadline time as a Date object.
  */
    const getDeadTime = () => {
        let deadline = new Date();
        deadline.setSeconds(deadline.getHours() + 8);
        return deadline;
    };

    useEffect(() => {
        clearTimer(getDeadTime());
    }, []);

    return (
        <>
            <div
                style={{ textAlign: "center", margin: "auto" }}
            >
                <h2>{timer}</h2>
            </div>
        </>
    )
}

export default TimerCountDown;