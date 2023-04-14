import React, { useState, useRef, useEffect } from "react";
import "../assets/css/Stopwatch.css";

interface StopwatchProps {
  className?: string;
}

const Stopwatch: React.FC<StopwatchProps> = ({ className }) => {
  const [elapsedMs, setElapsedMs] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const start = (): void => {
    if (isRunning) return;
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setElapsedMs((prevElapsedMs) => prevElapsedMs + 10);
    }, 10);
  };

  const stop = (): void => {
    if (!isRunning) return;
    clearInterval(intervalRef.current!);
    setIsRunning(false);
  };

  const reset = (): void => {
    stop();
    setElapsedMs(0);
  };

  const formatTime = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}.${centiseconds.toString().padStart(2, "0")}`;
  };

  const timeString = formatTime(elapsedMs);

  return (
    <div className={`stopwatch ${className}`}>
      <div className="display">{timeString}</div>
      <div className="buttons">
        <button className="start-btn" onClick={start}>
          Start
        </button>
        <button className="stop-btn" onClick={stop}>
          Stop
        </button>
        <button className="reset-btn" onClick={reset}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default Stopwatch;