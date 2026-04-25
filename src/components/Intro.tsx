"use client";

import { useState } from "react";

export default function Intro({ children }: { children: React.ReactNode }) {
  const [showIntro, setShowIntro] = useState(true);

  function finishIntro() {
    setShowIntro(false);
  }

  if (showIntro) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
        <video
          src="/videos/intro.mp4"
          autoPlay
          muted
          playsInline
          onEnded={finishIntro}
          className="h-full w-full object-cover"
        />

        <button
          onClick={finishIntro}
          className="absolute right-5 top-5 rounded bg-black/50 px-3 py-1 text-sm text-white"
        >
          Skip
        </button>
      </div>
    );
  }

  return <>{children}</>;
}