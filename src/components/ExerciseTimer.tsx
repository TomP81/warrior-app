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
    <div className="mx-auto flex max-w-xl flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center sm:mt-3 sm:block">
      <div className="flex items-center gap-2 sm:block">
        <p className="text-xs text-green-400 sm:text-sm">{isRunning ? "Temps restant" : "Chrono prêt"}</p>
      <p className="text-2xl font-bold tabular-nums sm:text-4xl">{timeLeft}s</p>
      </div>
      {!isRunning && timeLeft > 0 && (
        <button
          onClick={() => setIsRunning(true)}
          className="min-h-11 rounded-xl bg-white px-4 py-2 text-sm font-bold text-black sm:mt-3 sm:w-full sm:rounded-2xl sm:py-4 sm:text-lg"
        >
          Lancer le chrono
        </button>
      )}
    </div>
  );
}
