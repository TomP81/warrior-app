"use client";

import { useEffect, useState } from "react";

export default function ExerciseTimer({
  duration,
  onComplete,
}: {
  duration: number;
  onComplete: () => void;
}) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;
    const timeout = window.setTimeout(() => {
      if (timeLeft <= 1) {
        setTimeLeft(0);
        setIsRunning(false);
        onComplete();
      } else {
        setTimeLeft(timeLeft - 1);
      }
    }, 1000);
    return () => window.clearTimeout(timeout);
  }, [isRunning, timeLeft, onComplete]);

  return (
    <div className="mt-3 text-center">
      <p className="text-sm text-green-400">{isRunning ? "Temps restant" : "Chrono prêt"}</p>
      <p className="text-4xl font-bold">{timeLeft}s</p>
      {!isRunning && timeLeft > 0 && (
        <button
          onClick={() => setIsRunning(true)}
          className="mt-3 w-full rounded-2xl bg-white py-4 text-lg font-bold text-black"
        >
          Lancer le chrono
        </button>
      )}
    </div>
  );
}
