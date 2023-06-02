import React, { useState, useEffect } from "react";
import "../assets/css/Pomodoro.css";

interface PomodoroProps {
  duration: number; // Duration in minutes
}

const Pomodoro: React.FC<PomodoroProps> = ({ duration }) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60); // Convert minutes to seconds
  const [isRunning, setIsRunning] = useState(false);
  const [buttonLabel, setButtonLabel] = useState("START");
  const [isButtonPressed, setIsButtonPressed] = useState(false);

  useEffect(() => {
    const minutes = Math.floor(timeLeft / 60).toString().padStart(2, "0");
    const seconds = (timeLeft % 60).toString().padStart(2, "0");
    document.title = `${minutes}:${seconds}`;
  }, [timeLeft]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isRunning]);

  useEffect(() => {
    if (timeLeft === 0) {
      setIsRunning(false);
      // Add any logic you want to execute when the timer reaches zero
      console.log("Timer finished!");
    }
  }, [timeLeft]);

  const startTimer = () => {
    setIsRunning((prevState) => !prevState);
    setButtonLabel((prevLabel) => (prevLabel === "START" ? "PAUSE" : "START"));
    setIsButtonPressed((prevState) => !prevState); // Toggle the button pressed state
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="pomodoro-container">
      <div className="timer">
        <span>{minutes.toString().padStart(2, "0")}</span>:
        <span>{seconds.toString().padStart(2, "0")}</span>
      </div>
      <button
        className={`${isButtonPressed ? "pressed" : "unpressed"}`}
        onClick={startTimer}
      >
        {buttonLabel}
      </button>
    </div>
  );
};

export default Pomodoro;